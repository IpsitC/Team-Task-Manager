import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../common/Button.jsx';
import ThemeToggle from '../common/ThemeToggle.jsx';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" className="h-9 w-9 px-0 lg:hidden" onClick={onMenuClick} aria-label="Open navigation">
          <Menu size={18} />
        </Button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
          <p className="text-sm font-bold text-slate-900">Welcome, {user?.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
