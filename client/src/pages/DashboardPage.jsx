import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, FolderKanban, ListTodo, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { useDashboard } from '../hooks/useDashboard.js';
import { useProjects } from '../hooks/useProjects.js';
import { isOverdue, priorityColors, statusColors, taskDisplayStatus, taskDisplayStatusColor } from '../utils/constants.js';
import { formatDate } from '../utils/date.js';
import Badge from '../components/common/Badge.jsx';

const statCards = [
  { key: 'tasks', label: 'Total tasks', helper: 'Across your projects', icon: ListTodo, color: 'text-slate-700' },
  { key: 'completed', label: 'Completed', helper: 'Finished work', icon: CheckCircle2, color: 'text-emerald-600' },
  { key: 'inProgress', label: 'In progress', helper: 'Moving right now', icon: Clock3, color: 'text-blue-600' },
  { key: 'overdue', label: 'Overdue', helper: 'Needs attention', icon: AlertTriangle, color: 'text-rose-600' }
];

const assigneeNames = (task) => {
  const assignees = task.assignees?.length ? task.assignees : task.assignedTo ? [task.assignedTo] : [];
  return assignees.map((assignee) => assignee.name).join(', ') || 'Unassigned';
};

const DashboardPage = () => {
  const { stats, loading } = useDashboard();
  const { projects, loading: projectsLoading } = useProjects();
  const totalTasks = stats?.totals?.tasks || 0;
  const urgentTasks = stats?.urgentTasks || [];

  if (loading || projectsLoading) {
    return (
      <PageWrapper>
        <Spinner label="Loading dashboard" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Command center</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-slate-500">Start here to see what is active, what needs attention, and which projects are closest to done.</p>
          </div>
          <Link to="/projects" className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600">
            Open projects
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">{label}</p>
              <Icon className={color} size={20} />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-950">{stats?.totals?.[key] || 0}</p>
            <p className="mt-1 text-xs font-semibold text-slate-400">{statCards.find((card) => card.key === key)?.helper}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Tasks by status</h2>
              <p className="mt-1 text-sm text-slate-500">Required dashboard summary across your projects.</p>
            </div>
            <Badge className="border-slate-200 bg-slate-50 text-slate-600">{totalTasks} total</Badge>
          </div>
          <div className="space-y-4">
            {(stats?.byStatus || []).map((item) => {
              const percent = totalTasks ? Math.round((item.value / totalTasks) * 100) : 0;
              return (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Badge className={statusColors[item.name]}>{item.name}</Badge>
                    <span className="text-sm font-bold text-slate-600">{item.value} tasks</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Tasks per user</h2>
              <p className="mt-1 text-sm text-slate-500">Assignment load by teammate.</p>
            </div>
            <Users className="text-blue-500" size={22} />
          </div>
          <div className="space-y-3">
            {(stats?.tasksPerUser || []).map((user) => {
              const percent = totalTasks ? Math.round((user.total / totalTasks) * 100) : 0;
              return (
                <div key={user.name} className="rounded-xl border border-slate-200 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="font-bold text-slate-900">{user.name}</span>
                    <span className="text-sm font-bold text-slate-500">{user.total} tasks</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-indigo-500 transition-all" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
            {(stats?.tasksPerUser || []).length === 0 && <p className="py-8 text-center text-sm font-medium text-slate-400">No assignments yet</p>}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">Active projects</h2>
            <Link to="/projects" className="text-sm font-bold text-blue-600">View all</Link>
          </div>
          <div className="grid gap-3">
            {projects.slice(0, 4).map((project) => (
              <Link key={project._id} to={`/projects/${project._id}`} className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-950">{project.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{project.taskCount || 0} tasks / {project.members?.length || 0} members</p>
                  </div>
                  <FolderKanban className="text-blue-500" size={20} />
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${project.progress || 0}%` }} />
                </div>
                <p className="mt-2 text-xs font-bold text-slate-400">{project.progress || 0}% complete</p>
              </Link>
            ))}
            {projects.length === 0 && <p className="py-8 text-center text-sm font-medium text-slate-400">No projects yet</p>}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-4 text-lg font-bold text-slate-950">Needs attention</h2>
          <div className="divide-y divide-slate-100">
            {urgentTasks.map((task) => (
              <div key={task._id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{task.title}</p>
                  <p className="text-sm text-slate-500">{task.projectId?.name} / {assigneeNames(task)}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                    <Badge className={taskDisplayStatusColor(task)}>{taskDisplayStatus(task)}</Badge>
                  </div>
                </div>
                <span className={`shrink-0 text-sm font-semibold ${isOverdue(task) ? 'text-rose-600' : 'text-slate-500'}`}>{formatDate(task.dueDate)}</span>
              </div>
            ))}
            {urgentTasks.length === 0 && <p className="py-8 text-center text-sm font-medium text-slate-400">Nothing urgent right now</p>}
          </div>
        </div>
      </section>

    </PageWrapper>
  );
};

export default DashboardPage;
