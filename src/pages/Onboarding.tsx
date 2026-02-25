import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { showError } from '@/utils/toast';

const STEPS = 4;

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    identity: '',
    hair_coverage: '',
    target_event: '',
    style_energy: ''
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
      const { error } = await supabase.from('users_profile').upsert({
        user_id: user.id,
        ...formData
      });
      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      showError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBFA] p-8 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div className="flex gap-2">
          {[...Array(STEPS)].map((_, i) => (
            <div key={i} className={`h-1 w-8 rounded-full transition-all duration-500 ${i + 1 <= step ? 'bg-[#E8D5D8]' : 'bg-[#F5F0E1]'}`} />
          ))}
        </div>
        <span className="text-[10px] font-bold text-[#8C7E7E] uppercase tracking-widest">Step {step} of {STEPS}</span>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-10">
        {step === 1 && (
          <div className="space-y-8 animate-fade-up">
            <div className="space-y-2">
              <h2 className="text-4xl font-serif text-[#4A3F3F]">How do you identify?</h2>
              <p className="text-[#8C7E7E]">We tailor your glow-up to your unique self.</p>
            </div>
            <div className="grid gap-3">
              {['Woman', 'Man', 'Non-binary', 'Prefer not to say'].map((opt) => (
                <OptionButton 
                  key={opt} 
                  label={opt} 
                  selected={formData.identity === opt} 
                  onClick={() => setFormData({...formData, identity: opt})} 
                />
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-up">
            <div className="space-y-2">
              <h2 className="text-4xl font-serif text-[#4A3F3F]">What moment are you preparing for?</h2>
              <p className="text-[#8C7E7E]">Every occasion has its own light.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['First Date', 'Job Interview', 'Wedding', 'Girls Night', 'Power Meeting', 'Glow-Up Reset'].map((opt) => (
                <OptionButton 
                  key={opt} 
                  label={opt} 
                  selected={formData.target_event === opt} 
                  onClick={() => setFormData({...formData, target_event: opt})} 
                />
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade-up">
            <div className="space-y-2">
              <h2 className="text-4xl font-serif text-[#4A3F3F]">Define your style energy.</h2>
              <p className="text-[#8C7E7E]">How do you want to feel?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Soft', 'Bold', 'Elegant', 'Natural', 'Trendy'].map((opt) => (
                <OptionButton 
                  key={opt} 
                  label={opt} 
                  selected={formData.style_energy === opt} 
                  onClick={() => setFormData({...formData, style_energy: opt})} 
                />
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-fade-up">
            <div className="space-y-2">
              <h2 className="text-4xl font-serif text-[#4A3F3F]">How do you usually style your hair?</h2>
              <p className="text-[#8C7E7E]">This helps us refine your framing and harmony.</p>
            </div>
            <div className="grid gap-3">
              {[
                { label: 'Hair visible', value: 'visible' },
                { label: 'Covered sometimes', value: 'partial' },
                { label: 'Covered most of the time', value: 'covered' },
                { label: 'Prefer not to say', value: 'unspecified' }
              ].map((opt) => (
                <OptionButton 
                  key={opt.value} 
                  label={opt.label} 
                  selected={formData.hair_coverage === opt.value} 
                  onClick={() => setFormData({...formData, hair_coverage: opt.value})} 
                />
              ))}
            </div>
          </div>
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
          disabled={
            (step === 1 && !formData.identity) || 
            (step === 2 && !formData.target_event) || 
            (step === 3 && !formData.style_energy) || 
            (step === 4 && !formData.hair_coverage)
          }
          className="flex-1 h-16 rounded-full bg-[#E8D5D8] text-[#4A3F3F] hover:bg-[#D8C5C8] text-lg font-bold shadow-lg"
        >
          {step === STEPS ? 'Reveal My Glow' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

const OptionButton = ({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`p-6 rounded-[32px] text-left transition-all duration-300 border-2 ${
      selected ? 'bg-[#E8D5D8] border-[#E8D5D8] text-[#4A3F3F] shadow-md' : 'bg-white border-[#F5F0E1] text-[#8C7E7E]'
    }`}
  >
    <span className="font-bold tracking-tight">{label}</span>
  </button>
);

export default Onboarding;