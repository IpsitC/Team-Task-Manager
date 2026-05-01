import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';

const populateTask = [
  { path: 'assignedTo', select: 'name email designation' },
  { path: 'assignees', select: 'name email designation' },
  { path: 'createdBy', select: 'name email designation' }
];

const isProjectMember = (project, userId) => {
  if (!userId) return true;
  return project.members.some((member) => member.user.equals(userId));
};

const normalizeAssigneeIds = (payload) => {
  const rawAssignees = Array.isArray(payload.assignees)
    ? payload.assignees
    : payload.assignedTo
      ? [payload.assignedTo]
      : [];

  return [...new Set(rawAssignees.filter(Boolean).map((id) => id.toString()))];
};

const getTaskAssigneeIds = (task) => {
  if (task.assignees?.length) {
    return task.assignees.map((assignee) => (assignee._id || assignee).toString());
  }
  return task.assignedTo ? [(task.assignedTo._id || task.assignedTo).toString()] : [];
};

const hasAssignee = (task, userId) => getTaskAssigneeIds(task).some((assigneeId) => assigneeId === userId.toString());

const areProjectMembers = (project, userIds) => userIds.every((userId) => isProjectMember(project, userId));

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const validateTaskState = ({ assignees, dueDate, status }) => {
  if (!assignees.length && status !== 'To Do') {
    throw new ApiError('Unassigned tasks must stay in To Do', 422);
  }

  if (status !== 'Done' && new Date(dueDate) < startOfToday()) {
    throw new ApiError('Open tasks cannot have a past due date', 422);
  }
};

export const createTask = asyncHandler(async (req, res) => {
  const project = req.project;
  const { title, description, dueDate, priority } = req.body;
  const status = req.body.status || 'To Do';
  const assignees = normalizeAssigneeIds(req.body);

  if (!assignees.length) {
    throw new ApiError('At least one assignee is required', 422);
  }

  if (!areProjectMembers(project, assignees)) {
    throw new ApiError('Assigned users must be project members', 422);
  }

  validateTaskState({ assignees, dueDate, status });

  const task = await Task.create({
    title: title.trim(),
    description: description?.trim() || '',
    dueDate,
    priority,
    assignedTo: assignees[0],
    assignees,
    status,
    projectId: project._id,
    createdBy: req.user._id
  });

  const populated = await task.populate(populateTask);

  res.status(201).json({
    success: true,
    task: populated
  });
});

export const getTasksByProject = asyncHandler(async (req, res) => {
  const { priority, status, assignee, search } = req.query;
  const query = { projectId: req.project._id };

  if (priority && priority !== 'All') query.priority = priority;
  if (status && status !== 'All') query.status = status;
  if (assignee && assignee !== 'All') query.$or = [{ assignedTo: assignee }, { assignees: assignee }];
  if (search) query.title = { $regex: search, $options: 'i' };

  const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 }).populate(populateTask);

  res.json({
    success: true,
    tasks
  });
});

export const getMyTasks = asyncHandler(async (req, res) => {
  const projects = await Project.find({ 'members.user': req.user._id }).select('_id');
  const projectIds = projects.map((project) => project._id);

  const tasks = await Task.find({
    projectId: { $in: projectIds },
    $or: [{ assignedTo: req.user._id }, { assignees: req.user._id }]
  })
    .sort({ status: 1, dueDate: 1, updatedAt: -1 })
    .populate(populateTask)
    .populate('projectId', 'name');

  res.json({
    success: true,
    tasks
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError('Task not found', 404);
  }

  const project = await Project.findById(task.projectId);
  const membership = project?.members.find((member) => member.user.equals(req.user._id));

  if (!project || !membership) {
    throw new ApiError('You do not have access to this task', 403);
  }

  if (membership.role !== 'admin') {
    if (!hasAssignee(task, req.user._id)) {
      throw new ApiError('Members can only update their own tasks', 403);
    }

    const attemptedFields = Object.keys(req.body).filter((field) => field !== 'status');
    if (attemptedFields.length > 0) {
      throw new ApiError('Members can only update task status', 403);
    }
  }

  if (req.body.assignees !== undefined) {
    req.body.assignees = normalizeAssigneeIds(req.body);
    req.body.assignedTo = req.body.assignees[0] || null;
  } else if (req.body.assignedTo === '' || req.body.assignedTo === null) {
    req.body.assignedTo = null;
    req.body.assignees = [];
  } else if (req.body.assignedTo) {
    req.body.assignees = [req.body.assignedTo];
  }

  const nextAssignees =
    req.body.assignees !== undefined ? req.body.assignees : getTaskAssigneeIds(task);

  if (!areProjectMembers(project, nextAssignees)) {
    throw new ApiError('Assigned users must be project members', 422);
  }

  const nextTaskState = {
    assignees: nextAssignees,
    dueDate: req.body.dueDate !== undefined ? req.body.dueDate : task.dueDate,
    status: req.body.status !== undefined ? req.body.status : task.status
  };

  validateTaskState(nextTaskState);

  const allowedFields =
    membership.role === 'admin'
      ? ['title', 'description', 'dueDate', 'priority', 'assignedTo', 'assignees', 'status']
      : ['status'];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
    }
  });

  await task.save();
  const populated = await task.populate(populateTask);

  res.json({
    success: true,
    task: populated
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError('Task not found', 404);
  }

  const project = await Project.findById(task.projectId);
  const membership = project?.members.find((member) => member.user.equals(req.user._id));

  if (!membership || membership.role !== 'admin') {
    throw new ApiError('Admin access required', 403);
  }

  await Task.findByIdAndDelete(req.params.id);
  res.json({
    success: true,
    message: 'Task deleted'
  });
});
