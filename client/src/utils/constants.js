export const TASK_STATUSES = ['To Do', 'In Progress', 'Done'];
export const PRIORITIES = ['Low', 'Medium', 'High'];

export const statusColors = {
  'To Do': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Done: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Overdue: 'bg-rose-50 text-rose-700 border-rose-200'
};

export const priorityColors = {
  Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  High: 'bg-rose-50 text-rose-700 border-rose-200'
};

export const isOverdue = (task) => {
  if (!task?.dueDate || task.status === 'Done') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate) < today;
};

export const taskDisplayStatus = (task) => (isOverdue(task) ? 'Overdue' : task.status);

export const taskDisplayStatusColor = (task) => statusColors[taskDisplayStatus(task)];

export const initials = (name = '') => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};
