import Activity from '../models/Activity.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';

const populateMembers = [
  { path: 'members.user', select: 'name email designation' },
  { path: 'createdBy', select: 'name email designation' }
];

const getCompanyEmailDomain = () => (process.env.COMPANY_EMAIL_DOMAIN || 'taskflow.demo').toLowerCase();

const isCompanyEmail = (email) => email.toLowerCase().endsWith(`@${getCompanyEmailDomain()}`);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isWorkspaceOwner = (user) => user.email === (process.env.WORKSPACE_OWNER_EMAIL || 'rajesh.kumar@taskflow.demo').toLowerCase();

const getProjectMeta = async (projectIds) => {
  const stats = await Task.aggregate([
    { $match: { projectId: { $in: projectIds } } },
    {
      $group: {
        _id: '$projectId',
        totalTasks: { $sum: 1 },
        doneTasks: { $sum: { $cond: [{ $eq: ['$status', 'Done'] }, 1, 0] } }
      }
    }
  ]);

  return stats.reduce((acc, item) => {
    acc[item._id.toString()] = {
      totalTasks: item.totalTasks,
      doneTasks: item.doneTasks,
      progress: item.totalTasks ? Math.round((item.doneTasks / item.totalTasks) * 100) : 0
    };
    return acc;
  }, {});
};

const serializeProject = (project, meta = {}, currentUserId = null, currentUser = null) => {
  const item = project.toObject ? project.toObject() : project;
  const projectMeta = meta[item._id.toString()] || { totalTasks: 0, doneTasks: 0, progress: 0 };
  const membership = currentUserId
    ? item.members.find((member) => {
        const memberId = member.user?._id || member.user;
        return memberId?.toString() === currentUserId.toString();
      })
    : null;

  return {
    ...item,
    taskCount: projectMeta.totalTasks,
    doneTaskCount: projectMeta.doneTasks,
    progress: projectMeta.progress,
    isMember: Boolean(membership),
    currentUserRole: membership?.role || null,
    canDelete: Boolean(membership?.role === 'admin' || isWorkspaceOwner(currentUser || {}))
  };
};

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({
    name: req.body.name,
    description: req.body.description,
    createdBy: req.user._id,
    members: [{ user: req.user._id, role: 'admin' }]
  });

  await User.findByIdAndUpdate(req.user._id, { $addToSet: { projects: project._id } });
  const populated = await project.populate(populateMembers);

  res.status(201).json({
    success: true,
    project: serializeProject(populated, {}, req.user._id, req.user)
  });
});

export const getMyProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ 'members.user': req.user._id })
    .sort({ updatedAt: -1 })
    .populate(populateMembers);
  const meta = await getProjectMeta(projects.map((project) => project._id));

  res.json({
    success: true,
    projects: projects.map((project) => serializeProject(project, meta, req.user._id, req.user))
  });
});

export const getDiscoverProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({}).sort({ updatedAt: -1 }).populate(populateMembers);
  const meta = await getProjectMeta(projects.map((project) => project._id));

  res.json({
    success: true,
    projects: projects.map((project) => serializeProject(project, meta, req.user._id, req.user))
  });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(populateMembers);

  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  const membership = project.members.find((member) => member.user._id.equals(req.user._id));

  if (!membership && !isWorkspaceOwner(req.user)) {
    throw new ApiError('You do not have access to this project', 403);
  }

  const meta = await getProjectMeta([project._id]);
  res.json({
    success: true,
    project: serializeProject(project, meta, req.user._id, req.user),
    currentUserRole: membership?.role || 'workspace-owner',
    activity: []
  });
});

export const getAvailableMembers = asyncHandler(async (req, res) => {
  const project = req.project;
  const memberIds = project.members.map((member) => member.user);
  const domain = getCompanyEmailDomain();
  const users = await User.find({
    _id: { $nin: memberIds },
    email: { $regex: `@${escapeRegex(domain)}$`, $options: 'i' }
  })
    .select('name email designation')
    .sort({ name: 1 });

  res.json({
    success: true,
    domain,
    users
  });
});

