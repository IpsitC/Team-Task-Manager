import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import ThemeToggle from '../components/common/ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const { login, loading, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    await login(form);
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <div className="fixed right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <form onSubmit={submit} className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <Link to="/" className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500 font-extrabold text-white">T</div>
          <span className="text-lg font-extrabold text-slate-950">TaskFlow</span>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-950">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Login to your workspace.</p>
        <div className="mt-6 grid gap-4">
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          <Button type="submit" disabled={loading}>
            <LogIn size={16} />
            Login
          </Button>
        </div>
        <p className="mt-5 text-center text-sm text-slate-500">
          New here? <Link to="/signup" className="font-bold text-blue-600">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
