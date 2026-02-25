import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { showError } from '@/utils/toast';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = 4;

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: '',
    gender: 'male',
    age_range: '25-34',
    hair_texture: 'straight',
    hair_density: 'medium',
    hairline: 'normal',
    style_vibe: 'clean',
    maintenance: 'medium'
  });
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < STEPS) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
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
    <div className="min-h-screen flex flex-col bg-white max-w-md mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-1">
          {[...Array(STEPS)].map((_, i) => (
            <div
              key={i}
              className={`h-1 w-8 rounded-full transition-colors ${
                i + 1 <= step ? 'bg-black' : 'bg-gray-100'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Step {step} of {STEPS}
        </span>
      </div>

      <div className="flex-1 space-y-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-bold tracking-tight">The Basics</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  placeholder="How should we call you?"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(v) => setFormData({ ...formData, gender: v })}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-xl p-4">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-xl p-4">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-bold tracking-tight">Hair Profile</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Texture</Label>
                <select
                  className="w-full h-12 rounded-xl border px-4 bg-white"
                  value={formData.hair_texture}
                  onChange={(e) => setFormData({ ...formData, hair_texture: e.target.value })}
                >
                  <option value="straight">Straight</option>
                  <option value="wavy">Wavy</option>
                  <option value="curly">Curly</option>
                  <option value="coily">Coily</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Density</Label>
                <select
                  className="w-full h-12 rounded-xl border px-4 bg-white"
                  value={formData.hair_density}
                  onChange={(e) => setFormData({ ...formData, hair_density: e.target.value })}
                >
                  <option value="thin">Thin</option>
                  <option value="medium">Medium</option>
                  <option value="thick">Thick</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-bold tracking-tight">Preferences</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Style Vibe</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['clean', 'trendy', 'bold', 'corporate'].map((v) => (
                    <button
                      key={v}
                      onClick={() => setFormData({ ...formData, style_vibe: v })}
                      className={`p-4 rounded-xl border text-sm font-medium capitalize transition-all ${
                        formData.style_vibe === v ? 'bg-black text-white border-black' : 'bg-white text-gray-600'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-bold tracking-tight">Ready to go?</h2>
            <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Name</span>
                <span className="font-bold">{formData.first_name || 'Not set'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Texture</span>
                <span className="font-bold capitalize">{formData.hair_texture}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Vibe</span>
                <span className="font-bold capitalize">{formData.style_vibe}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center">
              You can always update these in your settings.
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-8">
        {step > 1 && (
          <Button variant="outline" onClick={handleBack} className="h-14 w-14 rounded-2xl p-0">
            <ChevronLeft />
          </Button>
        )}
        <Button onClick={handleNext} className="flex-1 h-14 rounded-2xl bg-black text-white hover:bg-gray-900 text-lg font-bold">
          {step === STEPS ? 'Start Analysis' : 'Continue'}
          {step < STEPS && <ChevronRight className="ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;