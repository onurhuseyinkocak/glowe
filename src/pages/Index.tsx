import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Briefcase, Coffee, Moon, Zap, Star, Camera, Flower2, Stars } from 'lucide-react';

const MOMENTS = [
  { id: 'first_date', label: 'First Date', icon: <Heart size={24} />, color: 'bg-[#FCE4EC] text-[#D81B60]' },
  { id: 'job_interview', label: 'Interview', icon: <Briefcase size={24} />, color: 'bg-[#E3F2FD] text-[#1E88E5]' },
  { id: 'power_meeting', label: 'Meeting', icon: <Zap size={24} />, color: 'bg-[#FFF3E0] text-[#FB8C00]' },
  { id: 'creator_camera', label: 'Creator', icon: <Stars size={24} />, color: 'bg-[#F3E5F5] text-[#8E24AA]' },
  { id: 'daytime_casual', label: 'Casual', icon: <Coffee size={24} />, color: 'bg-[#E0F2F1] text-[#00897B]' },
  { id: 'night_out', label: 'Night Out', icon: <Moon size={24} />, color: 'bg-[#E8EAF6] text-[#3949AB]' },
];

const Index = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/auth'); return; }
    
    const { data: profileData } = await supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profileData) {
      navigate('/onboarding');
    } else {
      setProfile(profileData);
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="p-8 space-y-12 pb-48">
      <header className="space-y-4 animate-fade-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FCE4EC] animate-ping" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#BCAEAE] font-bold">Glowé OS v1.2</p>
          </div>
          <Flower2 className="text-[#FCE4EC] animate-spin-slow" size={24} />
        </div>
        <h1 className="text-5xl font-serif text-[#4A3F3F] leading-[1.1]">
          Good morning, <br />
          <span className="italic text-[#D81B60]">Radiant.</span>
        </h1>
      </header>

      <div className="grid grid-cols-2 gap-5">
        {MOMENTS.map((moment, i) => (
          <button
            key={moment.id}
            onClick={() => navigate(`/moment-intake/${moment.id}`)}
            style={{ animationDelay: `${i * 100}ms` }}
            className="p-7 rounded-[40px] bg-white/60 backdrop-blur-md border border-white shadow-[0_10px_30px_rgba(252,228,236,0.3)] text-left space-y-5 hover:scale-[1.02] transition-all group animate-fade-up"
          >
            <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center ${moment.color} shadow-inner group-hover:rotate-6 transition-transform duration-500`}>
              {moment.icon}
            </div>
            <p className="font-bold text-sm tracking-tight text-[#4A3F3F]">{moment.label}</p>
          </button>
        ))}
      </div>

      <section className="space-y-6 animate-fade-up" style={{ animationDelay: '600ms' }}>
        <div className="flex justify-between items-center px-2">
          <h3 className="font-serif text-2xl text-[#4A3F3F]">Daily Ritual</h3>
          <Sparkles className="text-[#FCE4EC]" size={20} fill="currentColor" />
        </div>
        <div className="p-10 rounded-[50px] bg-gradient-to-br from-white to-[#FCE4EC]/20 border border-white shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F3E5F5] rounded-full blur-3xl opacity-40" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-[#D81B60]">
              <Star size={22} fill="currentColor" />
            </div>
            <div>
              <p className="font-bold text-[#4A3F3F] text-lg">Soft Alignment</p>
              <p className="text-[10px] text-[#BCAEAE] uppercase tracking-[0.2em] font-bold">Morning Habit</p>
            </div>
          </div>
          <p className="text-sm text-[#4A3F3F]/80 leading-relaxed italic relative z-10">
            "Take 3 deep breaths. Visualize your glow expanding from your core to your fingertips before you step out."
          </p>
        </div>
      </section>

      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[88%] max-w-sm z-40">
        <Button 
          onClick={() => navigate('/try-on')}
          className="w-full h-20 rounded-full bg-[#4A3F3F] text-white text-lg font-bold shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-4 border-t border-white/10"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Camera size={20} />
          </div>
          AI Virtual Try-On
        </Button>
      </div>
    </div>
  );
};

export default Index;