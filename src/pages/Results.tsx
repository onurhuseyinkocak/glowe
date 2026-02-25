import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { 
  Share2, ChevronLeft, Sparkles, Palette, CheckCircle2, 
  User, Scissors, Heart, ShieldCheck, Zap, AlertCircle,
  Info, Wind, Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { showSuccess } from '@/utils/toast';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [moment, setMoment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('outfit');

  useEffect(() => {
    fetchMoment();
  }, [id]);

  const fetchMoment = async () => {
    const { data } = await supabase.from('moments').select('*').eq('id', id).single();
    setMoment(data);
    setLoading(false);
  };

  if (loading || !moment) return null;

  const plan = moment.plan_json;
  const isDate = moment.moment_type.includes('date');

  return (
    <div className={cn(
      "min-h-screen pb-32 transition-colors duration-1000",
      isDate ? "bg-[#FFF9F9]" : "bg-[#FFFBFA]"
    )}>
      <header className="p-6 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-[#FCE4EC] rounded-full">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#FCE4EC] shadow-sm">
          <Sparkles size={14} className="text-[#D81B60]" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Glow Score: {plan.glow_score}</span>
        </div>
      </header>

      <div className="p-8 space-y-10">
        {/* Styled Preview Card (Mood Card) */}
        <div className="relative aspect-[4/5] rounded-[50px] overflow-hidden bg-white border border-[#FCE4EC] shadow-2xl p-8 flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Sparkles size={120} className="text-[#D81B60]" />
          </div>
          
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCE4EC] text-[8px] font-bold uppercase tracking-widest text-[#D81B60]">
              {moment.context_modifiers.energy_mode || 'Natural'}
            </div>
            <h2 className="text-4xl font-serif text-[#4A3F3F] leading-tight">
              {plan.styling.options[0].title}
            </h2>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex gap-2">
              {plan.styling.options[0].palette.map((c: string) => (
                <div key={c} className="w-8 h-8 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#BCAEAE]">Silhouette</p>
              <p className="text-sm text-[#4A3F3F] font-medium">{plan.styling.options[0].silhouette}</p>
            </div>
          </div>
        </div>

        {/* Why This Works */}
        <section className="p-8 rounded-[40px] bg-white border border-[#FCE4EC] space-y-4">
          <div className="flex items-center gap-3 text-[#D81B60]">
            <Info size={18} />
            <h3 className="font-bold text-[10px] uppercase tracking-widest">Why this works for you</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-[#4A3F3F] leading-relaxed">{plan.why_it_works.harmony}</p>
            <p className="text-sm text-[#8C7E7E] italic leading-relaxed">{plan.why_it_works.psychology}</p>
          </div>
        </section>

        {/* Avoid Tonight */}
        <section className="p-8 rounded-[40px] bg-rose-50/50 border border-rose-100 space-y-4">
          <div className="flex items-center gap-3 text-rose-400">
            <AlertCircle size={18} />
            <h3 className="font-bold text-[10px] uppercase tracking-widest">Avoid Tonight</h3>
          </div>
          <ul className="space-y-2">
            {plan.avoid_tonight.map((item: string) => (
              <li key={item} className="text-xs text-[#4A3F3F] flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-rose-300" /> {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Confidence Coach */}
        <section className="p-8 rounded-[40px] bg-[#4A3F3F] text-white space-y-6 shadow-xl">
          <div className="flex items-center gap-3 text-[#FCE4EC]">
            <Zap size={18} />
            <h3 className="font-bold text-[10px] uppercase tracking-widest">Before You Leave</h3>
          </div>
          <div className="space-y-4">
            <CoachItem icon={<User size={16} />} text={plan.confidence_coach.posture} />
            <CoachItem icon={<Wind size={16} />} text={plan.confidence_coach.breathing} />
            <CoachItem icon={<Brain size={16} />} text={plan.confidence_coach.mindset} />
          </div>
        </section>

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

const CoachItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-start gap-4">
    <div className="text-[#FCE4EC] mt-0.5">{icon}</div>
    <p className="text-xs text-white/90 leading-relaxed">{text}</p>
  </div>
);

export default Results;