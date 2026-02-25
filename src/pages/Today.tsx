import React from 'react';

const Today = () => {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-serif text-[#4A3F3F]">Today's Look</h1>
      <p className="text-[#8C7E7E]">AI is curating your presence for today...</p>
      <div className="h-64 rounded-[40px] bg-gradient-to-br from-[#FCE4EC] to-[#F3E5F5] animate-pulse" />
    </div>
  );
};

export default Today;