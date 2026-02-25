import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Sparkles, Check, Camera, Heart, User } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const STEPS = 5;

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    identity: '',
    hair_coverage: '',
    style_energy: '',
    makeup_grooming_level: '',
    focus_areas: [] as string[],
    wardrobe_intent: null as boolean | null,
  });
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < STEPS) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('user_profile').upsert({
        user_id: user.id,
        identity: formData.identity.toLowerCase().replace(' ', '_'),
        style_energy: formData.style_energy.toLowerCase(),
        hair_coverage: formData.hair_coverage.toLowerCase().split(' ')[0],
        baseline_preferences: {
          makeup_grooming_level: formData.makeup_grooming_level,
          focus_areas: formData.focus_areas,
          wardrobe_intent: formData.wardrobe_intent
        },
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      showSuccess('Your Glowé OS is initialized.');
      navigate('/');
    } catch (error: any) { 
      showError(error.message); 
    } finally {
      setLoading(false);
    }
  };

  const toggleFocusArea = (val: string) => {
    setFormData(prev => ({
      ...prev,
      focus_areas: prev.focus_areas.includes(val)
        ? prev.focus_areas.filter(i => i !== val)
        : [...prev.focus_areas, val]
    }));
  };

  const isWomanOrNB = formData.identity === 'Woman' || formData.identity === 'Non-binary';
  const isMan = formData.identity === 'Man';

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F9] p-8 max-w-md mx-auto relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#FCE4EC] rounded-full blur-[80px] opacity-30" />
      
      <div className="relative z-10 flex-1 flex flex-col">
        <header className="flex justify-between items-center mb-12">
          <div className="flex gap-1.5">
            {[...Array(STEPS)].map((_, i) => (
              <div key={i} className={cn(
                "h-1 w-8 rounded-full transition-all duration-700",
                i + 1 <= step ? "bg-[#D81B60]" : "bg-[#FCE4EC]"
              )} />
            ))}
          </div>
          <span className="text-[9px] font-bold text-[#BCAEAE] uppercase tracking-[0.3em]">Step {step}/{STEPS}</span>
        </header>

        <div className="flex-1 flex flex-col justify-center">
          {step === 1 && (
            <StepWrapper title="How do you identify?" subtitle="We tailor your presence to your unique self.">
              {['Woman', 'Man', 'Non-binary', 'Prefer not to say'].map(opt => (
                <OptionButton key={opt} label={opt} selected={formData.identity === opt} onClick={() => setFormData({...formData, identity: opt})} />
              ))}
            </StepWrapper>
          )}

          {step === 2 && (
            <StepWrapper title="Hair coverage?" subtitle="Inclusive framing for every preference.">
              {['Hair visible', 'Covered sometimes', 'Covered most', 'Prefer not to say'].map(opt => (
                <OptionButton key={opt} label={opt} selected={formData.hair_coverage === opt} onClick={() => setFormData({...formData, hair_coverage: opt})} />
              ))}
            </StepWrapper>
          )}

          {step === 3 && (
            <StepWrapper title="Style energy?" subtitle="What's your core aesthetic vibe?">
              {['Soft', 'Bold', 'Elegant', 'Natural', 'Trendy'].map(opt => (
                <OptionButton key={opt} label={opt} selected={formData.style_energy === opt} onClick={() => setFormData({...formData, style_energy: opt})} />
              ))}
            </StepWrapper>
          )}

          {step === 4 && (
            <StepWrapper 
              title={isWomanOrNB ? "Makeup comfort?" : isMan ? "Grooming level?" : "Presentation style?"} 
              subtitle="Your preferred level of daily enhancement."
            >
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-2">
                  {(isWomanOrNB ? ['Minimal', 'Medium', 'Full'] : isMan ? ['Minimal', 'Medium', 'High'] : ['Subtle', 'Balanced', 'Defined']).map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setFormData({...formData, makeup_grooming_level: opt})}
                      className={cn(
                        "py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                        formData.makeup_grooming_level === opt ? "bg-[#4A3F3F] text-white border-[#4A3F3F]" : "bg-white text-[#BCAEAE] border-[#FCE4EC]"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-[#BCAEAE] uppercase tracking-widest ml-2">Focus Areas</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(isWomanOrNB ? ['Skin glow', 'Eyes', 'Lips', 'Brows'] : isMan ? ['Hair', 'Beard', 'Skin', 'Accessories'] : ['Face', 'Posture', 'Details', 'Vibe']).map(opt => (
                      <button 
                        key={opt}
                        onClick={() => toggleFocusArea(opt)}
                        className={cn(
                          "p-4 rounded-2xl text-left text-xs font-bold transition-all border flex justify-between items-center",
                          formData.focus_areas.includes(opt) ? "bg-[#FCE4EC] border-[#D81B60] text-[#D81B60]" : "bg-white border-[#FCE4EC] text-[#4A3F3F]"
                        )}
                      >
                        {opt}
                        {formData.focus_areas.includes(opt) && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 5 && (
            <StepWrapper title="Wardrobe intent?" subtitle="Let Glowé see your style to guide you better.">
              <div className="space-y-6">
                <div className="p-8 rounded-[40px] bg-white border border-[#FCE4EC] shadow-sm space-y-4 text-center">
                  <div className="w-16 h-16 bg-[#FCE4EC] rounded-full flex items-center justify-center mx-auto text-[#D81B60]">
                    <Camera size={24} />
                  </div>
                  <p className="text-sm text-[#4A3F3F] leading-relaxed">
                    Glowé can analyze your wardrobe photos to provide personalized daily recommendations.
                  </p>
                </div>
                <div className="grid gap-3">
                  <OptionButton label="Yes, let's do it" selected={formData.wardrobe_intent === true} onClick={() => setFormData({...formData, wardrobe_intent: true})} />
                  <OptionButton label="Not now" selected={formData.wardrobe_intent === false} onClick={() => setFormData({...formData, wardrobe_intent: false})} />
                </div>
              </div>
            </StepWrapper>
          )}
        </div>

        <footer className="mt-12 flex gap-4">
          {step > 1 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)} className="h-16 w-16 rounded-full bg-[#FCE4EC] text-[#D81B60]">
              <ChevronLeft />
            </Button>
          )}
          <Button 
            onClick={handleNext} 
            disabled={!isStepValid(step, formData) || loading}
            className="flex-1 h-16 rounded-full bg-[#4A3F3F] text-white hover:bg-black text-lg font-bold shadow-xl transition-all active:scale-95"
          >
            {loading ? 'Initializing...' : step === STEPS ? 'Enter Glowé' : 'Continue'}
          </Button>
        </footer>
      </div>
    </div>
  );
};

