import { AlertTriangle, CheckCircle2, Clock3, ListTodo, TrendingUp, Users } from 'lucide-react';
import StatusPieChart from '../components/charts/StatusPieChart.jsx';
import UserBarChart from '../components/charts/UserBarChart.jsx';
import Spinner from '../components/common/Spinner.jsx';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import { useDashboard } from '../hooks/useDashboard.js';

const metrics = [
  { key: 'tasks', label: 'Total tasks', icon: ListTodo, tone: 'text-slate-700' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, tone: 'text-emerald-600' },
  { key: 'inProgress', label: 'In progress', icon: Clock3, tone: 'text-blue-600' },
  { key: 'overdue', label: 'Overdue', icon: AlertTriangle, tone: 'text-rose-600' }
];

const AnalyticsPage = () => {
  const { stats, loading } = useDashboard();
  const totals = stats?.totals || {};
  const completionRate = totals.tasks ? Math.round((totals.completed / totals.tasks) * 100) : 0;
  const overdueRate = totals.tasks ? Math.round((totals.overdue / totals.tasks) * 100) : 0;
  const busiestUser = [...(stats?.tasksPerUser || [])].sort((a, b) => b.total - a.total)[0];

  if (loading) {
    return (
      <PageWrapper>
        <Spinner label="Loading analytics" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-950">Analytics</h1>
        <p className="mt-2 text-slate-500">A reporting view for completion, workload distribution, and project risk.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ key, label, icon: Icon, tone }) => (
          <div key={key} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">{label}</p>
              <Icon className={tone} size={20} />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-950">{stats?.totals?.[key] || 0}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Completion rate</p>
            <TrendingUp className="text-emerald-600" size={20} />
          </div>
          <p className="mt-4 text-3xl font-extrabold text-slate-950">{completionRate}%</p>
          <div className="mt-4 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${completionRate}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Overdue rate</p>
            <AlertTriangle className="text-rose-600" size={20} />
          </div>
          <p className="mt-4 text-3xl font-extrabold text-slate-950">{overdueRate}%</p>
          <div className="mt-4 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-rose-500" style={{ width: `${overdueRate}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Busiest user</p>
            <Users className="text-blue-600" size={20} />
          </div>
          <p className="mt-4 text-2xl font-extrabold text-slate-950">{busiestUser?.name || 'No assignments'}</p>
          <p className="mt-2 text-sm font-semibold text-slate-500">{busiestUser?.total || 0} assigned tasks</p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="text-lg font-bold text-slate-950">Status distribution</h2>
          <StatusPieChart data={stats?.byStatus || []} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="text-lg font-bold text-slate-950">Workload by user</h2>
          <UserBarChart data={stats?.tasksPerUser || []} />
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-4 text-lg font-bold text-slate-950">Status breakdown</h2>
          <div className="space-y-4">
            {(stats?.byStatus || []).map((item) => {
              const percent = totals.tasks ? Math.round((item.value / totals.tasks) * 100) : 0;
              return (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-700">{item.name}</span>
                    <span className="font-semibold text-slate-500">{item.value} tasks</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-4 text-lg font-bold text-slate-950">Workload table</h2>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Assigned</th>
                  <th className="px-4 py-3">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {(stats?.tasksPerUser || []).map((user) => {
                  const share = totals.tasks ? Math.round((user.total / totals.tasks) * 100) : 0;
                  return (
                    <tr key={user.name}>
                      <td className="px-4 py-3 font-semibold text-slate-900">{user.name}</td>
                      <td className="px-4 py-3 text-slate-600">{user.total}</td>
                      <td className="px-4 py-3 text-slate-600">{share}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default AnalyticsPage;
