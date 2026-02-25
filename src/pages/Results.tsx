import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Share2, ChevronLeft, Sparkles, Palette, CheckCircle2, Video, Mic2, User } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [moment, setMoment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#FFFBFA] pb-32">
      <div className="p-6 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-[#F5F0E1] rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-serif text-xl text-[#4A3F3F]">Moment Plan</h1>
        <div className="w-10" />
      </div>

      <div className="p-8 space-y-8">
        {/* Glow Score Header */}
        <div className="flex items-center justify-between p-8 rounded-[48px] bg-[#E8D5D8] text-[#4A3F3F]">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Glow Score™</p>
            <h2 className="text-5xl font-serif">{plan.glow_score}</h2>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Moment</p>
            <p className="font-bold">{moment.moment_type}</p>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-6">
          <PlanModule icon={<Sparkles size={18} />} title="Look Direction" content={plan.look_direction} />
          <PlanModule icon={<Palette size={18} />} title="Color Palette">
            <div className="flex gap-2 mt-3">
              {plan.color_palette.colors.map((c: string) => (
                <div key={c} className="w-10 h-10 rounded-xl shadow-inner" style={{ backgroundColor: c }} />
              ))}
            </div>
            <p className="text-[10px] text-[#8C7E7E] mt-3 uppercase tracking-widest">Avoid: {plan.color_palette.avoid.join(', ')}</p>
          </PlanModule>
          
          <PlanModule icon={<User size={18} />} title={plan.styling.title} content={plan.styling.content}>
            <ul className="mt-3 space-y-2">
              {plan.styling.tips.map((t: string) => (
                <li key={t} className="text-xs text-[#8C7E7E] flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#E8D5D8]" /> {t}
                </li>
              ))}
            </ul>
          </PlanModule>

          {plan.camera_presence && (
            <PlanModule icon={<Video size={18} />} title="Camera Presence">
              <div className="space-y-3 mt-2">
                <p className="text-sm text-[#4A3F3F]"><span className="font-bold">Framing:</span> {plan.camera_presence.framing}</p>
                <p className="text-sm text-[#4A3F3F]"><span className="font-bold">Eye Line:</span> {plan.camera_presence.eye_line}</p>
                <p className="text-xs italic text-[#8C7E7E]">{plan.camera_presence.micro_expressions}</p>
              </div>
            </PlanModule>
          )}

          {plan.voice_delivery && (
            <PlanModule icon={<Mic2 size={18} />} title="Voice & Delivery">
              <div className="space-y-3 mt-2">
                <p className="text-sm text-[#4A3F3F]"><span className="font-bold">Pacing:</span> {plan.voice_delivery.pacing}</p>
                <div className="p-4 rounded-2xl bg-[#F5F0E1] space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8C7E7E]">Warm-ups</p>
                  {plan.voice_delivery.warmups.map((w: string) => (
                    <p key={w} className="text-xs text-[#4A3F3F]">{w}</p>
                  ))}
                </div>
              </div>
            </PlanModule>
          )}

          <PlanModule icon={<CheckCircle2 size={18} />} title="Quick Checklist">
            <div className="grid gap-2 mt-3">
              {plan.checklist.map((item: string) => (
                <div key={item} className="flex items-center gap-3 p-4 rounded-2xl border border-[#F5F0E1] bg-white">
                  <div className="w-5 h-5 rounded-full border-2 border-[#E8D5D8]" />
                  <span className="text-sm text-[#4A3F3F]">{item}</span>
                </div>
              ))}
            </div>
          </PlanModule>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6">
          <Button className="h-16 rounded-full bg-[#4A3F3F] text-white font-bold shadow-lg">
            <Share2 className="mr-2" size={18} />
            Share Card
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} className="h-16 rounded-full border-2 border-[#F5F0E1] font-bold text-[#4A3F3F]">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

const PlanModule = ({ icon, title, content, children }: any) => (
  <div className="p-8 rounded-[40px] bg-white border border-[#F5F0E1] space-y-3">
    <div className="flex items-center gap-3 text-[#E8D5D8]">
      {icon}
      <h3 className="font-bold text-sm uppercase tracking-widest text-[#4A3F3F]">{title}</h3>
    </div>
    {content && <p className="text-sm text-[#8C7E7E] leading-relaxed">{content}</p>}
    {children}
  </div>
);

export default Results;