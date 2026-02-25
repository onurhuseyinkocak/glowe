import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Plus, Search, Filter, Shirt, ShoppingBag, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

const Wardrobe = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [profileRes, itemsRes] = await Promise.all([
      supabase.from('user_profile').select('*').eq('user_id', user.id).single(),
      supabase.from('wardrobe_items').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    ]);

    setProfile(profileRes.data);
    setItems(itemsRes.data || []);
    setLoading(false);
  };

  const categories = [
    { id: 'all', label: 'All', icon: <LayoutGrid size={16} /> },
    { id: 'top', label: 'Tops', icon: <Shirt size={16} /> },
    { id: 'bottom', label: 'Bottoms', icon: <Shirt size={16} className="rotate-180" /> },
    { id: 'outerwear', label: 'Outer', icon: <ShoppingBag size={16} /> },
    { id: 'shoes', label: 'Shoes', icon: <ShoppingBag size={16} /> },
  ];

  if (profile?.hair_coverage !== 'visible') {
    categories.push({ id: 'headwear', label: 'Headwear', icon: <Shirt size={16} /> });
  }

  const filteredItems = category === 'all' ? items : items.filter(i => i.category === category);

  return (
    <div className="p-8 space-y-8 pb-32">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-[#4A3F3F]">Wardrobe</h1>
          <p className="text-[#BCAEAE] text-sm font-medium">{items.length} items in your closet</p>
        </div>
        <button 
          onClick={() => navigate('/wardrobe/add')}
          className="w-14 h-14 rounded-full bg-[#4A3F3F] text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border",
              category === cat.id 
                ? "bg-[#4A3F3F] text-white border-[#4A3F3F] shadow-lg" 
                : "bg-white text-[#BCAEAE] border-[#FCE4EC]"
            )}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="aspect-[3/4] rounded-[32px] bg-[#FCE4EC]/30 animate-pulse" />)}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-[#FCE4EC] rounded-full flex items-center justify-center mx-auto text-[#D81B60]">
            <Shirt size={32} />
          </div>
          <p className="text-[#BCAEAE] font-medium">Your closet is empty.</p>
          <Button onClick={() => navigate('/wardrobe/add')} variant="outline" className="rounded-full border-[#FCE4EC]">Add First Item</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="group relative aspect-[3/4] rounded-[32px] overflow-hidden bg-white border border-[#FCE4EC] shadow-sm">
              <img 
                src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/wardrobe/${item.image_path}`} 
                className="w-full h-full object-cover" 
                alt={item.category} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-[10px] font-bold uppercase tracking-widest">{item.category}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.color_tags?.slice(0, 2).map((t: string) => (
                    <span key={t} className="text-[8px] text-white/80 bg-white/20 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wardrobe;