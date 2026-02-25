import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Camera, Sparkles, Wand2, Heart, ChevronRight } from 'lucide-react';
import { showError } from '@/utils/toast';

const Index = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/auth'); return; }
    const { data: profile } = await supabase.from('users_profile').select('*').eq('user_id', user.id).single();
    if (!profile) navigate('/onboarding');
    else setProfile(profile);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const fileName = `${user.id}/${Date.now()}.jpg`;
      await supabase.storage.from('selfies').upload(fileName, file);
      const { data: { publicUrl } } = supabase.storage.from('selfies').getPublicUrl(fileName);
      const { data: analysis } = await supabase.from('analyses').insert({
        user_id: user.id,
        selfie_public_url: publicUrl,
        status: 'processing',
        event_type: profile.target_event,
        style_energy: profile.style_energy
      }).select().single();
      navigate(`/analysis/${analysis.id}`);
    } catch (error: any) { showError(error.message); }
  };

  if (loading) return null;

  return (
    <div className="p-8 space-y-12 bg-[#FFFBFA] min-h-screen">
      <header className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#8C7E7E] font-bold">Welcome to Glowé</p>
        <h1 className="text-4xl font-serif text-[#4A3F3F]">Refine your glow, {profile?.first_name || 'dear'}.</h1>
      </header>

      {/* Premium Event Mode Centerpiece */}
      <div className="relative overflow-hidden rounded-[48px] bg-[#E8D5D8] p-10 aspect-[4/5] flex flex-col justify-between shadow-2xl shadow-rose-100/50 group">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
        
        <div className="space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-[#4A3F3F]">
            <Sparkles size={12} />
            {profile?.target_event || 'Glow-Up'} Mode
          </div>
          <h2 className="text-5xl font-serif leading-tight text-[#4A3F3F]">Your moment<br />is waiting.</h2>
          <p className="text-[#4A3F3F]/60 text-sm max-w-[220px] leading-relaxed italic">"You don’t need to change. Just refine your glow."</p>
        </div>

        <div className="space-y-4 relative z-10">
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-16 rounded-full bg-[#4A3F3F] text-white hover:bg-[#2D2424] text-lg font-bold shadow-xl transition-all hover:scale-[1.02]"
          >
            <Camera className="mr-2" size={20} />
            Generate Plan
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
          <p className="text-center text-[10px] font-bold text-[#4A3F3F]/40 uppercase tracking-widest">Capture your natural light</p>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-serif text-2xl text-[#4A3F3F]">Recent Moments</h3>
          <button onClick={() => navigate('/history')} className="text-[10px] font-bold text-[#8C7E7E] uppercase tracking-widest hover:text-[#4A3F3F] transition-colors">View All</button>
        </div>
        <div className="p-8 rounded-[40px] bg-[#F5F0E1] flex items-center gap-6 group cursor-pointer hover:bg-[#EFE9D5] transition-all" onClick={() => navigate('/onboarding')}>
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[#4A3F3F] shadow-sm group-hover:scale-110 transition-transform">
            <Wand2 size={28} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-[#4A3F3F] text-lg">Change Event</p>
            <p className="text-xs text-[#8C7E7E]">Preparing for something new?</p>
          </div>
          <ChevronRight className="text-[#8C7E7E] group-hover:translate-x-2 transition-transform" />
        </div>
      </section>
    </div>
  );
};

export default Index;