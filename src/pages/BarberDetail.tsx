import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Star, MapPin, Phone, Instagram, Scissors, ExternalLink } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const BarberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [barber, setBarber] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBarber();
  }, [id]);

  const fetchBarber = async () => {
    const { data } = await supabase
      .from('barbers')
      .select('*')
      .eq('id', id)
      .single();
    
    setBarber(data);
    setLoading(false);
  };

  if (loading || !barber) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-64 bg-black">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center z-10"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Scissors size={120} className="text-white" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent text-white">
          <h1 className="text-3xl font-bold tracking-tight">{barber.name}</h1>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin size={14} />
            {barber.city}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50">
          <div className="text-center flex-1 border-r">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating</p>
            <p className="font-bold flex items-center justify-center gap-1">
              <Star size={14} className="text-yellow-500" fill="currentColor" />
              {barber.rating}
            </p>
          </div>
          <div className="text-center flex-1 border-r">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</p>
            <p className="font-bold">{barber.price_range}</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Distance</p>
            <p className="font-bold">2.4 mi</p>
          </div>
        </div>

        <section className="space-y-4">
          <h3 className="font-bold text-lg">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {barber.specialties?.map((s: string) => (
              <span key={s} className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider">
                {s}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold text-lg">Contact</h3>
          <div className="grid grid-cols-2 gap-4">
            <a 
              href={`tel:${barber.phone}`}
              className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-bold text-sm"
            >
              <Phone size={18} />
              Call
            </a>
            <a 
              href={barber.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-bold text-sm"
            >
              <Instagram size={18} />
              Instagram
            </a>
          </div>
        </section>

        <div className="pt-4">
          <Button 
            onClick={() => navigate('/history')}
            className="w-full h-16 rounded-2xl bg-black text-white hover:bg-gray-900 text-lg font-bold shadow-xl"
          >
            <Scissors className="mr-2" />
            Show My Style Card
          </Button>
          <p className="text-center text-xs text-gray-500 mt-3">
            Show your latest analysis to the barber for the best results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BarberDetail;