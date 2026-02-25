import React from 'react';

const Outfits = () => {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-serif text-[#4A3F3F]">My Outfits</h1>
      <p className="text-[#8C7E7E]">Your saved combinations will appear here.</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="aspect-[3/4] rounded-[32px] bg-[#F5F0E1]" />
        <div className="aspect-[3/4] rounded-[32px] bg-[#F5F0E1]" />
      </div>
    </div>
  );
};

export default Outfits;