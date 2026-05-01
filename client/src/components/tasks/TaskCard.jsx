import { useDraggable } from '@dnd-kit/core';
import clsx from 'clsx';
import { CalendarDays } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import { initials, isOverdue, priorityColors, taskDisplayStatus, taskDisplayStatusColor } from '../../utils/constants.js';
import { formatDate } from '../../utils/date.js';

const TaskCard = ({ task, onClick, draggable = true }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
    disabled: !draggable,
    data: { task }
  });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  const assignees = task.assignees?.length ? task.assignees : task.assignedTo ? [task.assignedTo] : [];
  const assigneeTitle = assignees.map((assignee) => assignee.name).join(', ') || 'Unassigned';

  return (
    <button
      ref={setNodeRef}
      style={style}
      type="button"
      onClick={onClick}
      className={clsx(
        'w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:shadow-card',
        isDragging && 'opacity-60',
        isOverdue(task) && 'border-rose-200 bg-rose-50/60'
      )}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="min-w-0 break-words text-sm font-bold leading-5 text-slate-950">{task.title}</h4>
        <Badge className={isOverdue(task) ? taskDisplayStatusColor(task) : priorityColors[task.priority]}>
          {isOverdue(task) ? taskDisplayStatus(task) : task.priority}
        </Badge>
      </div>
      {task.description && <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">{task.description}</p>}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <CalendarDays size={14} />
          {formatDate(task.dueDate)}
        </div>
        <div className="flex shrink-0 -space-x-2" title={assigneeTitle}>
          {assignees.slice(0, 3).map((assignee) => (
            <div key={assignee._id} className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-blue-50 text-xs font-bold text-blue-700">
              {initials(assignee.name)}
            </div>
          ))}
          {assignees.length > 3 && (
            <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-slate-100 text-xs font-bold text-slate-600">
              +{assignees.length - 3}
            </div>
          )}
          {!assignees.length && (
            <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
              UA
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default TaskCard;
