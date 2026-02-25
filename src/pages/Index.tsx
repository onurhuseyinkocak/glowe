import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, Video, Heart, Briefcase, Coffee, Moon, Zap, ChevronRight } from 'lucide-react';

const MOMENTS = [
  { id: 'date', label: 'First Date', icon: <Heart size={20} />, color: 'bg-rose-50 text-rose-500' },
  { id: 'interview', label: 'Job Interview', icon: <Briefcase size={20} />, color: 'bg-blue-50 text-blue-500' },
  { id: 'meeting', label: 'Power Meeting', icon: <Zap size={20} />, color: 'bg-amber-50 text-amber-500' },
  { id: 'creator_cam', label: 'Creator: Camera', icon: <Video size={20} />, color: 'bg-purple-50 text-purple-500' },
  { id: 'casual', label: 'Daytime Casual', icon: <Coffee size={20} />, color: 'bg-orange-50 text-orange-500' },
  { id: 'night', label: 'Night Out', icon: <Moon size={20} />, color: 'bg-indigo-50 text-indigo-500' },
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
    <div className="p-8 space-y-10 bg-[#FFFBFA] min-h-screen pb-32">
      <header className="space-y-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#8C7E7E] font-bold">Presence OS Active</p>
        <h1 className="text-4xl font-serif text-[#4A3F3F]">What’s your moment today?</h1>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {MOMENTS.map(moment => (
          <button
            key={moment.id}
            onClick={() => navigate(`/moment-intake/${moment.id}`)}
            className="p-6 rounded-[32px] bg-white border border-[#F5F0E1] text-left space-y-4 hover:border-[#E8D5D8] transition-all group"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${moment.color} group-hover:scale-110 transition-transform`}>
              {moment.icon}
            </div>
            <p className="font-bold text-sm text-[#4A3F3F]">{moment.label}</p>
          </button>
        ))}
      </div>

      <section className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-serif text-2xl text-[#4A3F3F]">Weekly Routine</h3>
          <Sparkles className="text-[#E8D5D8]" size={20} />
        </div>
        <div className="p-8 rounded-[40px] bg-[#F5F0E1] space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#4A3F3F]">
              <Calendar size={18} />
            </div>
            <div>
              <p className="font-bold text-[#4A3F3F]">Focus: Posture & Radiance</p>
              <p className="text-[10px] text-[#8C7E7E] uppercase tracking-widest">Day 3 of 7</p>
            </div>
          </div>
          <p className="text-xs text-[#4A3F3F]/70 leading-relaxed italic">"Today's micro-habit: 2 minutes of wall-standing to reset your alignment."</p>
        </div>
      </section>

      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
        <Button 
          onClick={() => navigate('/moment-intake/quick')}
          className="w-full h-16 rounded-full bg-[#4A3F3F] text-white text-lg font-bold shadow-2xl shadow-black/10"
        >
          <Zap className="mr-2" size={20} />
          Quick Glow Reset
        </Button>
      </div>
    </div>
  );
};

export default Index;