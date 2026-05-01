import { UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import ThemeToggle from '../components/common/ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const SignupPage = () => {
  const { register, loading, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();
  const validation = useMemo(() => {
    const nameValid = form.name.trim().length >= 2;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    const passwordValid = form.password.length >= 6;
    const passwordsMatch = Boolean(form.confirmPassword) && form.password === form.confirmPassword;

    return {
      nameValid,
      emailValid,
      passwordValid,
      passwordsMatch,
      formValid: nameValid && emailValid && passwordValid && passwordsMatch
    };
  }, [form]);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    if (!validation.formValid) return;
    await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
    navigate('/dashboard', { replace: true });
  };

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const markTouched = (field) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const showError = (field, valid) => touched[field] && !valid;

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
        <h1 className="text-2xl font-extrabold text-slate-950">Create account</h1>
        <p className="mt-2 text-sm text-slate-500">Start a workspace and invite your team.</p>
        <div className="mt-6 grid gap-4">
          <Input
            label="Name"
            value={form.name}
            onBlur={() => markTouched('name')}
            onChange={(event) => update('name', event.target.value)}
            error={showError('name', validation.nameValid) ? 'Name must be at least 2 characters.' : ''}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onBlur={() => markTouched('email')}
            onChange={(event) => update('email', event.target.value)}
            error={showError('email', validation.emailValid) ? 'Enter a valid email address.' : ''}
            required
          />
          <Input
            label="Password"
            type="password"
            minLength={6}
            value={form.password}
            onBlur={() => markTouched('password')}
            onChange={(event) => update('password', event.target.value)}
            error={showError('password', validation.passwordValid) ? 'Password must be at least 6 characters.' : ''}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onBlur={() => markTouched('confirmPassword')}
            onChange={(event) => update('confirmPassword', event.target.value)}
            error={showError('confirmPassword', validation.passwordsMatch) ? 'Passwords do not match.' : ''}
            required
          />
          <Button type="submit" disabled={loading || !validation.formValid}>
            <UserPlus size={16} />
            Sign up
          </Button>
        </div>
        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-bold text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
