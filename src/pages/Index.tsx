import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, Video, Heart, Briefcase, Coffee, Moon, Zap, ChevronRight, Star } from 'lucide-react';

const MOMENTS = [
  { id: 'first_date', label: 'First Date', icon: <Heart size={20} />, color: 'bg-rose-50 text-rose-500' },
  { id: 'job_interview', label: 'Job Interview', icon: <Briefcase size={20} />, color: 'bg-blue-50 text-blue-500' },
  { id: 'power_meeting', label: 'Power Meeting', icon: <Zap size={20} />, color: 'bg-amber-50 text-amber-500' },
  { id: 'creator_camera', label: 'Creator Mode', icon: <Video size={20} />, color: 'bg-purple-50 text-purple-500' },
  { id: 'daytime_casual', label: 'Daytime Casual', icon: <Coffee size={20} />, color: 'bg-orange-50 text-orange-500' },
  { id: 'night_out', label: 'Night Out', icon: <Moon size={20} />, color: 'bg-indigo-50 text-indigo-500' },
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
    const { data: baseline } = await supabase.from('user_baseline').select('*').eq('user_id', user.id).single();
    if (!baseline) navigate('/onboarding');
    else setProfile(baseline);
    setLoading(false);
  };

  if (loading) return null;

  return (
    <div className="p-8 space-y-10 bg-[#FFFBFA] min-h-screen pb-40">
      <header className="space-y-2 animate-fade-up">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8C7E7E] font-bold">Presence OS Active</p>
        </div>
        <h1 className="text-4xl font-serif text-[#4A3F3F] leading-tight">What’s your moment today?</h1>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {MOMENTS.map((moment, i) => (
          <button
            key={moment.id}
            onClick={() => navigate(`/moment-intake/${moment.id}`)}
            style={{ animationDelay: `${i * 100}ms` }}
            className="p-6 rounded-[32px] bg-white border border-[#F5F0E1] text-left space-y-4 hover:border-[#E8D5D8] hover:shadow-xl hover:shadow-rose-100/20 transition-all group animate-fade-up"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${moment.color} group-hover:scale-110 transition-transform duration-500`}>
              {moment.icon}
            </div>
            <p className="font-bold text-sm text-[#4A3F3F]">{moment.label}</p>
          </button>
        ))}
      </div>

      <section className="space-y-6 animate-fade-up" style={{ animationDelay: '600ms' }}>
        <div className="flex justify-between items-center px-2">
          <h3 className="font-serif text-2xl text-[#4A3F3F]">Daily Insight</h3>
          <Star className="text-[#E8D5D8]" size={20} fill="currentColor" />
        </div>
        <div className="p-8 rounded-[40px] bg-white border border-[#F5F0E1] shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5F0E1] rounded-full -mr-16 -mt-16 opacity-50" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-[#E8D5D8] flex items-center justify-center text-[#4A3F3F]">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="font-bold text-[#4A3F3F]">Focus: Posture & Radiance</p>
              <p className="text-[10px] text-[#8C7E7E] uppercase tracking-widest">Presence Habit</p>
            </div>
          </div>
          <p className="text-xs text-[#4A3F3F]/70 leading-relaxed italic relative z-10">
            "Today's micro-habit: 2 minutes of wall-standing to reset your alignment before your first meeting."
          </p>
        </div>
      </section>

      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40">
        <Button 
          onClick={() => navigate('/moment-intake/quick_reset')}
          className="w-full h-16 rounded-full bg-[#4A3F3F] text-white text-lg font-bold shadow-2xl shadow-black/20 hover:bg-[#2D2424] transition-all active:scale-95"
        >
          <Zap className="mr-2" size={20} />
          Quick Glow Reset
        </Button>
      </div>
    </div>
  );
};

export default Index;