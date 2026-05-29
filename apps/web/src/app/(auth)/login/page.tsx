'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@chatowa/ui';
import { createClient } from '../../../lib/supabase/client';
import { toast } from 'sonner';
import { Car, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      toast.success('Successfully logged in!');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C3E50] via-[#1A252F] to-black flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#E67E22_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="relative w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#BDC3C7]/10 space-y-8">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="bg-[#E67E22] p-2 rounded-lg text-white shadow-lg">
              <Car className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-wider text-[#2C3E50]">
              CHATOWA<span className="text-[#E67E22]">.</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-[#2C3E50]">Welcome Back</h2>
          <p className="text-sm text-[#BDC3C7]">Log in to manage your rentals and purchases.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#2C3E50] uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-[#BDC3C7]" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#2C3E50] uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-[#BDC3C7]" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white py-3.5 font-bold shadow-md shadow-[#E67E22]/10"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-sm text-[#BDC3C7]">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-[#E67E22] hover:text-[#D35400] transition-colors">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}