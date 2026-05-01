import clsx from 'clsx';

const Badge = ({ children, className }) => {
  return (
    <span className={clsx('inline-flex min-w-fit items-center whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-semibold leading-none', className)}>
      {children}
    </span>
  );
};

export default Badge;
