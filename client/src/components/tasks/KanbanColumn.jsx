import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import Button from '../common/Button.jsx';
import { statusColors } from '../../utils/constants.js';
import TaskCard from './TaskCard.jsx';

const KanbanColumn = ({ status, tasks, onAddTask, onOpenTask, canCreate, canDrag }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section ref={setNodeRef} className={clsx('min-h-[28rem] rounded-xl border border-slate-200 bg-slate-100/70 p-3', isOver && 'ring-4 ring-blue-100')}>
      <div className="mb-3 flex min-h-9 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={clsx('inline-flex min-w-20 items-center justify-center whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-bold leading-none', statusColors[status])}>{status}</span>
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-xs font-bold text-slate-500">{tasks.length}</span>
        </div>
        {canCreate && (
          <Button variant="secondary" className="h-9 shrink-0 px-3 text-xs" onClick={() => onAddTask(status)} aria-label={`Add ${status} task`}>
            <Plus size={16} />
            Add
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onClick={() => onOpenTask(task)} draggable={canDrag} />
        ))}
        {tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-6 text-center">
            <p className="text-sm font-medium text-slate-400">No tasks here</p>
            {canCreate && (
              <Button className="mt-4" onClick={() => onAddTask(status)}>
                <Plus size={16} />
                Create task
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default KanbanColumn;
