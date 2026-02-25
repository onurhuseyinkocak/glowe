import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { showError } from '@/utils/toast';

const STEPS = 6;

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    identity: '',
    presentation_goal: '',
    hair_coverage: '',
    lifestyle_contexts: [] as string[],
    beauty_comfort: '',
    wardrobe_preference: '',
    core_priority: ''
  });
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < STEPS) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('user_baseline').upsert({
        user_id: user.id,
        ...formData
      });
      if (error) throw error;
      navigate('/');
    } catch (error: any) { showError(error.message); }
  };

  const toggleLifestyle = (val: string) => {
    setFormData(prev => ({
      ...prev,
      lifestyle_contexts: prev.lifestyle_contexts.includes(val)
        ? prev.lifestyle_contexts.filter(i => i !== val)
        : [...prev.lifestyle_contexts, val]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBFA] p-8 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div className="flex gap-1.5">
          {[...Array(STEPS)].map((_, i) => (
            <div key={i} className={`h-1 w-6 rounded-full transition-all duration-500 ${i + 1 <= step ? 'bg-[#E8D5D8]' : 'bg-[#F5F0E1]'}`} />
          ))}
        </div>
        <span className="text-[9px] font-bold text-[#8C7E7E] uppercase tracking-widest">Baseline {step}/{STEPS}</span>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-10">
        {step === 1 && (
          <StepWrapper title="How do you identify?" subtitle="We tailor your presence to your unique self.">
            {['Woman', 'Man', 'Non-binary', 'Prefer not to say'].map(opt => (
              <OptionButton key={opt} label={opt} selected={formData.identity === opt} onClick={() => setFormData({...formData, identity: opt})} />
            ))}
          </StepWrapper>
        )}

        {step === 2 && (
          <StepWrapper title="Presentation goal?" subtitle="How do you want the world to see you?">
            {['Softer', 'Sharper', 'Balanced', 'Trendy', 'Elegant'].map(opt => (
              <OptionButton key={opt} label={opt} selected={formData.presentation_goal === opt} onClick={() => setFormData({...formData, presentation_goal: opt})} />
            ))}
          </StepWrapper>
        )}

        {step === 3 && (
          <StepWrapper title="Hair styling?" subtitle="Inclusive framing for every preference.">
            {[
              { l: 'Hair visible', v: 'visible' },
              { l: 'Covered sometimes', v: 'partial' },
              { l: 'Covered most of the time', v: 'covered' },
              { l: 'Prefer not to say', v: 'unspecified' }
            ].map(opt => (
              <OptionButton key={opt.v} label={opt.l} selected={formData.hair_coverage === opt.v} onClick={() => setFormData({...formData, hair_coverage: opt.v})} />
            ))}
          </StepWrapper>
        )}

        {step === 4 && (
          <StepWrapper title="Lifestyle contexts?" subtitle="Select all that apply to your routine.">
            <div className="grid grid-cols-2 gap-3">
              {['Work', 'Social', 'Dating', 'Events', 'Creator', 'Fitness'].map(opt => (
                <OptionButton key={opt} label={opt} selected={formData.lifestyle_contexts.includes(opt)} onClick={() => toggleLifestyle(opt)} />
              ))}
            </div>
          </StepWrapper>
        )}

        {step === 5 && (
          <StepWrapper title="Beauty comfort?" subtitle="Your preferred level of enhancement.">
            {['Minimal', 'Medium', 'Full Glam'].map(opt => (
              <OptionButton key={opt} label={opt} selected={formData.beauty_comfort === opt} onClick={() => setFormData({...formData, beauty_comfort: opt})} />
            ))}
          </StepWrapper>
        )}

        {step === 6 && (
          <StepWrapper title="What matters most?" subtitle="Your core presence priority.">
            {['Confidence', 'Attractiveness', 'Professionalism', 'Calm Presence'].map(opt => (
              <OptionButton key={opt} label={opt} selected={formData.core_priority === opt} onClick={() => setFormData({...formData, core_priority: opt})} />
            ))}
          </StepWrapper>
        )}
      </div>

      <div className="flex gap-4 mt-12">
        {step > 1 && (
          <Button variant="ghost" onClick={() => setStep(step - 1)} className="h-16 w-16 rounded-full bg-[#F5F0E1] text-[#4A3F3F]">
            <ChevronLeft />
          </Button>
        )}
        <Button 
          onClick={handleNext} 
          disabled={!isStepValid(step, formData)}
          className="flex-1 h-16 rounded-full bg-[#E8D5D8] text-[#4A3F3F] hover:bg-[#D8C5C8] text-lg font-bold shadow-lg"
        >
          {step === STEPS ? 'Initialize OS' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

const StepWrapper = ({ title, subtitle, children }: any) => (
  <div className="space-y-8 animate-fade-up">
    <div className="space-y-2">
      <h2 className="text-3xl font-serif text-[#4A3F3F] leading-tight">{title}</h2>
      <p className="text-[#8C7E7E] text-sm">{subtitle}</p>
    </div>
    <div className="grid gap-3">{children}</div>
  </div>
);

const OptionButton = ({ label, selected, onClick }: any) => (
  <button onClick={onClick} className={`p-5 rounded-[28px] text-left transition-all duration-300 border-2 ${selected ? 'bg-[#E8D5D8] border-[#E8D5D8] text-[#4A3F3F] shadow-md' : 'bg-white border-[#F5F0E1] text-[#8C7E7E]'}`}>
    <span className="font-bold text-sm tracking-tight">{label}</span>
  </button>
);

const isStepValid = (step: number, data: any) => {
  if (step === 1) return !!data.identity;
  if (step === 2) return !!data.presentation_goal;
  if (step === 3) return !!data.hair_coverage;
  if (step === 4) return data.lifestyle_contexts.length > 0;
  if (step === 5) return !!data.beauty_comfort;
  if (step === 6) return !!data.core_priority;
  return false;
};

export default Onboarding;