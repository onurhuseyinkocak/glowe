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
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    processAnalysis();

    return () => clearInterval(timer);
  }, []);

  const processAnalysis = async () => {
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 5000));

      const { data: analysis } = await supabase
        .from('analyses')
        .select('*, users_profile(*)')
        .eq('id', id)
        .single();

      if (!analysis) throw new Error('Analysis not found');

      // Mock AI Logic based on profile
      const profile = analysis.users_profile;
      const faceShapes = ['oval', 'square', 'round', 'oblong', 'diamond'];
      const faceShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];
      
      let bestCut = 'Classic Taper';
      let instructions = 'Keep it clean on the sides with a #2 guard. Blend into a textured top about 2 inches long.';
      
      if (profile.style_vibe === 'trendy') {
        bestCut = 'Textured Crop Fade';
        instructions = 'High skin fade on the sides. Heavy texture on top with a blunt fringe.';
      } else if (profile.style_vibe === 'bold') {
        bestCut = 'Modern Mullet';
        instructions = 'Burst fade on the temples. Keep length in the back and messy texture on top.';
      }

      const { error } = await supabase
        .from('analyses')
        .update({
          status: 'done',
          face_shape: faceShape,
          best_cut: bestCut,
          barber_instructions: instructions,
          why_it_works: `The ${bestCut} complements your ${faceShape} face shape by adding height and structure.`,
          share_title: `My new look: ${bestCut}`,
          share_hashtags: ['CutMatch', 'FreshCut', 'BarberStyle']
        })
        .eq('id', id);

      if (error) throw error;
      navigate(`/results/${id}`);
    } catch (error: any) {
      showError(error.message);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-black text-white text-center space-y-8">
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-4 border-white/10 flex items-center justify-center">
          <Loader2 className="animate-spin text-white" size={48} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="text-white/50 animate-pulse" size={24} />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Analyzing your features</h2>
        <p className="text-gray-400">Our AI is crafting your perfect style card...</p>
      </div>

      <div className="w-full max-w-xs bg-white/10 h-1.5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 text-left w-full max-w-xs">
        <StatusItem active={progress > 20} label="Scanning face shape" />
        <StatusItem active={progress > 50} label="Detecting hair texture" />
        <StatusItem active={progress > 80} label="Matching style preferences" />
      </div>
    </div>
  );
};

const StatusItem = ({ active, label }: { active: boolean; label: string }) => (
  <div className={`flex items-center gap-3 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-20'}`}>
    <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-400' : 'bg-white'}`} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default Analysis;