export const joinProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  if (project.members.some((member) => member.user.equals(req.user._id))) {
    throw new ApiError('You are already a member of this project', 409);
  }

  project.members.push({ user: req.user._id, role: 'member' });
  await project.save();
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { projects: project._id } });
  const populated = await project.populate(populateMembers);
  const meta = await getProjectMeta([project._id]);

  res.json({
    success: true,
    project: serializeProject(populated, meta, req.user._id, req.user)
  });
});

export const leaveProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  const membership = project.members.find((member) => member.user.equals(req.user._id));

  if (!membership) {
    throw new ApiError('You are not a member of this project', 404);
  }

  const assignedTasks = await Task.find({
    projectId: project._id,
    $or: [{ assignedTo: req.user._id }, { assignees: req.user._id }]
  });

  await Promise.all(
    assignedTasks.map((task) => {
      task.assignees = (task.assignees || []).filter((assignee) => !assignee.equals(req.user._id));
      if (task.assignedTo?.equals(req.user._id)) {
        task.assignedTo = task.assignees[0] || null;
      }
      if (!task.assignees.length) {
        task.status = 'To Do';
      }
      return task.save();
    })
  );

  if (project.members.length === 1) {
    await Task.deleteMany({ projectId: project._id });
    await Activity.deleteMany({ projectId: project._id });
    await User.findByIdAndUpdate(req.user._id, { $pull: { projects: project._id } });
    await Project.findByIdAndDelete(project._id);

    res.json({
      success: true,
      deleted: true,
      message: 'Project removed because you were the last member'
    });
    return;
  }

  project.members = project.members.filter((member) => !member.user.equals(req.user._id));

  const hasAdmin = project.members.some((member) => member.role === 'admin');
  if (!hasAdmin) {
    project.members[0].role = 'admin';
  }

  await project.save();
  await User.findByIdAndUpdate(req.user._id, { $pull: { projects: project._id } });
  const populated = await project.populate(populateMembers);
  const meta = await getProjectMeta([project._id]);

  res.json({
    success: true,
    project: serializeProject(populated, meta, req.user._id, req.user)
  });
});

export const addMember = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const project = req.project;

  if (!isCompanyEmail(email)) {
    throw new ApiError(`Only @${getCompanyEmailDomain()} email addresses can be added`, 422);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError('No registered user found with that company email', 404);
  }

  if (project.members.some((member) => member.user.equals(user._id))) {
    throw new ApiError('User is already a project member', 409);
  }

  project.members.push({ user: user._id, role: 'member' });
  await project.save();
  await User.findByIdAndUpdate(user._id, { $addToSet: { projects: project._id } });
  const populated = await project.populate(populateMembers);

  res.json({
    success: true,
    project: serializeProject(populated, {}, req.user._id, req.user)
  });
});

export const removeMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const project = req.project;

  if (req.user._id.equals(userId)) {
    throw new ApiError('Project admins cannot remove themselves', 400);
  }

  const member = project.members.find((item) => item.user.equals(userId));

  if (!member) {
    throw new ApiError('User is not a project member', 404);
  }

  const assignedTasks = await Task.countDocuments({
    projectId: project._id,
    $or: [{ assignedTo: userId }, { assignees: userId }]
  });

  if (assignedTasks > 0) {
    throw new ApiError("Reassign this member's tasks before removing them", 409);
  }

  project.members = project.members.filter((item) => !item.user.equals(userId));
  await project.save();
  await User.findByIdAndUpdate(userId, { $pull: { projects: project._id } });
  const populated = await project.populate(populateMembers);

  res.json({
    success: true,
    project: serializeProject(populated, {}, req.user._id, req.user)
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = req.project;
  const memberIds = project.members.map((member) => member.user);

  await Task.deleteMany({ projectId: project._id });
  await Activity.deleteMany({ projectId: project._id });
  await User.updateMany({ _id: { $in: memberIds } }, { $pull: { projects: project._id } });
  await Project.findByIdAndDelete(project._id);

  res.json({
    success: true,
    message: 'Project deleted'
  });
});
