'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, User } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`.trim(),
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.session) {
        router.push('/account');
        router.refresh();
        return;
      }

      setMessage('Account created. Please check your email to confirm your sign in.');
    } catch {
      setError('Registration failed. Please try again.');
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
            Create Account
          </h1>
          <p className="text-foreground/60 text-center mb-8">
            Join DIVONE for faster checkout and order updates
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-foreground mb-2">First Name</label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-3 text-foreground/50" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-foreground mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                />
              </div>
            </div>

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
                  minLength={8}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-foreground mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                required
                className="w-full px-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-accent text-accent-foreground font-semibold rounded hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-foreground/60">
            Already have an account?{' '}
            <Link href="/login" className="text-accent hover:text-accent/80 font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
