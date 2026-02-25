import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, History, Scissors, Settings, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const Layout = () => {
  const location = useLocation();
  const hideNav = ['/auth', '/onboarding', '/analysis'].some(path => location.pathname.startsWith(path));

  if (hideNav) return <Outlet />;

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFBFA] text-[#2D2424] max-w-md mx-auto border-x border-[#F5F0E1] relative">
      <main className="flex-1 overflow-y-auto pb-32">
        <Outlet />
      </main>

      {/* Modern, Solid Navigation Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-[#F5F0E1] px-6 py-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <TabLink to="/" icon={<Home size={22} />} label="Home" />
          <TabLink to="/history" icon={<History size={22} />} label="Moments" />
          <TabLink to="/barbers" icon={<Scissors size={22} />} label="Barbers" />
          <TabLink to="/favorites" icon={<Heart size={22} />} label="Styles" />
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
        "flex flex-col items-center gap-1 transition-all duration-300 relative py-1",
        isActive ? "text-[#4A3F3F]" : "text-[#BCAEAE] hover:text-[#8C7E7E]"
      )
    }
  >
    {({ isActive }) => (
      <>
        <div className={cn(
          "p-1.5 rounded-xl transition-all duration-300",
          isActive && "bg-[#F5F0E1] scale-110"
        )}>
          {icon}
        </div>
        <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
        {isActive && (
          <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#4A3F3F]" />
        )}
      </>
    )}
  </NavLink>
);

export default Layout;