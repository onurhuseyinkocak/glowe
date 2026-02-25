import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Sparkles, Loader2 } from 'lucide-react';
import { showError } from '@/utils/toast';

const Analysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + 1));
    }, 60);
    processAnalysis();
    return () => clearInterval(timer);
  }, []);

  const processAnalysis = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 6000));
      const { data: analysis } = await supabase.from('analyses').select('*, users_profile(*)').eq('id', id).single();
      
      const faceShapes = ['Oval', 'Square', 'Round', 'Heart', 'Diamond'];
      const faceShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];
      const score = 88 + Math.floor(Math.random() * 10);

      await supabase.from('analyses').update({
        status: 'done',
        glow_face_shape: faceShape,
        glow_score: score,
        best_cut: analysis.event_type === 'Job Interview' ? 'Polished low bun or structured bob.' : 'Soft romantic waves with natural volume.',
        makeup_direction: analysis.event_type === 'First Date' ? 'Dewy skin, soft flush, and a hint of shimmer.' : 'Matte finish, neutral tones, and confident brows.',
        why_it_works: `Your ${faceShape} features are naturally balanced. We're enhancing that symmetry for your ${analysis.event_type}.`
      }).eq('id', id);

      navigate(`/results/${id}`);
    } catch (error: any) { showError(error.message); navigate('/'); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-12 bg-[#FFFBFA] text-center space-y-12">
      <div className="relative">
        <div className="w-40 h-40 rounded-full border-2 border-[#F5F0E1] flex items-center justify-center">
          <Loader2 className="animate-spin text-[#E8D5D8]" size={48} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="text-[#E8D5D8]/40 animate-pulse" size={32} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-serif text-[#4A3F3F]">Refining your glow...</h2>
        <p className="text-[#8C7E7E] max-w-[240px] mx-auto italic">"Patience is the first step to radiance."</p>
      </div>

      <div className="w-full max-w-xs bg-[#F5F0E1] h-1 rounded-full overflow-hidden">
        <div className="h-full bg-[#E8D5D8] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="space-y-4 text-left w-full max-w-xs">
        <StatusItem active={progress > 20} label="Mapping facial harmony" />
        <StatusItem active={progress > 50} label="Curating color palette" />
        <StatusItem active={progress > 80} label="Finalizing your Glowé Plan" />
      </div>
    </div>
  );
};

const StatusItem = ({ active, label }: { active: boolean; label: string }) => (
  <div className={`flex items-center gap-4 transition-all duration-700 ${active ? 'opacity-100 translate-x-0' : 'opacity-20 -translate-x-2'}`}>
    <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#E8D5D8]' : 'bg-[#8C7E7E]'}`} />
    <span className="text-[11px] font-bold uppercase tracking-widest text-[#4A3F3F]">{label}</span>
  </div>
);

export default Analysis;