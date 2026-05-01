import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Modal from '../common/Modal.jsx';
import { PRIORITIES, TASK_STATUSES, initials } from '../../utils/constants.js';
import { toInputDate } from '../../utils/date.js';

const emptyForm = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'Medium',
  assignees: [],
  status: 'To Do'
};

const getTaskAssigneeIds = (task) => {
  if (task?.assignees?.length) return task.assignees.map((assignee) => assignee._id);
  return task?.assignedTo?._id ? [task.assignedTo._id] : [];
};

const isValidDateEntry = (value) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    year >= 1900 &&
    year <= 2100 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const todayInputValue = () => new Date().toISOString().slice(0, 10);

const isPastDate = (value) => {
  if (!value) return false;
  return value < todayInputValue();
};

const TaskModal = ({ open, task, project, defaultStatus, isAdmin, currentUserId, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [dueDateError, setDueDateError] = useState('');
  const [assigneeError, setAssigneeError] = useState('');
  const isEditing = Boolean(task);
  const canEditAll = isAdmin || !isEditing;
  const taskAssigneeIds = getTaskAssigneeIds(task);
  const canUpdateStatus = isAdmin || taskAssigneeIds.includes(currentUserId);
  const statusOptions = form.assignees.length ? TASK_STATUSES : ['To Do'];

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        dueDate: toInputDate(task.dueDate),
        priority: task.priority,
        assignees: getTaskAssigneeIds(task),
        status: task.status
      });
    } else {
      const defaultAssignee = project?.members?.[0]?.user?._id;
      setForm({
        ...emptyForm,
        status: defaultStatus || 'To Do',
        assignees: defaultAssignee ? [defaultAssignee] : []
      });
    }
    setDueDateError('');
    setAssigneeError('');
  }, [task, defaultStatus, project]);

  const update = (field, value) => {
    if (field === 'dueDate') {
      setDueDateError('');
    }
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleAssignee = (userId) => {
    setAssigneeError('');
    setForm((current) => {
      const assignees = current.assignees.includes(userId)
        ? current.assignees.filter((assigneeId) => assigneeId !== userId)
        : [...current.assignees, userId];

      return {
        ...current,
        assignees,
        status: assignees.length ? current.status : 'To Do'
      };
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    setDueDateError('');
    setAssigneeError('');

    if (canEditAll && !isValidDateEntry(form.dueDate)) {
      setDueDateError('Use a valid date in YYYY-MM-DD format.');
      return;
    }

    if (canEditAll && form.status !== 'Done' && isPastDate(form.dueDate)) {
      setDueDateError('Open tasks need today or a future due date.');
      return;
    }

    if (canEditAll && !form.assignees.length && !isEditing) {
      setAssigneeError('Select at least one assignee.');
      return;
    }

    if (canEditAll && !form.assignees.length && form.status !== 'To Do') {
      setAssigneeError('Unassigned tasks must stay in To Do.');
      return;
    }

    setSaving(true);
    try {
      const payload = canEditAll
        ? { ...form, assignedTo: form.assignees[0] || '' }
        : { status: form.status };
      await onSave(payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={isEditing ? 'Task details' : 'Create task'}
      onClose={onClose}
      footer={
        <>
          {isEditing && isAdmin && (
            <Button variant="danger" onClick={onDelete} disabled={saving}>
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="task-form" disabled={saving || (!canEditAll && !canUpdateStatus)}>
            Save
          </Button>
        </>
      }
    >
      <form id="task-form" onSubmit={submit} className="grid gap-4">
        <Input label="Title" value={form.title} onChange={(event) => update('title', event.target.value)} disabled={!canEditAll} required />
        <Input label="Description" as="textarea" value={form.description} onChange={(event) => update('description', event.target.value)} disabled={!canEditAll} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Due date"
            type="date"
            min={form.status === 'Done' ? '1900-01-01' : todayInputValue()}
            max="2100-12-31"
            value={form.dueDate}
            onChange={(event) => update('dueDate', event.target.value)}
            disabled={!canEditAll}
            error={dueDateError}
            required
          />
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Priority</span>
            <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm" value={form.priority} onChange={(event) => update('priority', event.target.value)} disabled={!canEditAll}>
              {PRIORITIES.map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </label>
          <fieldset className="sm:col-span-2">
            <legend className="mb-1.5 block text-sm font-semibold text-slate-700">Assignees</legend>
            <div className="grid max-h-44 gap-2 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 sm:grid-cols-2">
              {project?.members?.map((member) => {
                const selected = form.assignees.includes(member.user._id);
                return (
                  <label
                    key={member.user._id}
                    className={clsx(
                      'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition',
                      selected ? 'border-blue-200 bg-blue-50 text-blue-900' : 'border-slate-100 bg-white text-slate-700 hover:border-slate-200',
                      !canEditAll && 'cursor-not-allowed opacity-70'
                    )}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={selected}
                      onChange={() => toggleAssignee(member.user._id)}
                      disabled={!canEditAll}
                    />
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-xs font-bold text-blue-700 shadow-sm">
                      {initials(member.user.name)}
                    </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold">{member.user.name}</span>
                      <span className="block truncate text-xs text-slate-500">{member.user.designation || member.user.email}</span>
                      </span>
                  </label>
                );
              })}
            </div>
            {assigneeError && <span className="mt-1 block text-xs font-medium text-rose-600">{assigneeError}</span>}
          </fieldset>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Status</span>
            <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm" value={form.status} onChange={(event) => update('status', event.target.value)} disabled={!canUpdateStatus && !isAdmin}>
              {statusOptions.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
