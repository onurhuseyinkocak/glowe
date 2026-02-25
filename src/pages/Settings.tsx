import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { LogOut, User, Shield, Bell, Trash2, ChevronRight, Sparkles } from 'lucide-react';
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
      .from('users_profile')
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

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action is permanent.')) {
      showError('Account deletion is restricted in MVP mode.');
    }
  };

  return (
    <div className="p-8 space-y-10 bg-[#FFFBFA] min-h-screen">
      <header className="space-y-1">
        <h1 className="text-4xl font-serif text-[#4A3F3F]">Settings</h1>
        <p className="text-[#8C7E7E] text-sm">Manage your glow journey</p>
      </header>

      <div className="flex items-center gap-5 p-6 rounded-[32px] bg-white border border-[#F5F0E1] shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#E8D5D8] text-[#4A3F3F] flex items-center justify-center text-2xl font-serif font-bold">
          {profile?.first_name?.[0] || 'U'}
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-[#4A3F3F]">{profile?.first_name || 'User'}</h3>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5F0E1] text-[9px] font-bold uppercase tracking-widest text-[#8C7E7E]">
            <Sparkles size={10} />
            Premium Member
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-bold text-[#8C7E7E] uppercase tracking-[0.3em] px-2">Preferences</p>
        <div className="bg-white border border-[#F5F0E1] rounded-[32px] overflow-hidden shadow-sm">
          <SettingItem icon={<User size={18} />} label="Edit Profile" onClick={() => navigate('/onboarding')} />
          <SettingItem icon={<Sparkles size={18} />} label="Style Preferences" onClick={() => navigate('/onboarding')} />
          <SettingItem icon={<Bell size={18} />} label="Notifications" />
          <SettingItem icon={<Shield size={18} />} label="Privacy & Security" />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-bold text-[#8C7E7E] uppercase tracking-[0.3em] px-2">Account</p>
        <div className="bg-white border border-[#F5F0E1] rounded-[32px] overflow-hidden shadow-sm">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-4 text-red-400">
              <LogOut size={18} />
              <span className="font-bold text-sm">Sign Out</span>
            </div>
          </button>
          <button 
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left border-t border-[#F5F0E1]"
          >
            <div className="flex items-center gap-4 text-gray-300">
              <Trash2 size={18} />
              <span className="font-bold text-sm">Delete Account</span>
            </div>
          </button>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-[10px] font-bold text-[#F5F0E1] uppercase tracking-[0.4em]">Glowé v1.2.0</p>
      </div>
    </div>
  );
};

const SettingItem = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left border-b border-[#F5F0E1] last:border-0"
  >
    <div className="flex items-center gap-4">
      <div className="text-[#E8D5D8]">{icon}</div>
      <span className="font-bold text-sm text-[#4A3F3F]">{label}</span>
    </div>
    <ChevronRight className="text-[#F5F0E1]" size={18} />
  </button>
);

export default Settings;