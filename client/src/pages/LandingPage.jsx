import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Clock3,
  FolderKanban,
  ListChecks,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import ThemeToggle from '../components/common/ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const features = [
  { icon: FolderKanban, title: 'Project boards', body: 'Organize tasks by project, ownership, status, and priority.' },
  { icon: ShieldCheck, title: 'Role-aware access', body: 'Admins control members and task details while teammates update their own work.' },
  { icon: BarChart3, title: 'Live analytics', body: 'Track progress, overdue work, and workload distribution at a glance.' }
];

const workflowSteps = [
  {
    title: 'Create a project',
    eyebrow: 'Step 01',
    metric: '3 teams aligned',
    icon: FolderKanban,
    accent: 'bg-blue-500',
    body: 'Start a workspace for a launch, sprint, client delivery, or internal backlog.',
    cards: [
      { title: 'Website Launch Sprint', meta: '4 members', status: 'Planning', color: 'border-blue-200 bg-blue-50' },
      { title: 'Mobile App Beta', meta: '3 members', status: 'Active', color: 'border-emerald-200 bg-emerald-50' }
    ]
  },
  {
    title: 'Invite your team',
    eyebrow: 'Step 02',
    metric: 'Role safe',
    icon: UserPlus,
    accent: 'bg-emerald-500',
    body: 'Add teammates by email and keep admin controls separate from member updates.',
    cards: [
      { title: 'Rajesh Kumar', meta: 'Engineering Manager', status: 'Admin', color: 'border-slate-200 bg-white' },
      { title: 'Priya Nair', meta: 'Product Manager', status: 'Member', color: 'border-emerald-200 bg-emerald-50' },
      { title: 'Arjun Mehta', meta: 'Senior Backend Engineer', status: 'Member', color: 'border-blue-200 bg-blue-50' }
    ]
  },
  {
    title: 'Assign and move tasks',
    eyebrow: 'Step 03',
    metric: 'Live board',
    icon: ListChecks,
    accent: 'bg-amber-500',
    body: 'Turn work into assigned tasks, then move them through To Do, In Progress, and Done.',
    cards: [
      { title: 'Finalize onboarding journey', meta: 'High priority', status: 'In Progress', color: 'border-amber-200 bg-amber-50' },
      { title: 'Build document upload API', meta: 'Arjun Mehta', status: 'To Do', color: 'border-slate-200 bg-white' },
      { title: 'Prepare regression test plan', meta: 'Done', status: 'Complete', color: 'border-emerald-200 bg-emerald-50' }
    ]
  },
  {
    title: 'Track progress',
    eyebrow: 'Step 04',
    metric: '72% complete',
    icon: BarChart3,
    accent: 'bg-rose-500',
    body: 'Spot overdue work, workload balance, and project health before status meetings.',
    cards: [
      { title: 'Completed tasks', meta: '18', status: '+24%', color: 'border-emerald-200 bg-emerald-50' },
      { title: 'Overdue tasks', meta: '2', status: 'Needs review', color: 'border-rose-200 bg-rose-50' }
    ]
  }
];

