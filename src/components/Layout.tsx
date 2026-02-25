import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, History, MapPin, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const Layout = () => {
  const location = useLocation();
  const hideNav = ['/auth', '/onboarding', '/analysis'].some(path => location.pathname.startsWith(path));

  if (hideNav) return <Outlet />;

  return (
    <div className="flex flex-col min-h-screen bg-white text-black max-w-md mx-auto border-x border-gray-100 shadow-xl">
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 px-6 py-3 z-50 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <TabLink to="/" icon={<Home size={24} />} label="Home" />
          <TabLink to="/history" icon={<History size={24} />} label="History" />
          <TabLink to="/barbers" icon={<MapPin size={24} />} label="Barbers" />
          <TabLink to="/settings" icon={<Settings size={24} />} label="Settings" />
        </div>
      </nav>
    </div>
  );
};

const TabLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex flex-col items-center gap-1 transition-colors",
        isActive ? "text-black" : "text-gray-400"
      )
    }
  >
    {icon}
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </NavLink>
);

export default Layout;