import clsx from 'clsx';
import { BarChart3, FolderKanban, LayoutDashboard, ListTodo, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Button from '../common/Button.jsx';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'My Tasks', icon: ListTodo, end: true },
  { to: '/projects', label: 'Projects', icon: FolderKanban, end: true },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, end: true }
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      <div className={clsx('fixed inset-0 z-40 bg-slate-950/30 lg:hidden', open ? 'block' : 'hidden')} onClick={onClose} />
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white px-4 py-5 transition-transform lg:static lg:z-auto lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <NavLink to="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500 text-lg font-extrabold text-white">T</div>
            <div>
              <p className="text-lg font-extrabold text-slate-950">TaskFlow</p>
              <p className="text-xs font-medium text-slate-500">Team task manager</p>
            </div>
          </NavLink>
          <Button variant="ghost" className="h-9 w-9 px-0 lg:hidden" onClick={onClose} aria-label="Close navigation">
            <X size={18} />
          </Button>
        </div>
        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition',
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
