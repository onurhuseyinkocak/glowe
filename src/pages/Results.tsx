import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Share2, Download, Copy, ChevronLeft, Scissors, QrCode } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import confetti from 'canvas-confetti';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    const { data, error } = await supabase
      .from('analyses')
      .select('*, users_profile(*)')
      .eq('id', id)
      .single();

    if (error) {
      showError('Could not find analysis');
      navigate('/');
      return;
    }

    setAnalysis(data);
    setLoading(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#000000', '#ffffff', '#888888']
    });
  };

  const copyInstructions = () => {
    navigator.clipboard.writeText(analysis.barber_instructions);
    showSuccess('Instructions copied to clipboard!');
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="p-4 flex items-center gap-4 bg-white border-b">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">Your Style Card</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* The Style Card */}
        <div id="style-card" className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 flex flex-col aspect-[3/4] relative">
          <div className="p-8 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-black font-black text-xl tracking-tighter">
                  <Scissors size={20} />
                  CUTMATCH
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Style Analysis v1.0</p>
              </div>
              <div className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {analysis.face_shape} Shape
              </div>
            </div>

            <div className="space-y-6 flex-1">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recommended Cut</p>
                <h2 className="text-4xl font-black tracking-tight leading-none">{analysis.best_cut}</h2>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Why it works</p>
                <p className="text-sm text-gray-600 leading-relaxed">{analysis.why_it_works}</p>
              </div>

              <div className="space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Barber Instructions</p>
                <p className="text-sm font-medium leading-relaxed italic">"{analysis.barber_instructions}"</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Generated for</p>
                <p className="font-bold">{analysis.users_profile?.first_name || 'User'}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                  <QrCode size={32} className="text-gray-300" />
                </div>
                <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">cutmatch.app</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black py-3 px-8 flex justify-between items-center">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Official Style Card</span>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest"># {analysis.id.slice(0,8)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => window.print()} className="h-14 rounded-2xl bg-black text-white hover:bg-gray-900 font-bold">
            <Share2 className="mr-2" size={18} />
            Share Card
          </Button>
          <Button variant="outline" onClick={copyInstructions} className="h-14 rounded-2xl border-2 font-bold">
            <Copy className="mr-2" size={18} />
            Copy Info
          </Button>
        </div>

        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Scissors size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-blue-900">Ready to get this cut?</p>
            <button onClick={() => navigate('/barbers')} className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center">
              Find a barber near you <ChevronLeft className="rotate-180 ml-1" size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;