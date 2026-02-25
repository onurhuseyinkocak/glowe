import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, History, Scissors, Settings, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const Layout = () => {
  const location = useLocation();
  const hideNav = ['/auth', '/onboarding', '/analysis'].some(path => location.pathname.startsWith(path));

  if (hideNav) return <Outlet />;

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9F9] text-[#4A3F3F] max-w-md mx-auto border-x border-[#F5F0E1] relative">
      <main className="flex-1 overflow-y-auto pb-32">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-2xl border-t border-[#FCE4EC] px-8 py-5 z-50 shadow-[0_-10px_40px_rgba(252,228,236,0.2)]">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <TabLink to="/" icon={<Home size={20} />} label="Home" />
          <TabLink to="/history" icon={<History size={20} />} label="Moments" />
          <TabLink to="/barbers" icon={<Scissors size={20} />} label="Salons" />
          <TabLink to="/favorites" icon={<Heart size={20} />} label="Styles" />
          <TabLink to="/settings" icon={<Settings size={20} />} label="Self" />
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
        "flex flex-col items-center gap-1.5 transition-all duration-500 relative",
        isActive ? "text-[#D81B60]" : "text-[#BCAEAE] hover:text-[#8C7E7E]"
      )
    }
  >
    {({ isActive }) => (
      <>
        <div className={cn(
          "p-2 rounded-2xl transition-all duration-500",
          isActive && "bg-[#FCE4EC] shadow-sm scale-110"
        )}>
          {icon}
        </div>
        <span className="text-[7px] font-bold uppercase tracking-[0.2em]">{label}</span>
        {isActive && (
          <Sparkles size={8} className="absolute -top-1 -right-1 text-[#D81B60] animate-pulse" />
        )}
      </>
    )}
  </NavLink>
);

export default Layout;