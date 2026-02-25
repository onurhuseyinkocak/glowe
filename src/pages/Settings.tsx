import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { LogOut, User, Shield, Bell, Trash2, ChevronRight } from 'lucide-react';
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
    <div className="p-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500">Manage your account</p>
      </header>

      <div className="flex items-center gap-4 p-4 rounded-3xl bg-gray-50">
        <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center text-2xl font-bold">
          {profile?.first_name?.[0] || 'U'}
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-lg">{profile?.first_name || 'User'}</h3>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Premium Member</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">Preferences</p>
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
          <SettingItem icon={<User size={18} />} label="Edit Profile" onClick={() => navigate('/onboarding')} />
          <SettingItem icon={<Bell size={18} />} label="Notifications" />
          <SettingItem icon={<Shield size={18} />} label="Privacy & Security" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">Account</p>
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-4 text-red-600">
              <LogOut size={18} />
              <span className="font-bold">Sign Out</span>
            </div>
          </button>
          <button 
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left border-t border-gray-50"
          >
            <div className="flex items-center gap-4 text-gray-400">
              <Trash2 size={18} />
              <span className="font-bold">Delete Account</span>
            </div>
          </button>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">CutMatch v1.0.0</p>
      </div>
    </div>
  );
};

const SettingItem = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
  >
    <div className="flex items-center gap-4">
      <div className="text-gray-400">{icon}</div>
      <span className="font-bold">{label}</span>
    </div>
    <ChevronRight className="text-gray-300" size={18} />
  </button>
);

export default Settings;