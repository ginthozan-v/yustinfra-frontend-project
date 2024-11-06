function DashboardIcon({ isActive }) {
  const color = isActive ? 'text-indigo-500' : 'text-slate-400';
  const color2 = isActive ? 'text-indigo-600' : 'text-slate-600';
  const color3 = isActive ? 'text-indigo-200' : 'text-slate-200';

  return (
    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
      <path
        className={`fill-current  ${color}`}
        d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
      />
      <path
        className={`fill-current ${color2}`}
        d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
      />
      <path
        className={`fill-current  ${color3}`}
        d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
      />
    </svg>
  );
}

export default DashboardIcon;
