import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Search, Star, MapPin, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Barbers = () => {
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    const { data } = await supabase
      .from('barbers')
      .select('*')
      .order('rating', { ascending: false });
    
    setBarbers(data || []);
    setLoading(false);
  };

  const filteredBarbers = barbers.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Barbers</h1>
        <p className="text-gray-500">Top rated near you</p>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Search by name or city..." 
          className="pl-12 h-12 rounded-xl bg-gray-50 border-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredBarbers.map((barber) => (
          <button
            key={barber.id}
            onClick={() => navigate(`/barbers/${barber.id}`)}
            className="w-full p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col gap-4 hover:border-black transition-colors text-left"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-bold text-lg">{barber.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin size={14} />
                  {barber.city} • 2.4 miles
                </div>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold">
                <Star size={12} fill="currentColor" />
                {barber.rating}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {barber.specialties?.map((s: string) => (
                <span key={s} className="px-3 py-1 rounded-full bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {s}
                </span>
              ))}
              <span className="px-3 py-1 rounded-full bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                {barber.price_range}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Barbers;