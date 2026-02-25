import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, History, Sparkles, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const Layout = () => {
  const location = useLocation();
  const hideNav = ['/auth', '/onboarding', '/analysis'].some(path => location.pathname.startsWith(path));

  if (hideNav) return <Outlet />;

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFBFA] text-[#2D2424] max-w-md mx-auto border-x border-[#F5F0E1] shadow-2xl">
      <main className="flex-1 overflow-y-auto pb-28">
        <Outlet />
      </main>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] bg-white/70 backdrop-blur-xl border border-white/40 rounded-[40px] px-8 py-4 z-50 shadow-xl shadow-rose-100/20">
        <div className="flex justify-between items-center">
          <TabLink to="/" icon={<Home size={22} />} label="Home" />
          <TabLink to="/history" icon={<History size={22} />} label="Moments" />
          <TabLink to="/settings" icon={<Settings size={22} />} label="Profile" />
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
        "flex flex-col items-center gap-1.5 transition-all duration-300",
        isActive ? "text-[#4A3F3F] scale-110" : "text-[#8C7E7E] hover:text-[#4A3F3F]"
      )
    }
  >
    {icon}
    <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{label}</span>
  </NavLink>
);

export default Layout;