import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getURL } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import { Chrome, Mail } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSocialLogin = async (provider: 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getURL(),
      },
    });
    if (error) showError(error.message);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
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
      <div className="w-full max-w-sm space-y-10 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl font-serif tracking-tight text-[#4A3F3F]">Glowé</h1>
          <p className="text-[#8C7E7E] font-medium tracking-[0.2em] uppercase text-[10px]">Your Glow. For Every Moment.</p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={() => handleSocialLogin('google')}
            variant="outline" 
            className="w-full h-14 rounded-full border-[#F5F0E1] bg-white text-[#4A3F3F] font-bold gap-3 shadow-sm hover:bg-gray-50"
          >
            <Chrome size={20} />
            Continue with Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#F5F0E1]"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#FFFBFA] px-4 text-[#8C7E7E]">Or with email</span></div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest text-[#8C7E7E] ml-4">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-full border-[#F5F0E1] bg-white/50 focus:ring-[#E8D5D8] px-6"
                placeholder="hello@glowe.app"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest text-[#8C7E7E] ml-4">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-full border-[#F5F0E1] bg-white/50 focus:ring-[#E8D5D8] px-6"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-14 rounded-full bg-[#4A3F3F] text-white hover:bg-[#2D2424] font-bold text-lg shadow-lg" disabled={loading}>
            {loading ? 'Refining...' : isSignUp ? 'Begin Journey' : 'Enter Glowé'}
          </Button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-[11px] text-[#8C7E7E] hover:text-[#4A3F3F] transition-colors tracking-widest uppercase font-bold"
        >
          {isSignUp ? 'Already a member? Sign in' : "New to Glowé? Create an account"}
        </button>
      </div>
    </div>
  );
};

export default Auth;