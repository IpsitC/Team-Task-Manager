import clsx from 'clsx';

const Input = ({ label, error, className, as = 'input', ...props }) => {
  const Component = as;

  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>}
      <Component
        className={clsx(
          'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100',
          as === 'textarea' && 'min-h-24 resize-y',
          error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-100',
          className
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span>}
    </label>
  );
};

export default Input;
