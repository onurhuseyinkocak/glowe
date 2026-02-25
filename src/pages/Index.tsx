import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Camera, Sparkles, Wand2, Heart, ChevronRight, Scissors } from 'lucide-react';
import { showError } from '@/utils/toast';

const Index = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }

    const { data: profile } = await supabase
      .from('users_profile')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) navigate('/onboarding');
    else setProfile(profile);
    setLoading(false);
  };

  if (loading) return null;

  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Selam, {profile?.first_name || 'Dostum'}!</h1>
          <p className="text-gray-500">Bugün nasıl görünmek istersin?</p>
        </div>
        <button onClick={() => navigate('/favorites')} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-red-500 shadow-sm">
          <Heart size={24} />
        </button>
      </header>

      {/* AI Virtual Try-On Hero */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-black to-gray-800 p-8 text-white aspect-[4/5] flex flex-col justify-between shadow-2xl">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest">
            <Sparkles size={12} className="text-yellow-400" />
            Yeni Özellik
          </div>
          <h2 className="text-4xl font-black leading-tight tracking-tighter">AI İLE<br />TARZINI YARAT.</h2>
          <p className="text-gray-400 text-sm max-w-[220px]">Saçını kestirmeden önce AI ile üzerinde nasıl duracağını anlık gör.</p>
        </div>

        <div className="space-y-4 relative z-10">
          <Button 
            onClick={() => navigate('/try-on')}
            className="w-full h-16 rounded-2xl bg-white text-black hover:bg-gray-100 text-lg font-black shadow-xl"
          >
            <Wand2 className="mr-2" />
            Sanal Denemeyi Başlat
          </Button>
          <div className="flex justify-center gap-6 text-[10px] font-bold text-white/40 uppercase tracking-widest">
            <span>Anlık Değişim</span>
            <span>•</span>
            <span>AI Prompt</span>
            <span>•</span>
            <span>Favorile</span>
          </div>
        </div>
      </div>

      {/* Classic Analysis Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Hızlı Analiz</h3>
          <button onClick={() => navigate('/history')} className="text-xs font-bold text-gray-400 uppercase tracking-widest">Geçmiş</button>
        </div>
        <button 
          onClick={() => navigate('/onboarding')}
          className="w-full p-6 rounded-3xl bg-gray-50 border border-gray-100 flex items-center gap-4 text-left hover:border-black transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
            <Scissors size={24} />
          </div>
          <div className="flex-1">
            <p className="font-bold">Yüz Şekli Analizi</p>
            <p className="text-xs text-gray-500">Sana en uygun kesimi AI belirlesin.</p>
          </div>
          <ChevronRight className="text-gray-300" />
        </button>
      </section>
    </div>
  );
};

export default Index;