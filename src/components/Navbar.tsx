import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home',     to: '/',         scroll: false },
  { label: 'About',    to: '/about',    scroll: false },
  { label: 'Projects', to: '/',         scroll: true, scrollId: 'projects' },
  { label: 'Contact',  to: '/contact',  scroll: false },
];

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleProjects = () => {
    if (location.pathname === '/') {
      // Already on home — just scroll
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate home first, then scroll after mount
      navigate('/');
      setTimeout(() => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav
      style={{ fontFamily: '"Share Tech Mono", "Courier New", monospace' }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6 pointer-events-none"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.04]" />

      <div className="pointer-events-auto flex flex-col gap-1">
        <span className="text-[11px] tracking-[5px] text-white/70 uppercase">
          Hayyan Serwer
        </span>
        <span className="text-[8px] tracking-[6px] text-white/20 uppercase">
          Portfolio · 2026
        </span>
      </div>

      <div className="flex gap-10 pointer-events-auto">
        {NAV_LINKS.map(({ label, to, scroll, scrollId }) => {
          if (scroll) {
            return (
              <button
                key={label}
                onClick={handleProjects}
                className="text-[9px] tracking-[4px] uppercase no-underline transition-all duration-300 relative group text-white/20 hover:text-white/50 bg-transparent border-0 cursor-pointer p-0"
              >
                {label}
                <span className="absolute -bottom-1.5 left-0 h-px bg-white/40 transition-all duration-300 w-0 group-hover:w-full" />
              </button>
            );
          }
          return (
            <NavLink
              key={to + label}
              to={to}
              end
              className={({ isActive }) =>
                `text-[9px] tracking-[4px] uppercase no-underline transition-all duration-300 relative group ${
                  isActive && !scroll ? 'text-white/80' : 'text-white/20 hover:text-white/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  <span className={`absolute -bottom-1.5 left-0 h-px bg-white/40 transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="flex items-center gap-2 pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500/60 animate-pulse" />
        <span className="text-[8px] tracking-[4px] text-white/15 uppercase">
          Available
        </span>
      </div>
    </nav>
  );
}