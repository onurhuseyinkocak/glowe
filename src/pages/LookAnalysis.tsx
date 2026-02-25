import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { generateLookPlan } from '@/lib/gemini';
import { Loader2, Sparkles } from 'lucide-react';
import { showError } from '@/utils/toast';

const LookAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { context, refImage } = location.state || {};

  useEffect(() => {
    if (!context) { navigate('/'); return; }
    processLook();
  }, []);

  const processLook = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Auth required");

      // Gardırobu çek
      const { data: wardrobe } = await supabase
        .from('wardrobe_items')
        .select('*')
        .eq('user_id', user.id);

      // Gemini ile plan oluştur
      const plan = await generateLookPlan(context, wardrobe || [], refImage);

      // Planı kaydet
      const { data: savedPlan, error } = await supabase.from('look_plans').insert({
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        occasion: context.occasion,
        context: context,
        recommended_outfit: plan.recommended_outfits[0],
        makeup_or_grooming: plan.makeup_or_grooming,
        accessories_or_hijab: plan.covering_or_hair,
        rationale: plan.why
      }).select().single();

      if (error) throw error;

      navigate(`/look-result/${savedPlan.id}`, { state: { plan } });
    } catch (error: any) {
      showError(error.message);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-12 bg-[#FFF9F9] text-center space-y-12">
      <div className="relative">
        <div className="w-40 h-40 rounded-full border-2 border-[#FCE4EC] flex items-center justify-center">
          <Loader2 className="animate-spin text-[#D81B60]" size={48} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="text-[#D81B60]/40 animate-pulse" size={32} />
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-serif text-[#4A3F3F]">Curating your presence...</h2>
        <p className="text-[#BCAEAE] max-w-[240px] mx-auto italic">"Style is a way to say who you are without having to speak."</p>
      </div>
    </div>
  );
};

export default LookAnalysis;