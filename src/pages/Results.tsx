import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { 
  Share2, ChevronLeft, Sparkles, Palette, CheckCircle2, 
  Video, Mic2, User, Scissors, Heart, ShieldCheck, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { showSuccess } from '@/utils/toast';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [moment, setMoment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('outfit');
  const [expandedCheck, setExpandedCheck] = useState<number | null>(null);

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

  const tabs = [
    { id: 'outfit', label: 'Outfit', icon: <Palette size={16} /> },
    { id: 'beauty', label: 'Beauty', icon: <Sparkles size={16} /> },
    { id: 'hair', label: 'Hair', icon: <Scissors size={16} /> },
    { id: 'presence', label: 'Presence', icon: <User size={16} /> },
  ];

  return (
    <div className={cn(
      "min-h-screen pb-32 transition-colors duration-1000",
      isDate ? "bg-[#FFF9F9]" : "bg-[#FFFBFA]"
    )}>
      {/* Hero Header */}
      <div className="relative h-80 overflow-hidden">
        <div className={cn(
          "absolute inset-0 opacity-30",
          isDate ? "bg-gradient-to-br from-rose-200 via-pink-100 to-transparent" : "bg-gradient-to-br from-blue-100 via-white to-transparent"
        )} />
        {isDate && (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-64 h-64 rounded-full bg-rose-300 blur-[100px] animate-pulse" />
          </div>
        )}
        
        <div className="relative z-10 p-8 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="p-2 bg-white/50 backdrop-blur-md rounded-full">
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white shadow-sm">
              <Sparkles size={14} className="text-[#D81B60]" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Glow Score: {plan.glow_score}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl font-serif text-[#4A3F3F] capitalize">{moment.moment_type.replace('-', ' ')}</h1>
            <p className="text-sm text-[#8C7E7E] font-medium italic">{plan.look_direction}</p>
          </div>
        </div>
      </div>

      {/* Context Bar */}
      <div className="px-8 -mt-8 relative z-20">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
          {Object.entries(moment.context_modifiers).map(([key, val]: any) => (
            <div key={key} className="px-4 py-2 rounded-full bg-white border border-[#FCE4EC] shadow-sm whitespace-nowrap">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#BCAEAE] mr-2">{key}:</span>
              <span className="text-[10px] font-bold text-[#4A3F3F]">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 mt-8 space-y-8">
        <div className="flex justify-between border-b border-[#FCE4EC]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-4 px-2 flex flex-col items-center gap-2 transition-all relative",
                activeTab === tab.id ? "text-[#D81B60]" : "text-[#BCAEAE]"
              )}
            >
              {tab.icon}
              <span className="text-[9px] font-bold uppercase tracking-widest">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D81B60] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-up">
          {activeTab === 'outfit' && (
            <div className="space-y-6">
              {plan.styling.options.map((opt: any, i: number) => (
                <div key={i} className="p-8 rounded-[40px] bg-white border border-[#FCE4EC] space-y-6 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-2xl text-[#4A3F3F]">{opt.title}</h3>
                    {i === 0 && <div className="px-3 py-1 rounded-full bg-[#FCE4EC] text-[8px] font-bold text-[#D81B60] uppercase tracking-widest">Best Match</div>}
                  </div>
                  <p className="text-sm text-[#8C7E7E] leading-relaxed">{opt.silhouette}</p>
                  <div className="space-y-3">
                    <p className="text-[9px] font-bold text-[#BCAEAE] uppercase tracking-widest">Palette</p>
                    <div className="flex gap-2">
                      {opt.palette.map((c: string) => (
                        <div key={c} className="w-10 h-10 rounded-xl shadow-inner border border-black/5" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#FCE4EC]">
                    <p className="text-[9px] font-bold text-red-300 uppercase tracking-widest">Avoid: {opt.avoid.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'beauty' && (
            <div className="p-8 rounded-[40px] bg-white border border-[#FCE4EC] space-y-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FCE4EC] flex items-center justify-center text-[#D81B60]">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[#4A3F3F]">{plan.makeup_grooming.focus}</h3>
                  <p className="text-xs text-[#BCAEAE]">{plan.makeup_grooming.finish} Finish</p>
                </div>
              </div>
              <div className="space-y-4">
                {plan.makeup_grooming.steps.map((step: string, i: number) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-2xl font-serif text-[#FCE4EC]">{i + 1}</span>
                    <p className="text-sm text-[#4A3F3F] leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hair' && (
            <div className="p-8 rounded-[40px] bg-white border border-[#FCE4EC] space-y-8 shadow-sm">
              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-[#4A3F3F]">{plan.hair_covering.title}</h3>
                <p className="text-sm text-[#8C7E7E]">{plan.hair_covering.direction}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Do's</p>
                  <ul className="space-y-2">
                    {plan.hair_covering.dos.map((item: string) => (
                      <li key={item} className="text-xs text-[#4A3F3F] flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-400" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Don'ts</p>
                  <ul className="space-y-2">
                    {plan.hair_covering.donts.map((item: string) => (
                      <li key={item} className="text-xs text-[#4A3F3F] flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-red-400" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'presence' && (
            <div className="space-y-6">
              <div className="p-8 rounded-[40px] bg-[#4A3F3F] text-white space-y-4 shadow-xl">
                <div className="flex items-center gap-3 text-[#FCE4EC]">
                  <Zap size={20} />
                  <h3 className="font-bold text-sm uppercase tracking-widest">The Entrance</h3>
                </div>
                <p className="text-lg font-serif italic leading-relaxed">"{plan.presence.entrance}"</p>
              </div>
              <div className="p-8 rounded-[40px] bg-white border border-[#FCE4EC] space-y-6 shadow-sm">
                <div className="space-y-3">
                  <p className="text-[9px] font-bold text-[#BCAEAE] uppercase tracking-widest">Posture Cues</p>
                  <div className="grid gap-2">
                    {plan.presence.posture.map((p: string) => (
                      <div key={p} className="flex items-center gap-3 p-4 rounded-2xl bg-[#FFF9F9] border border-[#FCE4EC]">
                        <ShieldCheck size={16} className="text-[#D81B60]" />
                        <span className="text-xs font-bold text-[#4A3F3F]">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-[#FCE4EC]">
                  <p className="text-[9px] font-bold text-[#BCAEAE] uppercase tracking-widest mb-2">Calm Technique</p>
                  <p className="text-sm text-[#4A3F3F]">{plan.presence.calm_technique}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Checklist */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-serif text-2xl text-[#4A3F3F]">Final Prep</h3>
            <CheckCircle2 size={20} className="text-[#D81B60]" />
          </div>
          <div className="space-y-3">
            {plan.checklist.map((item: any, i: number) => (
              <div 
                key={i} 
                className="rounded-[32px] bg-white border border-[#FCE4EC] overflow-hidden transition-all duration-500"
              >
                <button 
                  onClick={() => setExpandedCheck(expandedCheck === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full border-2 border-[#FCE4EC] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#D81B60] opacity-0 transition-opacity" />
                    </div>
                    <span className="text-sm font-bold text-[#4A3F3F]">{item.task}</span>
                  </div>
                  <ChevronLeft className={cn("text-[#BCAEAE] transition-transform", expandedCheck === i ? "rotate-90" : "-rotate-90")} size={18} />
                </button>
                {expandedCheck === i && (
                  <div className="px-16 pb-6 animate-fade-down">
                    <p className="text-xs text-[#8C7E7E] leading-relaxed">{item.how}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final Ready Card */}
        <div className="pt-12 space-y-8">
          <div className="p-10 rounded-[50px] bg-gradient-to-br from-[#FCE4EC] to-[#F3E5F5] text-center space-y-6 shadow-inner">
            <h3 className="text-3xl font-serif text-[#4A3F3F]">You're Ready.</h3>
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#D81B60] uppercase tracking-widest">Remember</p>
              <p className="text-sm text-[#4A3F3F] italic">Shoulders down. Chin neutral. Deep breath.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => {
                showSuccess('Glow Card Saved');
                navigate('/history');
              }}
              className="h-20 rounded-full bg-[#4A3F3F] text-white font-bold shadow-xl hover:bg-black transition-all"
            >
              <Heart className="mr-2" size={18} />
              Save Look
            </Button>
            <Button 
              variant="outline" 
              onClick={() => showSuccess('Ready to share')}
              className="h-20 rounded-full border-2 border-[#FCE4EC] font-bold text-[#4A3F3F] bg-white"
            >
              <Share2 className="mr-2" size={18} />
              Share Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;