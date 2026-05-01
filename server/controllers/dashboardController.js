import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { asyncHandler } from '../utils/apiError.js';

const statuses = ['To Do', 'In Progress', 'Done'];

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const isOverdue = (task, today) => task.status !== 'Done' && new Date(task.dueDate) < today;

const attentionRank = (task, today) => {
  if (isOverdue(task, today)) return 0;
  if (task.priority === 'High') return 1;
  if (task.status === 'In Progress') return 2;
  return 3;
};

export const getStats = asyncHandler(async (req, res) => {
  const projects = await Project.find({ 'members.user': req.user._id }).select('_id');
  const projectIds = projects.map((project) => project._id);
  const tasks = await Task.find({ projectId: { $in: projectIds } })
    .populate('assignedTo', 'name email designation')
    .populate('assignees', 'name email designation')
    .populate('projectId', 'name')
    .sort({ updatedAt: -1 });

  const today = startOfToday();
  const byStatus = statuses.map((status) => ({
    name: status,
    value: tasks.filter((task) => task.status === status).length
  }));
  const completed = byStatus.find((item) => item.name === 'Done')?.value || 0;
  const inProgress = byStatus.find((item) => item.name === 'In Progress')?.value || 0;
  const overdue = tasks.filter((task) => isOverdue(task, today)).length;
  const userMap = new Map();

  tasks.forEach((task) => {
    const assignees = task.assignees?.length ? task.assignees : task.assignedTo ? [task.assignedTo] : [];

    if (!assignees.length) {
      const current = userMap.get('unassigned') || { name: 'Unassigned', total: 0 };
      current.total += 1;
      userMap.set('unassigned', current);
      return;
    }

    assignees.forEach((assignee) => {
      const userId = assignee._id.toString();
      const current = userMap.get(userId) || {
        name: assignee.name,
        total: 0
      };
      current.total += 1;
      userMap.set(userId, current);
    });
  });

  const urgentTasks = tasks
    .filter((task) => isOverdue(task, today) || task.priority === 'High' || task.status === 'In Progress')
    .sort((a, b) => {
      const rankDiff = attentionRank(a, today) - attentionRank(b, today);
      if (rankDiff !== 0) return rankDiff;
      return new Date(a.dueDate) - new Date(b.dueDate);
    })
    .slice(0, 5);

  res.json({
    success: true,
    stats: {
      totals: {
        tasks: tasks.length,
        completed,
        inProgress,
        overdue
      },
      byStatus,
      tasksPerUser: Array.from(userMap.values()),
      urgentTasks
    }
  });
});
