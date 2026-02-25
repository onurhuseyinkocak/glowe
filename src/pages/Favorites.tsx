import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Heart, Trash2, ChevronLeft, Scissors } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

const Favorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const { data } = await supabase
      .from('favorite_styles')
      .select('*')
      .order('created_at', { ascending: false });
    
    setFavorites(data || []);
    setLoading(false);
  };

  const removeFavorite = async (id: string) => {
    const { error } = await supabase.from('favorite_styles').delete().eq('id', id);
    if (error) showError('Silinemedi');
    else {
      setFavorites(favorites.filter(f => f.id !== id));
      showSuccess('Favorilerden çıkarıldı');
    }
  };

  if (loading) return null;

  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Favorilerim</h1>
          <p className="text-gray-500">AI ile tasarladığın görünümler</p>
        </div>
      </header>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-200">
            <Heart size={40} />
          </div>
          <p className="text-gray-500">Henüz favori bir tarzın yok.</p>
          <Button onClick={() => navigate('/try-on')} variant="outline">Hemen Dene</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {favorites.map((item) => (
            <div key={item.id} className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 border border-gray-100">
              <img src={item.image_url} className="w-full h-full object-cover" alt={item.style_name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                <p className="text-white font-bold text-sm">{item.style_name}</p>
                <p className="text-white/60 text-[10px] truncate">{item.prompt || 'Preset Style'}</p>
              </div>
              <button 
                onClick={() => removeFavorite(item.id)}
                className="absolute top-2 right-2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
              <button 
                onClick={() => navigate('/barbers')}
                className="absolute top-2 left-2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white"
              >
                <Scissors size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;