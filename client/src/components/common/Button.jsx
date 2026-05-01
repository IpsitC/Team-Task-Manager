import clsx from 'clsx';

const variants = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600 border-blue-500',
  secondary: 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200',
  danger: 'bg-rose-500 text-white hover:bg-rose-600 border-rose-500',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent'
};

const Button = ({ children, className, variant = 'primary', type = 'button', ...props }) => {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
