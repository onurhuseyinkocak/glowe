import React from 'react';

const Wardrobe = () => {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-serif text-[#4A3F3F]">My Wardrobe</h1>
      <p className="text-[#8C7E7E]">Your digital closet is being prepared...</p>
      <div className="aspect-square rounded-[40px] bg-[#F5F0E1] flex items-center justify-center border-2 border-dashed border-[#E8D5D8]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7E7E]">Coming Soon</span>
      </div>
    </div>
  );
};

export default Wardrobe;