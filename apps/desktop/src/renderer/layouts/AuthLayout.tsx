import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@chatowa/ui';
import { CarFront, Lock, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/auth-store';

// Only these roles can access the desktop admin app
const ALLOWED_DESKTOP_ROLES = ['super_admin', 'admin', 'finance', 'worker'] as const;

export const AuthLayout: React.FC = () => {
  const navigate = useNavigate();
  const { session, profile, initialize } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in with a valid staff role, go straight to dashboard
  useEffect(() => {
    if (session && profile) {
      if (ALLOWED_DESKTOP_ROLES.includes(profile.role as any)) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [session, profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      // Re-initialize store to fetch profile + role
      await initialize();

      // Check profile from store after init
      const { profile: freshProfile } = useAuthStore.getState();
      if (!freshProfile) throw new Error('Could not load user profile.');

      if (!ALLOWED_DESKTOP_ROLES.includes(freshProfile.role as any)) {
        // Customer accounts are not allowed in the desktop admin system
        await supabase.auth.signOut();
        useAuthStore.setState({ session: null, user: null, profile: null });
        throw new Error('Access denied. This system is for Chatowa staff only.');
      }

      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F4F6F7] p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-[#2C3E50]" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#E67E22] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-1/3 -left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

      <div className="z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#BDC3C7]/20">
        {/* Header */}
        <div className="bg-[#2C3E50] p-8 text-center border-b-4 border-[#E67E22]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4 backdrop-blur-sm">
            <CarFront className="h-8 w-8 text-[#E67E22]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Chatowa Investments</h1>
          <p className="text-[#BDC3C7] mt-2 text-sm">Integrated Business Management System</p>
          <p className="text-[#BDC3C7]/60 mt-1 text-xs">Staff Portal — Authorised Access Only</p>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <Input
              type="email"
              label="Email Address"
              placeholder="admin@chatowa.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              required
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <div className="flex flex-col gap-1">
              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                required
                leftIcon={<Lock className="h-4 w-4" />}
              />
              <div className="flex justify-end mt-1">
                <a href="#" className="text-xs text-[#E67E22] hover:underline font-medium">
                  Forgot Password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="mt-4 w-full text-base py-5 font-semibold shadow-lg shadow-[#E67E22]/20"
              loading={isLoading}
            >
              Sign In to Admin System
            </Button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Chatowa Investments. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;