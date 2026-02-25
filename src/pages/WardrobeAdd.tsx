import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Sparkles, ChevronLeft, Loader2, Check, X, Trash2 } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { analyzeWardrobeImage, WardrobeTags } from '@/lib/gemini';

interface DraftItem {
  id: string;
  file: File;
  preview: string;
  tags: WardrobeTags | null;
  status: 'pending' | 'analyzing' | 'ready' | 'error';
}

const WardrobeAdd = () => {
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newDrafts: DraftItem[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      tags: null,
      status: 'pending'
    }));

    setDrafts(prev => [...prev, ...newDrafts]);
    processDrafts(newDrafts);
  };

  const processDrafts = async (items: DraftItem[]) => {
    for (const item of items) {
      setDrafts(prev => prev.map(d => d.id === item.id ? { ...d, status: 'analyzing' } : d));
      
      try {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(item.file);
        });

        const tags = await analyzeWardrobeImage(base64);
        setDrafts(prev => prev.map(d => d.id === item.id ? { ...d, tags, status: 'ready' } : d));
      } catch (error) {
        setDrafts(prev => prev.map(d => d.id === item.id ? { ...d, status: 'error' } : d));
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Auth required");

      for (const draft of drafts) {
        if (draft.status !== 'ready' || !draft.tags) continue;

        const fileExt = draft.file.name.split('.').pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('wardrobe')
          .upload(fileName, draft.file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase.from('wardrobe_items').insert({
          user_id: user.id,
          category: draft.tags.category,
          color_tags: draft.tags.color_tags,
          style_tags: draft.tags.style_tags,
          season_tags: draft.tags.season_tags,
          notes: draft.tags.notes,
          image_path: fileName
        });

        if (dbError) throw dbError;
      }

      showSuccess('Wardrobe updated!');
      navigate('/wardrobe');
    } catch (error: any) {
      showError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const currentDraft = drafts[currentIndex];

  return (
    <div className="min-h-screen bg-[#FFF9F9] pb-32">
      <header className="p-6 flex items-center gap-4 bg-white border-b border-[#FCE4EC]">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#FCE4EC] rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-serif text-xl text-[#4A3F3F]">Add to Closet</h1>
      </header>

      <div className="p-8 space-y-8">
        {drafts.length === 0 ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[3/4] rounded-[40px] border-2 border-dashed border-[#FCE4EC] bg-white flex flex-col items-center justify-center text-center p-10 space-y-4 cursor-pointer hover:bg-[#FCE4EC]/10 transition-colors"
          >
            <div className="w-20 h-20 bg-[#FCE4EC] rounded-full flex items-center justify-center text-[#D81B60]">
              <Camera size={32} />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-[#4A3F3F]">Upload Photos</p>
              <p className="text-xs text-[#BCAEAE]">Single or bulk upload supported</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden bg-white border border-[#FCE4EC] shadow-xl">
              <img src={currentDraft.preview} className="w-full h-full object-cover" alt="Preview" />
              
              {currentDraft.status === 'analyzing' && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="animate-spin text-[#D81B60]" size={48} />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#4A3F3F]">Gemini is analyzing...</p>
                </div>
              )}

              <button 
                onClick={() => {
                  const newDrafts = drafts.filter((_, i) => i !== currentIndex);
                  setDrafts(newDrafts);
                  if (currentIndex >= newDrafts.length) setCurrentIndex(Math.max(0, newDrafts.length - 1));
                }}
                className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 shadow-lg"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {currentDraft.status === 'ready' && currentDraft.tags && (
              <div className="space-y-6 animate-fade-up">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-[#BCAEAE] uppercase tracking-widest ml-2">AI Suggested Tags</p>
                  <div className="p-6 rounded-[32px] bg-white border border-[#FCE4EC] space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Tag label={currentDraft.tags.category} type="category" />
                      {currentDraft.tags.color_tags.map(t => <Tag key={t} label={t} />)}
                      {currentDraft.tags.style_tags.map(t => <Tag key={t} label={t} />)}
                    </div>
                    <p className="text-xs text-[#8C7E7E] italic">"{currentDraft.tags.notes}"</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-1">
                {drafts.map((_, i) => (
                  <div key={i} className={cn("h-1.5 rounded-full transition-all", i === currentIndex ? "w-6 bg-[#D81B60]" : "w-1.5 bg-[#FCE4EC]")} />
                ))}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(prev => prev - 1)}
                  className="rounded-full"
                >
                  Prev
                </Button>
                <Button 
                  variant="outline" 
                  disabled={currentIndex === drafts.length - 1}
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="rounded-full"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          multiple 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      {drafts.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
          <Button 
            onClick={handleSave}
            disabled={saving || drafts.some(d => d.status === 'analyzing')}
            className="w-full h-16 rounded-full bg-[#4A3F3F] text-white text-lg font-bold shadow-2xl"
          >
            {saving ? 'Saving to Closet...' : `Save ${drafts.length} Items`}
          </Button>
        </div>
      )}
    </div>
  );
};

const Tag = ({ label, type }: { label: string, type?: string }) => (
  <span className={cn(
    "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest",
    type === 'category' ? "bg-[#4A3F3F] text-white" : "bg-[#FCE4EC] text-[#D81B60]"
  )}>
    {label}
  </span>
);

export default WardrobeAdd;