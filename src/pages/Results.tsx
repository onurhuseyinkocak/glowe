import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Share2, Copy, ChevronLeft, Sparkles, Palette } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import confetti from 'canvas-confetti';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    const { data, error } = await supabase.from('analyses').select('*, users_profile(*)').eq('id', id).single();
    if (error) { showError('Moment not found'); navigate('/'); return; }
    setAnalysis(data);
    setLoading(false);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 }, colors: ['#E8D5D8', '#D1C4E9', '#F5F0E1'] });
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#FFFBFA] pb-24">
      <div className="p-6 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-[#F5F0E1] rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-serif text-xl text-[#4A3F3F]">Your Glowé Plan</h1>
        <div className="w-10" />
      </div>

      <div className="p-8 space-y-10">
        {/* Glow Score Badge */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="64" cy="64" r="60" fill="none" stroke="#F5F0E1" strokeWidth="8" />
              <circle cx="64" cy="64" r="60" fill="none" stroke="#E8D5D8" strokeWidth="8" strokeDasharray="377" strokeDashoffset={377 - (377 * (analysis.glow_score || 85)) / 100} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-serif font-bold text-[#4A3F3F]">{analysis.glow_score || 85}</span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-[#8C7E7E]">Glow Score™</span>
            </div>
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-serif text-[#4A3F3F]">{analysis.glow_face_shape || 'Oval'} Harmony</h2>
            <p className="text-xs text-[#8C7E7E] uppercase tracking-widest font-bold">{analysis.event_type || 'Special Event'} Mode</p>
          </div>
        </div>

        {/* Glow Direction Sections */}
        <div className="space-y-6">
          <GlowSection 
            title="Hair Direction" 
            content={analysis.best_cut || 'Soft waves with a center part to frame your features.'} 
            icon={<Sparkles size={18} />}
          />
          
          <div className="p-8 rounded-[40px] bg-[#F5F0E1] space-y-4">
            <div className="flex items-center gap-3 text-[#4A3F3F]">
              <Palette size={18} />
              <h3 className="font-bold text-sm uppercase tracking-widest">Color Palette</h3>
            </div>
            <div className="flex gap-3">
              {['#E8D5D8', '#D1C4E9', '#4A3F3F', '#F5F0E1'].map(c => (
                <div key={c} className="w-12 h-12 rounded-2xl shadow-inner" style={{ backgroundColor: c }} />
              ))}
            </div>
            <p className="text-sm text-[#8C7E7E] leading-relaxed italic">"These tones will enhance your natural radiance for this {analysis.event_type}."</p>
          </div>

          <GlowSection 
            title="Makeup & Vibe" 
            content={analysis.makeup_direction || 'Luminous skin with a soft rose lip. Keep the eyes natural but defined.'} 
            icon={<Sparkles size={18} />}
          />
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-[#F5F0E1] text-center space-y-3">
          <p className="text-sm text-[#4A3F3F] leading-relaxed font-serif italic">
            "You are already radiant. This plan is simply a mirror to your best self."
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button className="h-16 rounded-full bg-[#4A3F3F] text-white font-bold shadow-lg">
            <Share2 className="mr-2" size={18} />
            Share Plan
          </Button>
          <Button variant="outline" onClick={() => { navigator.clipboard.writeText(analysis.barber_instructions); showSuccess('Copied to clipboard'); }} className="h-16 rounded-full border-2 border-[#F5F0E1] font-bold text-[#4A3F3F]">
            <Copy className="mr-2" size={18} />
            Copy Details
          </Button>
        </div>
      </div>
    </div>
  );
};

const GlowSection = ({ title, content, icon }: { title: string, content: string, icon: React.ReactNode }) => (
  <div className="p-8 rounded-[40px] bg-white border border-[#F5F0E1] space-y-3">
    <div className="flex items-center gap-3 text-[#E8D5D8]">
      {icon}
      <h3 className="font-bold text-sm uppercase tracking-widest text-[#4A3F3F]">{title}</h3>
    </div>
    <p className="text-[#8C7E7E] leading-relaxed">{content}</p>
  </div>
);

export default Results;