const StepWrapper = ({ title, subtitle, children }: any) => (
  <div className="space-y-8 animate-fade-up">
    <div className="space-y-2">
      <h2 className="text-4xl font-serif text-[#4A3F3F] leading-tight">{title}</h2>
      <p className="text-[#BCAEAE] text-sm font-medium">{subtitle}</p>
    </div>
    <div className="grid gap-3">{children}</div>
  </div>
);

const OptionButton = ({ label, selected, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={cn(
      "p-6 rounded-[30px] text-left transition-all duration-500 border-2 flex justify-between items-center group",
      selected 
        ? "bg-white border-[#D81B60] text-[#D81B60] shadow-[0_10px_30px_rgba(216,27,96,0.1)]" 
        : "bg-white border-[#FCE4EC] text-[#4A3F3F] hover:border-[#D81B60]/30"
    )}
  >
    <span className="font-bold text-sm tracking-tight">{label}</span>
    <div className={cn(
      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
      selected ? "bg-[#D81B60] border-[#D81B60]" : "border-[#FCE4EC] group-hover:border-[#D81B60]/30"
    )}>
      {selected && <Check size={14} className="text-white" />}
    </div>
  </button>
);

const isStepValid = (step: number, data: any) => {
  if (step === 1) return !!data.identity;
  if (step === 2) return !!data.hair_coverage;
  if (step === 3) return !!data.style_energy;
  if (step === 4) return !!data.makeup_grooming_level && data.focus_areas.length > 0;
  if (step === 5) return data.wardrobe_intent !== null;
  return false;
};

export default Onboarding;