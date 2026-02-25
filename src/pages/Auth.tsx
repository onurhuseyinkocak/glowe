import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getURL } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import { Chrome, Sparkles } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSocialLogin = async (provider: 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: getURL() },
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
        showSuccess('Welcome to the Glow. Check your email.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      }
    } catch (error: any) { showError(error.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-[#FFF9F9] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-[#FCE4EC] rounded-full blur-[100px] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-[#E0F2F1] rounded-full blur-[100px] opacity-50" />

      <div className="w-full max-w-sm space-y-12 text-center relative z-10">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[30px] bg-white shadow-xl mb-4 animate-float">
            <Sparkles size={40} className="text-[#D81B60]" />
          </div>
          <h1 className="text-7xl font-serif tracking-tighter text-[#4A3F3F]">Glowé</h1>
          <p className="text-[#BCAEAE] font-bold tracking-[0.4em] uppercase text-[9px]">Your Presence. Refined.</p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => handleSocialLogin('google')}
            className="w-full h-16 rounded-full bg-white border border-[#FCE4EC] text-[#4A3F3F] font-bold gap-4 shadow-sm hover:bg-[#FCE4EC]/10 transition-all"
          >
            <Chrome size={20} />
            Continue with Google
          </Button>
        </div>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#FCE4EC]"></span></div>
          <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em]"><span className="bg-[#FFF9F9] px-6 text-[#BCAEAE] font-bold">Or Email</span></div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-5 text-left">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-[#BCAEAE] ml-6 font-bold">Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-16 rounded-full border-[#FCE4EC] bg-white/50 focus:ring-[#FCE4EC] px-8 shadow-inner"
                placeholder="hello@glowe.app"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-[#BCAEAE] ml-6 font-bold">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-16 rounded-full border-[#FCE4EC] bg-white/50 focus:ring-[#FCE4EC] px-8 shadow-inner"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-16 rounded-full bg-[#4A3F3F] text-white hover:bg-black font-bold text-lg shadow-2xl" disabled={loading}>
            {loading ? 'Syncing...' : isSignUp ? 'Begin Journey' : 'Enter Glowé'}
          </Button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-[10px] text-[#BCAEAE] hover:text-[#D81B60] transition-colors tracking-[0.2em] uppercase font-bold"
        >
          {isSignUp ? 'Already a member? Sign in' : "New to Glowé? Create an account"}
        </button>
      </div>
    </div>
  );
};

export default Auth;