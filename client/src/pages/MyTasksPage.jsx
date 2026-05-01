import { AlertTriangle, CalendarDays, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../components/common/Badge.jsx';
import Spinner from '../components/common/Spinner.jsx';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import { useMyTasks } from '../hooks/useMyTasks.js';
import { isOverdue, priorityColors, taskDisplayStatus, taskDisplayStatusColor } from '../utils/constants.js';
import { formatDate } from '../utils/date.js';

const taskSort = (a, b) => {
  if (isOverdue(a) !== isOverdue(b)) return isOverdue(a) ? -1 : 1;
  if ((a.status === 'Done') !== (b.status === 'Done')) return a.status === 'Done' ? 1 : -1;
  return new Date(a.dueDate) - new Date(b.dueDate);
};

const MyTasksPage = () => {
  const { tasks, loading } = useMyTasks();
  const sortedTasks = [...tasks].sort(taskSort);
  const activeTaskCount = tasks.filter((task) => task.status !== 'Done').length;
  const overdueCount = tasks.filter(isOverdue).length;

  return (
    <PageWrapper>
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">My tasks</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950">Assigned to you</h1>
            <p className="mt-2 max-w-2xl text-slate-500">A focused list of tasks assigned to you across all joined projects.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="border-slate-200 bg-slate-50 text-slate-600">{activeTaskCount} active</Badge>
            <Badge className={overdueCount ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}>
              {overdueCount} overdue
            </Badge>
          </div>
        </div>
      </div>

      {loading ? (
        <Spinner label="Loading your tasks" />
      ) : sortedTasks.length > 0 ? (
        <div className="grid gap-3 xl:grid-cols-2">
          {sortedTasks.map((task) => (
            <Link
              key={task._id}
              to={`/projects/${task.projectId?._id || task.projectId}`}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-card transition hover:border-blue-200 hover:bg-blue-50/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-950">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{task.projectId?.name}</p>
                </div>
                {isOverdue(task) ? <AlertTriangle className="shrink-0 text-rose-500" size={20} /> : <CalendarDays className="shrink-0 text-blue-500" size={20} />}
              </div>
              {task.description && <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-500">{task.description}</p>}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge className={taskDisplayStatusColor(task)}>{taskDisplayStatus(task)}</Badge>
                <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                <span className={`ml-auto text-sm font-semibold ${isOverdue(task) ? 'text-rose-600' : 'text-slate-500'}`}>
                  {formatDate(task.dueDate)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <CheckCircle2 className="mx-auto text-emerald-500" size={30} />
          <h2 className="mt-3 text-lg font-bold text-slate-950">No tasks assigned to you</h2>
          <p className="mt-2 text-sm text-slate-500">When a project admin assigns work to you, it will appear here.</p>
        </div>
      )}
    </PageWrapper>
  );
};

export default MyTasksPage;
