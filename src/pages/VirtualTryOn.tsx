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
    if (!image) return showError('Önce bir fotoğraf çekmelisin!');
    setProcessing(true);
    
    // Simüle edilmiş AI işlemi
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Gerçek uygulamada burada bir Edge Function çağrılır
    // Şimdilik orijinal resmi "AI ile işlenmiş" gibi gösteriyoruz
    setResultImage(image); 
    setSelectedStyle(styleName || 'Custom AI');
    setProcessing(false);
    showSuccess('AI Tarzın Hazır!');
  };

  const saveToFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Giriş yapmalısın');

      const { error } = await supabase.from('favorite_styles').insert({
        user_id: user.id,
        style_name: selectedStyle,
        image_url: resultImage,
        prompt: customPrompt
      });

      if (error) throw error;
      showSuccess('Favorilere eklendi!');
    } catch (error: any) {
      showError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="p-4 flex items-center gap-4 border-b">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">AI Virtual Try-On</h1>
      </div>

      <div className="p-6 space-y-8">
        {/* Preview Area */}
        <div className="relative aspect-[3/4] bg-gray-100 rounded-[32px] overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center">
          {resultImage ? (
            <img src={resultImage} className="w-full h-full object-cover" alt="Result" />
          ) : image ? (
            <img src={image} className="w-full h-full object-cover opacity-50" alt="Original" />
          ) : (
            <div className="text-center space-y-4 p-8">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Camera className="text-gray-400" size={32} />
              </div>
              <p className="text-sm text-gray-500 font-medium">Anlık bir selfie çek veya yükle</p>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="rounded-xl">
                Fotoğraf Seç
              </Button>
            </div>
          )}

          {processing && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-4">
              <RefreshCw className="animate-spin" size={48} />
              <p className="font-bold animate-pulse">AI Saçını Tasarlıyor...</p>
            </div>
          )}

          {resultImage && !processing && (
            <button 
              onClick={saveToFavorites}
              className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-red-500"
            >
              <Heart fill="currentColor" />
            </button>
          )}
        </div>

        <input type="file" ref={fileInputRef} onChange={handleCapture} accept="image/*" className="hidden" />

        {/* Style Presets */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Hızlı Stiller</h3>
          <div className="grid grid-cols-4 gap-3">
            {PRESET_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => applyAI(style.name)}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-gray-50 hover:bg-black hover:text-white transition-all"
              >
                <span className="text-2xl">{style.icon}</span>
                <span className="text-[10px] font-bold text-center">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom AI Prompt */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">AI Hayal Gücü</h3>
          <div className="relative">
            <Input
              placeholder="Örn: Beni sarışın ve uzun saçlı yap..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="h-14 pr-14 rounded-2xl border-2 focus:border-black"
            />
            <button 
              onClick={() => applyAI()}
              className="absolute right-2 top-2 w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center"
            >
              <Wand2 size={18} />
            </button>
          </div>
        </div>

        {resultImage && (
          <Button 
            onClick={() => navigate('/barbers')}
            className="w-full h-16 rounded-2xl bg-black text-white text-lg font-bold shadow-xl"
          >
            <Sparkles className="mr-2" />
            Bu Tarzı Kestir
          </Button>
        )}
      </div>
    </div>
  );
};

export default VirtualTryOn;