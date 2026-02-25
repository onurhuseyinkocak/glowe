import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, Sparkles, Palette, CheckCircle2, 
  User, Scissors, ShieldCheck, Zap, Heart, Share2
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const LookResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [plan, setPlan] = useState<any>(location.state?.plan || null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!plan) fetchPlan();
    fetchProfile();
  }, [id]);

  const fetchPlan = async () => {
    const { data } = await supabase.from('look_plans').select('*').eq('id', id).single();
    if (data) setPlan(data.recommended_outfit); // Basitleştirilmiş
  };

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('user_profile').select('*').eq('user_id', user.id).single();
      setProfile(data);
    }
  };

  if (!plan) return null;

  const isWomanOrNB = profile?.identity === 'woman' || profile?.identity === 'non-binary';
  const isMan = profile?.identity === 'man';
  const isCovered = profile?.hair_coverage !== 'visible';

  return (
    <div className="min-h-screen bg-[#FFF9F9] pb-32">
      <header className="p-6 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-[#FCE4EC] rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-serif text-xl text-[#4A3F3F]">Your Glow Plan</h1>
        <div className="w-10" />
      </header>

      <div className="p-8 space-y-8">
        {/* Style Card */}
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#4A3F3F] to-[#2D2424] p-8 text-white shadow-2xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#D81B60]/10 blur-3xl" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">
                <Sparkles size={14} className="text-[#FCE4EC]" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Glowé Verified</span>
              </div>
              <ShieldCheck size={24} className="text-[#FCE4EC]" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Recommended Look</p>
              <h2 className="text-3xl font-serif italic">{plan.recommended_outfits?.[0]?.title || "Best Match"}</h2>
            </div>
            <p className="text-sm text-white/80 leading-relaxed italic">"{plan.why}"</p>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-6">
          <Module icon={<Palette size={18} />} title="Color Palette">
            <div className="flex gap-2 mt-3">
              {plan.recommended_outfits?.[0]?.colors?.map((c: string) => (
                <div key={c} className="px-3 py-1 rounded-full bg-white border border-[#FCE4EC] text-[10px] font-bold text-[#4A3F3F] uppercase">
                  {c}
                </div>
              ))}
            </div>
          </Module>

          {isWomanOrNB && plan.makeup_or_grooming && (
            <Module icon={<Sparkles size={18} />} title="Makeup Direction">
              <p className="text-sm text-[#4A3F3F] font-bold">{plan.makeup_or_grooming.focus} - {plan.makeup_or_grooming.intensity}</p>
              <ul className="mt-2 space-y-1">
                {plan.makeup_or_grooming.tips?.map((t: string) => (
                  <li key={t} className="text-xs text-[#8C7E7E] flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#D81B60]" /> {t}
                  </li>
                ))}
              </ul>
            </Module>
          )}

          {isMan && plan.makeup_or_grooming && (
            <Module icon={<Scissors size={18} />} title="Grooming & Presence">
              <p className="text-sm text-[#4A3F3F] font-bold">{plan.makeup_or_grooming.focus}</p>
              <p className="text-xs text-[#8C7E7E] mt-1">{plan.makeup_or_grooming.intensity}</p>
            </Module>
          )}

          {isCovered && plan.covering_or_hair && (
            <Module icon={<Heart size={18} />} title="Covering Style">
              <p className="text-sm text-[#4A3F3F] font-bold">{plan.covering_or_hair.style}</p>
              <p className="text-xs text-[#8C7E7E] mt-1">{plan.covering_or_hair.notes}</p>
            </Module>
          )}

          <Module icon={<CheckCircle2 size={18} />} title="Presence Tips">
            <div className="grid gap-2 mt-3">
              {plan.posture_presence?.map((item: string) => (
                <div key={item} className="flex items-center gap-3 p-4 rounded-2xl border border-[#FCE4EC] bg-white">
                  <div className="w-5 h-5 rounded-full border-2 border-[#FCE4EC] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#D81B60]" />
                  </div>
                  <span className="text-sm text-[#4A3F3F]">{item}</span>
                </div>
              ))}
            </div>
          </Module>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6">
          <Button className="h-16 rounded-full bg-[#4A3F3F] text-white font-bold shadow-lg">
            <Share2 className="mr-2" size={18} />
            Share Card
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} className="h-16 rounded-full border-2 border-[#FCE4EC] font-bold text-[#4A3F3F]">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

const Module = ({ icon, title, children }: any) => (
  <div className="p-8 rounded-[40px] bg-white border border-[#FCE4EC] space-y-3 shadow-sm">
    <div className="flex items-center gap-3 text-[#D81B60]">
      {icon}
      <h3 className="font-bold text-sm uppercase tracking-widest text-[#4A3F3F]">{title}</h3>
    </div>
    {children}
  </div>
);

export default LookResult;