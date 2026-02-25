import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Sun, Moon, Cloud, MapPin, Clock, Zap, Video, Camera } from 'lucide-react';
import { showError } from '@/utils/toast';

const MomentIntake = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modifiers, setModifiers] = useState({
    location: 'Indoor',
    lighting: 'Bright',
    duration: '1-3h',
    priority: 'Impact',
    framing: 'Head & Shoulders'
  });

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
        <button onClick={() => navigate('/')} className="p-2 hover:bg-[#F5F0E1] rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-serif text-[#4A3F3F] capitalize">{type?.replace('_', ' ')}</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#8C7E7E]">Context Tuning</p>
        </div>
      </header>

      <div className="space-y-10 animate-fade-up">
        {/* Location & Lighting */}
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

        <section className="space-y-4">
          <Label text="Lighting Condition" />
          <div className="grid grid-cols-3 gap-3">
            <SelectionCard 
              active={modifiers.lighting === 'Bright'} 
              onClick={() => setModifiers({...modifiers, lighting: 'Bright'})}
              icon={<Sun size={18} />} label="Bright" 
            />
            <SelectionCard 
              active={modifiers.lighting === 'Mixed'} 
              onClick={() => setModifiers({...modifiers, lighting: 'Mixed'})}
              icon={<Zap size={18} />} label="Mixed" 
            />
            <SelectionCard 
              active={modifiers.lighting === 'Low'} 
              onClick={() => setModifiers({...modifiers, lighting: 'Low'})}
              icon={<Moon size={18} />} label="Low Light" 
            />
          </div>
        </section>

        {isCreator && (
          <section className="space-y-4">
            <Label text="Camera Framing" />
            <div className="grid grid-cols-2 gap-3">
              <SelectionCard 
                active={modifiers.framing === 'Head & Shoulders'} 
                onClick={() => setModifiers({...modifiers, framing: 'Head & Shoulders'})}
                icon={<User size={18} />} label="Portrait" 
              />
              <SelectionCard 
                active={modifiers.framing === 'Chest Up'} 
                onClick={() => setModifiers({...modifiers, framing: 'Chest Up'})}
                icon={<Video size={18} />} label="Medium" 
              />
            </div>
          </section>
        )}

        <section className="space-y-4">
          <Label text="Moment Priority" />
          <div className="p-6 rounded-[32px] bg-white border border-[#F5F0E1] space-y-6">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#8C7E7E]">
              <span>Comfort</span>
              <span>Impact</span>
            </div>
            <input 
              type="range" 
              className="w-full accent-[#E8D5D8]" 
              onChange={(e) => setModifiers({...modifiers, priority: parseInt(e.target.value) > 50 ? 'Impact' : 'Comfort'})}
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
  <p className="text-[10px] font-bold text-[#8C7E7E] uppercase tracking-[0.2em] ml-2">{text}</p>
);

const SelectionCard = ({ active, icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-6 rounded-[32px] border-2 transition-all duration-300 gap-3 ${
      active ? 'bg-[#E8D5D8] border-[#E8D5D8] text-[#4A3F3F] shadow-lg scale-105' : 'bg-white border-[#F5F0E1] text-[#8C7E7E]'
    }`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

const User = ({ size }: { size: number }) => <Video size={size} />; // Placeholder for User icon

export default MomentIntake;