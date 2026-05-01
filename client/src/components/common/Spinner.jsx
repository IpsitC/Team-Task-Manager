const Spinner = ({ label = 'Loading' }) => {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-500">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
};

export default Spinner;
