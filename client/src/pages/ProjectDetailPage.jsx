import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { BarChart3, KanbanSquare, Plus, Trash2, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Spinner from '../components/common/Spinner.jsx';
import StatusPieChart from '../components/charts/StatusPieChart.jsx';
import UserBarChart from '../components/charts/UserBarChart.jsx';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import MemberPanel from '../components/projects/MemberPanel.jsx';
import KanbanColumn from '../components/tasks/KanbanColumn.jsx';
import TaskModal from '../components/tasks/TaskModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useProject } from '../hooks/useProject.js';
import { useTasks } from '../hooks/useTasks.js';
import { PRIORITIES, TASK_STATUSES, initials } from '../utils/constants.js';

const tabs = [
  { key: 'board', label: 'Task Board', icon: KanbanSquare },
  { key: 'members', label: 'Members', icon: Users },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 }
];

const getTaskAssigneeIds = (task) => {
  if (task.assignees?.length) return task.assignees.map((assignee) => assignee._id);
  return task.assignedTo?._id ? [task.assignedTo._id] : [];
};

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState('board');
  const [filters, setFilters] = useState({ priority: 'All', assignee: 'All', status: 'All', search: '' });
  const memoFilters = useMemo(() => filters, [filters]);
  const { project, isAdmin, currentUserRole, loading, addMember, removeMember, deleteProject } = useProject(projectId);
  const canViewTasks = Boolean(project?.isMember);
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask } = useTasks(projectId, memoFilters, { enabled: canViewTasks });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('To Do');
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const groupedTasks = useMemo(() => {
    return TASK_STATUSES.reduce((acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status);
      return acc;
    }, {});
  }, [tasks]);

  const liveProgress = useMemo(() => {
    if (!tasks.length) return project?.progress || 0;
    const doneTasks = tasks.filter((task) => task.status === 'Done').length;
    return Math.round((doneTasks / tasks.length) * 100);
  }, [project?.progress, tasks]);

  const chartData = useMemo(() => {
    const byStatus = TASK_STATUSES.map((status) => ({ name: status, value: tasks.filter((task) => task.status === status).length }));
    const byUser = project?.members?.map((member) => ({
      name: member.user.name,
      total: tasks.filter((task) => getTaskAssigneeIds(task).includes(member.user._id)).length
    })) || [];
    return { byStatus, byUser };
  }, [tasks, project]);

  const openCreateModal = (status) => {
    setSelectedTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const handleSaveTask = async (payload) => {
    if (selectedTask) {
      await updateTask(selectedTask._id, payload);
    } else {
      await createTask(payload);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    await deleteTask(selectedTask._id);
    setModalOpen(false);
  };

  const handleDragEnd = async ({ active, over }) => {
    if (!over || !active?.data?.current?.task) return;
    const task = active.data.current.task;
    const nextStatus = over.id;

    if (task.status === nextStatus) return;
    if (!isAdmin && !getTaskAssigneeIds(task).includes(user?.id)) {
      toast.error('You can only move your own tasks');
      return;
    }

    await updateTask(task._id, { status: nextStatus }, { silent: true });
  };

  const handleDeleteProject = async () => {
    const confirmed = window.confirm('Delete this project and all tasks?');
    if (!confirmed) return;
    await deleteProject();
    navigate('/projects');
  };

  if (loading || !project) {
    return (
      <PageWrapper>
        <Spinner label="Loading project" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">{currentUserRole}</span>
              <span className="text-sm font-semibold text-slate-400">{liveProgress}% complete</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-950">{project.name}</h1>
            <p className="mt-2 max-w-3xl text-slate-500">{project.description || 'No project description yet.'}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {project.members?.slice(0, 5).map((member) => (
                <div key={member.user._id} className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-slate-100 text-xs font-bold text-slate-700" title={member.user.name}>
                  {initials(member.user.name)}
                </div>
              ))}
            </div>
            {(isAdmin || project.canDelete) && (
              <Button variant="danger" onClick={handleDeleteProject}>
                <Trash2 size={16} />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="mb-5 flex flex-wrap gap-2 border-b border-slate-200">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-bold transition ${tab === key ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
      {tab === 'board' && (
        <>
          <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Task board</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {isAdmin ? 'Create, assign, and move project tasks.' : project.isMember ? 'Move tasks assigned to you as work progresses.' : 'Workspace owner view for project deletion.'}
                </p>
              </div>
              {isAdmin && (
                <Button onClick={() => openCreateModal('To Do')} className="w-full sm:w-auto">
                  <Plus size={16} />
                  Add Task
                </Button>
              )}
            </div>
            <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <Input aria-label="Search tasks" placeholder="Search tasks..." value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm" value={filters.priority} onChange={(event) => setFilters({ ...filters, priority: event.target.value })}>
              <option>All</option>
              {PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
            </select>
            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
              <option>All</option>
              {TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}
            </select>
            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm" value={filters.assignee} onChange={(event) => setFilters({ ...filters, assignee: event.target.value })}>
              <option value="All">All assignees</option>
              {project.members?.map((member) => <option key={member.user._id} value={member.user._id}>{member.user.name}</option>)}
            </select>
            </div>
          </div>
          {!canViewTasks && project?.canDelete ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-card">
              <h2 className="text-lg font-bold text-slate-950">Workspace owner access</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                You can delete this project as the workspace owner. Join the project first if you need to view or manage its tasks.
              </p>
            </div>
          ) : tasksLoading ? (
            <Spinner label="Loading tasks" />
          ) : (
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <div className="grid gap-4 xl:grid-cols-3">
                {TASK_STATUSES.map((status) => (
                  <KanbanColumn
                    key={status}
                    status={status}
                    tasks={groupedTasks[status] || []}
                    canCreate={isAdmin}
                    canDrag
                    onAddTask={openCreateModal}
                    onOpenTask={(task) => {
                      setSelectedTask(task);
                      setModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </DndContext>
          )}
        </>
      )}
      {tab === 'members' && <MemberPanel project={project} isAdmin={isAdmin} onAddMember={addMember} onRemoveMember={removeMember} />}
      {tab === 'analytics' && (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-lg font-bold text-slate-950">Status distribution</h2>
            <StatusPieChart data={chartData.byStatus} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-lg font-bold text-slate-950">Tasks per user</h2>
            <UserBarChart data={chartData.byUser} />
          </div>
        </div>
      )}
      <TaskModal
        open={modalOpen}
        task={selectedTask}
        project={project}
        defaultStatus={defaultStatus}
        isAdmin={isAdmin}
        currentUserId={user?.id}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </PageWrapper>
  );
};

export default ProjectDetailPage;
