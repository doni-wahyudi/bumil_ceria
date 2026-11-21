import { NavLink, useLocation } from 'react-router-dom';
import { Home, CalendarDays, CheckSquare, User } from 'lucide-react';
import './BottomNav.css';

const navItems = [
  { path: '/', label: 'Beranda', icon: Home },
  { path: '/timeline', label: 'Timeline', icon: CalendarDays },
  { path: '/checklist', label: 'Checklist', icon: CheckSquare },
  { path: '/profile', label: 'Profil', icon: User },
];

function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav" id="bottom-nav" aria-label="Navigasi Utama">
      {navItems.map(({ path, label, icon: Icon }) => {
        const isActive = location.pathname === path;
        return (
          <NavLink
            key={path}
            to={path}
            className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className="bottom-nav__icon-wrap">
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} aria-hidden="true" />
              {isActive && <div className="bottom-nav__indicator" aria-hidden="true" />}
            </div>
            <span className="bottom-nav__label">{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default BottomNav;
