import { ArrowRight, LogOut, UserPlus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';

const ProjectCard = ({ project, onJoin, onLeave }) => {
  const canLeave = project.isMember;

  return (
    <article className="group rounded-xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-blue-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-950">{project.name}</h3>
            <span className={`rounded-md px-2 py-1 text-xs font-bold ${project.isMember ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
              {project.currentUserRole || (project.isMember ? 'member' : 'Open')}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{project.description || 'No description yet'}</p>
        </div>
        {(project.isMember || project.canDelete) && (
          <Link
            to={`/projects/${project._id}`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 opacity-0 shadow-sm transition group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-blue-600"
            aria-label={`Open ${project.name}`}
          >
            <ArrowRight size={18} />
          </Link>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
        <span className="inline-flex items-center gap-2">
          <Users size={16} />
          {project.members?.length || 0} members
        </span>
        <span className="font-semibold text-slate-700">{project.taskCount || 0} tasks</span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${project.progress || 0}%` }} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-400">{project.progress || 0}% complete</p>
        {project.isMember ? (
          <div className="flex items-center gap-2">
            <Link to={`/projects/${project._id}`} className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-600">
              Open
            </Link>
            <Button variant="secondary" className="text-rose-600 hover:bg-rose-50" onClick={() => onLeave(project._id)}>
              <LogOut size={15} />
              Exit
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {project.canDelete && (
              <Link to={`/projects/${project._id}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                Open
              </Link>
            )}
            <Button onClick={() => onJoin(project._id)}>
              <UserPlus size={15} />
              Join
            </Button>
          </div>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
