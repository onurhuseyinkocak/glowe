import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import { Sparkles } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        showSuccess('Welcome to Glowé. Please check your email.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      }
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#FFFBFA]">
      <div className="w-full max-w-sm space-y-12 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-serif tracking-tight text-[#4A3F3F]">Glowé</h1>
          <p className="text-[#8C7E7E] font-medium tracking-wide uppercase text-[10px]">Your Glow. For Every Moment.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6 text-left">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] uppercase tracking-widest text-[#8C7E7E] ml-1">Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-3xl border-[#E8D5D8] bg-white/50 focus:ring-[#E8D5D8]"
                placeholder="hello@glowe.app"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] uppercase tracking-widest text-[#8C7E7E] ml-1">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-3xl border-[#E8D5D8] bg-white/50 focus:ring-[#E8D5D8]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-14 rounded-3xl bg-[#E8D5D8] text-[#4A3F3F] hover:bg-[#D8C5C8] font-bold text-lg shadow-sm" disabled={loading}>
            {loading ? 'Refining...' : isSignUp ? 'Begin Journey' : 'Enter Glowé'}
          </Button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs text-[#8C7E7E] hover:text-[#4A3F3F] transition-colors tracking-wide"
        >
          {isSignUp ? 'Already a member? Sign in' : "New to Glowé? Create an account"}
        </button>
      </div>
    </div>
  );
};

export default Auth;