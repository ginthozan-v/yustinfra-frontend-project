function ProjectIcon({ isActive }) {
  const color = isActive ? 'text-indigo-500' : 'text-slate-400';
  const color2 = isActive ? 'text-indigo-600' : 'text-slate-600';
  const color3 = isActive ? 'text-indigo-200' : 'text-slate-200';

  return (
    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
      <path
        className={`fill-current  ${color}`}
        d="M13 15l11-7L11.504.136a1 1 0 00-1.019.007L0 7l13 8z"
      />
      <path
        className={`fill-current  ${color2}`}
        d="M13 15L0 7v9c0 .355.189.685.496.864L13 24v-9z"
      />
      <path
        className={`fill-current  ${color3}`}
        d="M13 15.047V24l10.573-7.181A.999.999 0 0024 16V8l-11 7.047z"
      />
    </svg>
  );
}

export default ProjectIcon;
