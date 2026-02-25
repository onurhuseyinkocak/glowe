import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Sparkles, Heart, ChevronLeft, Wand2, RefreshCw } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

const PRESET_STYLES = [
  { id: 'buzz', name: 'Buzz Cut', icon: '👨‍🦲' },
  { id: 'pompadour', name: 'Pompadour', icon: '💇‍♂️' },
  { id: 'fade', name: 'Skin Fade', icon: '✂️' },
  { id: 'long', name: 'Long Flow', icon: '🧔' },
];

const VirtualTryOn = () => {
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const applyAI = async (styleName?: string) => {
    if (!image) return showError('Please upload a photo first!');
    setProcessing(true);
    
    // Simulate AI Processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real app, this would call an Edge Function
    setResultImage(image); 
    setSelectedStyle(styleName || 'Custom AI Style');
    setProcessing(false);
    showSuccess('AI Style Generated!');
  };

  const saveToFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in');

      const { error } = await supabase.from('favorite_styles').insert({
        user_id: user.id,
        style_name: selectedStyle,
        image_url: resultImage,
        prompt: customPrompt
      });

      if (error) throw error;
      showSuccess('Saved to favorites!');
    } catch (error: any) {
      showError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBFA] pb-32">
      <div className="p-6 flex items-center gap-4 bg-white border-b border-[#F5F0E1]">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#F5F0E1] rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-serif text-xl text-[#4A3F3F]">AI Virtual Try-On</h1>
      </div>

      <div className="p-8 space-y-8">
        <div className="relative aspect-[3/4] bg-white rounded-[40px] overflow-hidden border-2 border-dashed border-[#F5F0E1] flex items-center justify-center shadow-sm">
          {resultImage ? (
            <img src={resultImage} className="w-full h-full object-cover" alt="Result" />
          ) : image ? (
            <img src={image} className="w-full h-full object-cover opacity-50" alt="Original" />
          ) : (
            <div className="text-center space-y-4 p-8">
              <div className="w-20 h-20 bg-[#F5F0E1] rounded-full flex items-center justify-center mx-auto">
                <Camera className="text-[#8C7E7E]" size={32} />
              </div>
              <p className="text-sm text-[#8C7E7E] font-medium">Take a selfie or upload</p>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="rounded-full border-[#F5F0E1]">
                Select Photo
              </Button>
            </div>
          )}

          {processing && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center text-[#4A3F3F] space-y-4">
              <RefreshCw className="animate-spin text-[#E8D5D8]" size={48} />
              <p className="font-bold animate-pulse uppercase tracking-widest text-xs">AI Designing Your Look...</p>
            </div>
          )}

          {resultImage && !processing && (
            <button 
              onClick={saveToFavorites}
              className="absolute top-6 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl text-rose-500 hover:scale-110 transition-transform"
            >
              <Heart fill="currentColor" size={24} />
            </button>
          )}
        </div>

        <input type="file" ref={fileInputRef} onChange={handleCapture} accept="image/*" className="hidden" />

        <div className="space-y-4">
          <p className="text-[10px] font-bold text-[#8C7E7E] uppercase tracking-[0.3em] ml-2">Quick Styles</p>
          <div className="grid grid-cols-4 gap-3">
            {PRESET_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => applyAI(style.name)}
                className="flex flex-col items-center gap-2 p-4 rounded-[24px] bg-white border border-[#F5F0E1] hover:border-[#E8D5D8] transition-all"
              >
                <span className="text-2xl">{style.icon}</span>
                <span className="text-[9px] font-bold text-center uppercase tracking-tighter">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-bold text-[#8C7E7E] uppercase tracking-[0.3em] ml-2">AI Imagination</p>
          <div className="relative">
            <Input
              placeholder="e.g. Make me blonde with long flow..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="h-16 pr-16 rounded-[24px] border-[#F5F0E1] bg-white focus:ring-[#E8D5D8] px-6"
            />
            <button 
              onClick={() => applyAI()}
              className="absolute right-2 top-2 w-12 h-12 bg-[#4A3F3F] text-white rounded-2xl flex items-center justify-center hover:bg-black transition-colors"
            >
              <Wand2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;