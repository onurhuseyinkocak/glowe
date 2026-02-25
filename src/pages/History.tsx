import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ChevronRight, Calendar, Scissors } from 'lucide-react';
import { format } from 'date-fns';

const History = () => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setAnalyses(data || []);
    setLoading(false);
  };

  if (loading) return null;

  return (
    <div className="p-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="text-gray-500">Your style evolution</p>
      </header>

      {analyses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300">
            <Scissors size={40} />
          </div>
          <div className="space-y-1">
            <p className="font-bold">No history yet</p>
            <p className="text-sm text-gray-500">Your style cards will appear here.</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-sm font-bold text-black underline underline-offset-4"
          >
            Start your first analysis
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {analyses.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/results/${item.id}`)}
              className="w-full p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center gap-4 hover:border-black transition-colors text-left"
            >
              <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                {item.selfie_public_url ? (
                  <img src={item.selfie_public_url} alt="Selfie" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Scissors size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate">{item.best_cut || 'Processing...'}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={12} />
                  {format(new Date(item.created_at), 'MMM d, yyyy')}
                </div>
              </div>
              <ChevronRight className="text-gray-300" size={20} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;