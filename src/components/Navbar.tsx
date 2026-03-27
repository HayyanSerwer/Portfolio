import { NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home',     to: '/'         },
  { label: 'About',    to: '/about'    },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact',  to: '/contact'  },
];

export default function Navbar() {
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
          Portfolio · 2025
        </span>
      </div>

      <div className="flex gap-10 pointer-events-auto">
        {NAV_LINKS.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `text-[9px] tracking-[4px] uppercase no-underline transition-all duration-300 relative group ${
                isActive ? 'text-white/80' : 'text-white/20 hover:text-white/50'
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
        ))}
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