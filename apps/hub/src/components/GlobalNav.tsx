import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAgeTheme } from '../hooks/useAgeTheme';

export default function GlobalNav() {
  const { t } = useTranslation();
  const { isChild } = useAgeTheme();
  
  const childNavItems = [
    { to: '/', icon: '🏠', label: t('nav_home', 'Home') },
    { to: '/home', icon: '📚', label: t('nav_learn', 'Learn') },
    { to: '/execute', icon: '🛠️', label: t('nav_create', 'Create') },
    { to: '/profile', icon: '👤', label: t('nav_profile', 'Profile') }
  ];

  const adultNavItems = [
    { to: '/', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, label: t('nav_home', 'Home') },
    { to: '/home', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>, label: t('nav_learn', 'Learn') },
    { to: '/execute', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>, label: t('nav_create', 'Create') },
    { to: '/profile', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, label: t('nav_profile', 'Profile') }
  ];

  const navItems = isChild ? childNavItems : adultNavItems;

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-[60] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pt-1 pb-1">
        <div className="flex items-center justify-around p-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => 
                `flex flex-col items-center p-2 rounded-xl min-w-[64px] transition-all active:scale-95 ${
                  isActive ? 'text-orange-500 bg-orange-50' : 'text-slate-500 hover:bg-slate-50'
                }`
              }
            >
              <span className={`text-2xl mb-1 ${!isChild ? 'flex items-center justify-center h-8' : ''}`}>{item.icon}</span>
              <span className="text-sm font-bold">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar Nav */}
      <nav className="hidden md:flex flex-col fixed left-0 top-[72px] bottom-0 w-24 bg-white border-r border-slate-200 z-[40] py-6 items-center gap-6 shadow-sm">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => 
              `group flex flex-col items-center p-3 rounded-2xl w-20 transition-all active:scale-95 ${
                isActive ? 'text-orange-600 bg-orange-50 scale-105 shadow-sm border border-orange-100' : 'text-slate-500 hover:bg-slate-50'
              }`
            }
          >
            <span className={`text-2xl mb-2 group-hover:scale-110 transition-transform ${!isChild ? 'flex items-center justify-center h-8' : ''}`}>{item.icon}</span>
            <span className="text-sm font-bold">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