const demoColumns = [
  {
    title: 'To Do',
    tasks: [
      { title: 'Build document upload API', owner: 'AM', priority: 'High' },
      { title: 'Audit stale task ownership', owner: 'VS', priority: 'High' }
    ]
  },
  {
    title: 'In Progress',
    tasks: [
      { title: 'Define payment approval rules', owner: 'PN', priority: 'High' },
      { title: 'Create lead assignment board', owner: 'NS', priority: 'High' }
    ]
  },
  {
    title: 'Done',
    tasks: [
      { title: 'Publish rollout checklist', owner: 'RK', priority: 'Low' },
      { title: 'Prepare regression test plan', owner: 'VS', priority: 'Medium' }
    ]
  }
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const selectedStep = workflowSteps[activeStep];

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500 text-lg font-extrabold text-white">T</div>
          <span className="text-lg font-extrabold text-slate-950">TaskFlow</span>
        </Link>
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white hover:text-slate-950">
            Login
          </Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </nav>
        </div>
      </header>
      <main>
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-10 md:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
              <Sparkles size={16} />
              Collaborative task management
            </div>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-tight text-slate-950 md:text-6xl">TaskFlow</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Plan projects, assign ownership, move work through a clean kanban flow, and read team progress without chasing status updates.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup">
                <Button className="w-full sm:w-auto">
                  Start managing work
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Login
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-white">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-300">Launch sprint</p>
                  <p className="mt-1 text-2xl font-extrabold">72% complete</p>
                </div>
                <div className="rounded-full bg-emerald-400/15 p-3 text-emerald-300">
                  <CheckCircle2 size={24} />
                </div>
              </div>
              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Done', value: '18', icon: CheckCircle2, tone: 'text-emerald-300' },
                  { label: 'In progress', value: '7', icon: Clock3, tone: 'text-blue-300' },
                  { label: 'Due today', value: '4', icon: CalendarDays, tone: 'text-amber-300' }
                ].map(({ label, value, icon: Icon, tone }) => (
                  <div key={label} className="rounded-lg bg-white/10 p-3">
                    <Icon className={tone} size={18} />
                    <p className="mt-3 text-xl font-extrabold">{value}</p>
                    <p className="text-xs font-semibold text-slate-300">{label}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {demoColumns.map((column) => (
                  <div key={column.title} className="rounded-lg bg-white/10 p-3">
                    <p className="mb-3 text-xs font-bold text-slate-300">{column.title}</p>
                    {column.tasks.map((task) => (
                      <div key={task.title} className="mb-2 rounded-lg bg-white p-3 text-slate-950 shadow-sm last:mb-0">
                        <p className="text-xs font-bold leading-4">{task.title}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500">{task.priority}</span>
                          <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-50 text-[10px] font-extrabold text-blue-700">{task.owner}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">How it works</p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-950">From idea to done in one workspace</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-500">
                Click through the workflow to see how projects, people, tasks, and analytics connect.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="grid gap-3">
                {workflowSteps.map((step, index) => {
                  const Icon = step.icon;
                  const active = activeStep === index;

                  return (
                    <button
                      key={step.title}
                      type="button"
                      onClick={() => setActiveStep(index)}
                      className={`rounded-xl border p-4 text-left transition ${
                        active ? 'border-blue-300 bg-blue-50 shadow-card' : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white ${step.accent}`}>
                          <Icon size={18} />
                        </span>
                        <span>
                          <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{step.eyebrow}</span>
                          <span className="mt-1 block font-extrabold text-slate-950">{step.title}</span>
                          <span className="mt-1 block text-sm leading-6 text-slate-500">{step.body}</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-card">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{selectedStep.eyebrow}</p>
                      <h3 className="mt-1 text-2xl font-extrabold text-slate-950">{selectedStep.title}</h3>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <p className="text-xs font-bold text-slate-400">Current signal</p>
                      <p className="mt-1 font-extrabold text-slate-950">{selectedStep.metric}</p>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {selectedStep.cards.map((card) => (
                      <div key={card.title} className={`rounded-xl border p-4 ${card.color}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-950">{card.title}</p>
                            <p className="mt-1 text-sm font-medium text-slate-500">{card.meta}</p>
                          </div>
                          <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-600 shadow-sm">{card.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      { icon: Users, label: 'Owners visible' },
                      { icon: MessageSquareText, label: 'Comments ready' },
                      { icon: CircleDot, label: 'Status clear' }
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="rounded-lg border border-slate-200 bg-white p-3">
                        <Icon className="text-blue-500" size={18} />
                        <p className="mt-3 text-sm font-bold text-slate-700">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-14">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-3 md:px-6">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <Icon className="mb-4 text-blue-500" size={24} />
                <h2 className="font-bold text-slate-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
