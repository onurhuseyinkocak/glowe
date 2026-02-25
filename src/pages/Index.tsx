import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, Heart, Briefcase, Coffee, Moon, Zap, Star, 
  Camera, Flower2, Stars, MapPin, Sun, Cloud, Clock, 
  ChevronRight, Image as ImageIcon, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const OCCASIONS = [
  { id: 'work', label: 'Work', icon: <Briefcase size={20} /> },
  { id: 'date', label: 'Date', icon: <Heart size={20} /> },
  { id: 'dinner', label: 'Dinner', icon: <Coffee size={20} /> },
  { id: 'party', label: 'Party', icon: <Stars size={20} /> },
  { id: 'wedding', label: 'Wedding', icon: <Flower2 size={20} /> },
  { id: 'errands', label: 'Errands', icon: <MapPin size={20} /> },
  { id: 'gym', label: 'Gym', icon: <Zap size={20} /> },
  { id: 'creator', label: 'Creator', icon: <Camera size={20} /> },
];

const Index = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [context, setContext] = useState({
    occasion: 'work',
    time: 'Day',
    formality: 'Smart',
    weather: 'Mild',
    vibe: 'Natural'
  });
  const [refImage, setRefImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/auth'); return; }
    
    const { data: profileData } = await supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profileData) {
      navigate('/onboarding');
    } else {
      setProfile(profileData);
      setContext(prev => ({ ...prev, vibe: profileData.style_energy || 'Natural' }));
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setRefImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBuildLook = () => {
    // Analiz sayfasına context ve refImage ile git
    navigate('/look-analysis', { state: { context, refImage } });
  };

  if (loading) return null;

  return (
    <div className="p-8 space-y-10 pb-48">
      <header className="space-y-4 animate-fade-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FCE4EC] animate-ping" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#BCAEAE] font-bold">Presence OS v1.2</p>
          </div>
          <Flower2 className="text-[#FCE4EC] animate-spin-slow" size={24} />
        </div>
        <h1 className="text-5xl font-serif text-[#4A3F3F] leading-[1.1]">
          Where are you <br />
          <span className="italic text-[#D81B60]">going today?</span>
        </h1>
      </header>

      <section className="space-y-4 animate-fade-up">
        <p className="text-[9px] font-bold text-[#BCAEAE] uppercase tracking-[0.3em] ml-2">Occasion</p>
        <div className="grid grid-cols-4 gap-3">
          {OCCASIONS.map((occ) => (
            <button
              key={occ.id}
              onClick={() => setContext({ ...context, occasion: occ.id })}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-[24px] border-2 transition-all gap-2",
                context.occasion === occ.id 
                  ? "bg-white border-[#D81B60] text-[#D81B60] shadow-lg scale-105" 
                  : "bg-white border-[#FCE4EC] text-[#BCAEAE]"
              )}
            >
              {occ.icon}
              <span className="text-[8px] font-bold uppercase tracking-tighter">{occ.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <p className="text-[9px] font-bold text-[#BCAEAE] uppercase tracking-[0.3em] ml-2">Time & Formality</p>
            <div className="p-6 rounded-[32px] bg-white border border-[#FCE4EC] space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#4A3F3F]">Time</span>
                <button 
                  onClick={() => setContext({...context, time: context.time === 'Day' ? 'Night' : 'Day'})}
                  className="text-[10px] font-bold text-[#D81B60] uppercase"
                >
                  {context.time}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#4A3F3F]">Style</span>
                <select 
                  value={context.formality}
                  onChange={(e) => setContext({...context, formality: e.target.value})}
                  className="text-[10px] font-bold text-[#D81B60] uppercase bg-transparent outline-none text-right"
                >
                  <option>Casual</option>
                  <option>Smart</option>
                  <option>Formal</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[9px] font-bold text-[#BCAEAE] uppercase tracking-[0.3em] ml-2">Weather & Vibe</p>
            <div className="p-6 rounded-[32px] bg-white border border-[#FCE4EC] space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#4A3F3F]">Weather</span>
                <select 
                  value={context.weather}
                  onChange={(e) => setContext({...context, weather: e.target.value})}
                  className="text-[10px] font-bold text-[#D81B60] uppercase bg-transparent outline-none text-right"
                >
                  <option>Hot</option>
                  <option>Mild</option>
                  <option>Cold</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#4A3F3F]">Vibe</span>
                <span className="text-[10px] font-bold text-[#D81B60] uppercase">{context.vibe}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 animate-fade-up" style={{ animationDelay: '400ms' }}>
        <p className="text-[9px] font-bold text-[#BCAEAE] uppercase tracking-[0.3em] ml-2">Inspiration (Optional)</p>
        <div 
          onClick={() => !refImage && fileInputRef.current?.click()}
          className={cn(
            "h-24 rounded-[32px] border-2 border-dashed flex items-center justify-center transition-all relative overflow-hidden",
            refImage ? "border-[#D81B60]" : "border-[#FCE4EC] bg-white hover:bg-[#FCE4EC]/10"
          )}
        >
          {refImage ? (
            <>
              <img src={refImage} className="w-full h-full object-cover opacity-40" alt="Ref" />
              <div className="absolute inset-0 flex items-center justify-center gap-2">
                <ImageIcon size={16} className="text-[#D81B60]" />
                <span className="text-[10px] font-bold text-[#D81B60] uppercase">Reference Loaded</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setRefImage(null); }}
                className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
              >
                <X size={12} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 text-[#BCAEAE]">
              <ImageIcon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Upload Venue or Inspo</span>
            </div>
          )}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
      </section>

      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[88%] max-w-sm z-40">
        <Button 
          onClick={handleBuildLook}
          className="w-full h-20 rounded-full bg-[#4A3F3F] text-white text-lg font-bold shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-4 border-t border-white/10"
        >
          <Sparkles size={20} />
          Build My Look
        </Button>
      </div>
    </div>
  );
};

export default Index;