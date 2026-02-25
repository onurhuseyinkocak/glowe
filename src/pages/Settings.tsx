import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { LogOut, User, Shield, Bell, Trash2, ChevronRight, Sparkles, Flower2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const Settings = () => {
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    setProfile(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
    showSuccess('Logged out successfully');
  };

  return (
    <div className="p-8 space-y-10 bg-[#FFF9F9] min-h-screen">
      <header className="space-y-1">
        <h1 className="text-4xl font-serif text-[#4A3F3F]">Settings</h1>
        <p className="text-[#BCAEAE] text-sm font-medium">Manage your glow journey</p>
      </header>

      <div className="flex items-center gap-5 p-8 rounded-[40px] bg-white border border-[#FCE4EC] shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -top-4 text-[#FCE4EC]/20">
          <Flower2 size={80} />
        </div>
        <div className="w-16 h-16 rounded-3xl bg-[#FCE4EC] text-[#D81B60] flex items-center justify-center text-2xl font-serif font-bold relative z-10">
          {profile?.identity?.[0]?.toUpperCase() || 'G'}
        </div>
        <div className="space-y-1 relative z-10">
          <h3 className="font-bold text-lg text-[#4A3F3F] capitalize">{profile?.identity || 'Radiant User'}</h3>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE4EC] text-[8px] font-bold uppercase tracking-widest text-[#D81B60]">
            <Sparkles size={10} />
            {profile?.style_energy || 'Natural'} Energy
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[9px] font-bold text-[#BCAEAE] uppercase tracking-[0.3em] px-2">Preferences</p>
        <div className="bg-white border border-[#FCE4EC] rounded-[40px] overflow-hidden shadow-sm">
          <SettingItem icon={<User size={18} />} label="Edit Profile" onClick={() => navigate('/onboarding')} />
          <SettingItem icon={<Sparkles size={18} />} label="Style DNA" onClick={() => navigate('/onboarding')} />
          <SettingItem icon={<Bell size={18} />} label="Notifications" />
          <SettingItem icon={<Shield size={18} />} label="Privacy & Security" />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[9px] font-bold text-[#BCAEAE] uppercase tracking-[0.3em] px-2">Account</p>
        <div className="bg-white border border-[#FCE4EC] rounded-[40px] overflow-hidden shadow-sm">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-6 hover:bg-[#FFF9F9] transition-colors text-left"
          >
            <div className="flex items-center gap-4 text-red-400">
              <LogOut size={18} />
              <span className="font-bold text-sm">Sign Out</span>
            </div>
          </button>
          <button 
            className="w-full flex items-center justify-between p-6 hover:bg-[#FFF9F9] transition-colors text-left border-t border-[#FCE4EC]"
          >
            <div className="flex items-center gap-4 text-[#BCAEAE]">
              <Trash2 size={18} />
              <span className="font-bold text-sm">Delete Account</span>
            </div>
          </button>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-[9px] font-bold text-[#FCE4EC] uppercase tracking-[0.4em]">Glowé v1.2.0</p>
      </div>
    </div>
  );
};

const SettingItem = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-6 hover:bg-[#FFF9F9] transition-colors text-left border-b border-[#FCE4EC] last:border-0"
  >
    <div className="flex items-center gap-4">
      <div className="text-[#D81B60]">{icon}</div>
      <span className="font-bold text-sm text-[#4A3F3F]">{label}</span>
    </div>
    <ChevronRight className="text-[#FCE4EC]" size={18} />
  </button>
);

export default Settings;