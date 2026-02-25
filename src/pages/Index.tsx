import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
  Sparkles, Heart, Briefcase, Coffee, Moon, Zap, Star, 
  Camera, Flower2, Stars, MapPin, Sun, Cloud, Clock 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOMENTS = [
  { id: 'First Date', label: 'First Date', icon: <Heart size={24} />, color: 'bg-rose-50' },
  { id: 'Job Interview', label: 'Job Interview', icon: <Briefcase size={24} />, color: 'bg-blue-50' },
  { id: 'Girls Night', label: 'Girls Night', icon: <Stars size={24} />, color: 'bg-purple-50' },
  { id: 'Wedding Guest', label: 'Wedding Guest', icon: <Flower2 size={24} />, color: 'bg-pink-50' },
  { id: 'Power Meeting', label: 'Power Meeting', icon: <Zap size={24} />, color: 'bg-amber-50' },
  { id: 'Creator: On-Camera', label: 'On-Camera', icon: <Camera size={24} />, color: 'bg-emerald-50' },
  { id: 'Creator: Short-form', label: 'Short-form', icon: <Zap size={24} />, color: 'bg-orange-50' },
  { id: 'Glow Reset', label: 'Glow Reset', icon: <Sparkles size={24} />, color: 'bg-indigo-50' },
];

const Index = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/auth'); return; }
    
    const { data } = await supabase.from('user_baseline').select('*').eq('user_id', user.id).single();
    if (!data) navigate('/onboarding');
    else setProfile(data);
  };

  return (
    <div className="p-8 space-y-10 pb-32">
      <header className="space-y-4 animate-fade-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FCE4EC] animate-ping" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#BCAEAE] font-bold">Presence OS Active</p>
          </div>
          <Flower2 className="text-[#FCE4EC] animate-spin-slow" size={24} />
        </div>
        <h1 className="text-5xl font-serif text-[#4A3F3F] leading-[1.1]">
          What’s your <br />
          <span className="italic text-[#D81B60]">moment today?</span>
        </h1>
      </header>

      <div className="grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
        {MOMENTS.map((moment) => (
          <button
            key={moment.id}
            onClick={() => navigate(`/moment-intake/${moment.id.toLowerCase().replace(' ', '-')}`)}
            className={cn(
              "group relative p-6 rounded-[40px] text-left transition-all duration-500 hover:scale-[1.02] active:scale-95 overflow-hidden border border-white/50 shadow-sm",
              moment.color
            )}
          >
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              {moment.icon}
            </div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md flex items-center justify-center text-[#4A3F3F] shadow-sm">
                {moment.icon}
              </div>
              <p className="font-bold text-sm tracking-tight text-[#4A3F3F]">{moment.label}</p>
            </div>
          </button>
        ))}
      </div>

      <section className="p-8 rounded-[40px] bg-white border border-[#FCE4EC] space-y-4 animate-fade-up" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#BCAEAE]">Daily Insight</p>
          <Sparkles size={14} className="text-[#D81B60]" />
        </div>
        <p className="text-sm text-[#4A3F3F] leading-relaxed italic">
          "Your presence is the first thing people feel, and the last thing they forget."
        </p>
      </section>
    </div>
  );
};

export default Index;