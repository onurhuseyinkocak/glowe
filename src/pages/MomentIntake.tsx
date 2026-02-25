import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, Sun, Moon, Cloud, MapPin, Clock, Zap, 
  Video, Camera, Heart, Sparkles, ShieldCheck 
} from 'lucide-react';
import { showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

const DATE_TYPES = ['First Date', 'Second Date', 'Long-term Partner', 'High-value Dinner'];
const ENERGY_MODES = [
  { id: 'Soft Romantic', icon: <Heart size={16} /> },
  { id: 'Clean Girl', icon: <Sparkles size={16} /> },
  { id: 'Elevated Minimalist', icon: <ShieldCheck size={16} /> },
  { id: 'Magnetic Bold', icon: <Zap size={16} /> }
];

const MomentIntake = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modifiers, setModifiers] = useState({
    location: 'Indoor',
    lighting: 'Bright',
    date_type: 'First Date',
    energy_mode: 'Soft Romantic'
  });

  const isDate = type?.includes('date');
  const isCreator = type?.includes('creator');

  const handleStartAnalysis = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Auth required');

      const { data, error } = await supabase.from('moments').insert({
        user_id: user.id,
        moment_type: type,
        context_modifiers: modifiers
      }).select().single();

      if (error) throw error;
      navigate(`/analysis/${data.id}`);
    } catch (error: any) {
      showError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBFA] p-8 pb-32 max-w-md mx-auto">
      <header className="flex items-center gap-4 mb-12">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-[#FCE4EC] rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-serif text-[#4A3F3F] capitalize">{type?.replace('-', ' ')}</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#BCAEAE]">Context Tuning</p>
        </div>
      </header>

      <div className="space-y-10 animate-fade-up">
        {isDate && (
          <>
            <section className="space-y-4">
              <Label text="Date Type" />
              <div className="grid grid-cols-2 gap-2">
                {DATE_TYPES.map(dt => (
                  <button
                    key={dt}
                    onClick={() => setModifiers({...modifiers, date_type: dt})}
                    className={cn(
                      "p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                      modifiers.date_type === dt ? "bg-[#4A3F3F] text-white border-[#4A3F3F]" : "bg-white text-[#BCAEAE] border-[#FCE4EC]"
                    )}
                  >
                    {dt}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <Label text="Energy Mode" />
              <div className="grid grid-cols-2 gap-3">
                {ENERGY_MODES.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setModifiers({...modifiers, energy_mode: mode.id})}
                    className={cn(
                      "flex flex-col items-center justify-center p-6 rounded-[32px] border-2 transition-all gap-3",
                      modifiers.energy_mode === mode.id ? "bg-[#FCE4EC] border-[#D81B60] text-[#D81B60] scale-105 shadow-lg" : "bg-white border-[#FCE4EC] text-[#BCAEAE]"
                    )}
                  >
                    {mode.icon}
                    <span className="text-[8px] font-bold uppercase tracking-widest text-center">{mode.id}</span>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        <section className="space-y-4">
          <Label text="Environment" />
          <div className="grid grid-cols-2 gap-3">
            <SelectionCard 
              active={modifiers.location === 'Indoor'} 
              onClick={() => setModifiers({...modifiers, location: 'Indoor'})}
              icon={<MapPin size={18} />} label="Indoor" 
            />
            <SelectionCard 
              active={modifiers.location === 'Outdoor'} 
              onClick={() => setModifiers({...modifiers, location: 'Outdoor'})}
              icon={<Cloud size={18} />} label="Outdoor" 
            />
          </div>
        </section>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
        <Button 
          onClick={handleStartAnalysis}
          disabled={loading}
          className="w-full h-16 rounded-full bg-[#4A3F3F] text-white text-lg font-bold shadow-2xl"
        >
          {loading ? 'Syncing OS...' : 'Generate Glow Plan'}
        </Button>
      </div>
    </div>
  );
};

const Label = ({ text }: { text: string }) => (
  <p className="text-[10px] font-bold text-[#BCAEAE] uppercase tracking-[0.2em] ml-2">{text}</p>
);

const SelectionCard = ({ active, icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center p-6 rounded-[32px] border-2 transition-all duration-300 gap-3",
      active ? 'bg-[#FCE4EC] border-[#D81B60] text-[#D81B60] shadow-lg scale-105' : 'bg-white border-[#FCE4EC] text-[#BCAEAE]'
    )}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

export default MomentIntake;