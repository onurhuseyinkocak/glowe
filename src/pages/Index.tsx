import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Sparkles, ChevronRight } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

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
    if (!user) {
      navigate('/auth');
      return;
    }

    const { data: profile } = await supabase
      .from('users_profile')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      navigate('/onboarding');
    } else {
      setProfile(profile);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showError('File size must be less than 10MB');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('selfies')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('selfies')
        .getPublicUrl(fileName);

      const { data: analysis, error: dbError } = await supabase
        .from('analyses')
        .insert({
          user_id: user.id,
          selfie_path: fileName,
          selfie_public_url: publicUrl,
          status: 'processing'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      navigate(`/analysis/${analysis.id}`);
    } catch (error: any) {
      showError(error.message);
    }
  };

  if (loading) return null;

  return (
    <div className="p-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Hey, {profile?.first_name || 'there'}!</h1>
        <p className="text-gray-500">Ready for your next look?</p>
      </header>

      <div className="relative overflow-hidden rounded-3xl bg-black p-8 text-white aspect-[4/5] flex flex-col justify-between">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Sparkles size={120} />
        </div>
        
        <div className="space-y-2 relative z-10">
          <h2 className="text-4xl font-bold leading-tight">Find your<br />perfect cut.</h2>
          <p className="text-gray-400 max-w-[200px]">AI-powered analysis based on your face shape and hair profile.</p>
        </div>

        <div className="space-y-3 relative z-10">
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-14 rounded-2xl bg-white text-black hover:bg-gray-100 text-lg font-bold"
          >
            <Camera className="mr-2" />
            Take Selfie
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <p className="text-center text-xs text-gray-500">Or upload from gallery</p>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Quick Tips</h3>
          <button className="text-sm text-gray-500 font-medium">View All</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <p className="text-sm font-bold">Good Lighting</p>
            <p className="text-xs text-gray-500">Natural light works best for AI analysis.</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Camera size={16} />
            </div>
            <p className="text-sm font-bold">Front View</p>
            <p className="text-xs text-gray-500">Look directly at the camera for accuracy.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;