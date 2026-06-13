'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push('/account');
      router.refresh();
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen flex items-center">
      <div className="max-w-md mx-auto w-full px-4">
        <motion.div
          className="bg-white rounded-lg p-8 border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-foreground/60 text-center mb-8">
            Sign in to your Luxe account
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium text-foreground mb-2">Email Address</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-3 text-foreground/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-3 text-foreground/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-accent text-accent-foreground font-semibold rounded hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-foreground/60">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-accent hover:text-accent/80 font-medium">
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <Link href="/shop" className="text-accent hover:text-accent/80 text-sm font-medium text-center block">
              Continue as guest
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
