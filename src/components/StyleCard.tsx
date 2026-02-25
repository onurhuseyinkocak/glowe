import React from 'react';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface StyleCardProps {
  score: number;
  moment: string;
  direction: string;
}

const StyleCard = ({ score, moment, direction }: StyleCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#4A3F3F] to-[#2D2424] p-8 text-white shadow-2xl">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#E8D5D8]/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-rose-500/10 blur-3xl" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">
            <Sparkles size={14} className="text-[#E8D5D8]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Glowé Verified</span>
          </div>
          <ShieldCheck size={24} className="text-[#E8D5D8]" />
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Current Presence</p>
          <h2 className="text-3xl font-serif italic">{moment}</h2>
        </div>

        <div className="flex items-end justify-between">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Direction</p>
              <p className="text-sm font-medium leading-relaxed text-white/90 max-w-[180px]">{direction}</p>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold">Optimized for Impact</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Score</p>
            <p className="text-6xl font-serif text-[#E8D5D8]">{score}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleCard;