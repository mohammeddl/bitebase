'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, Eye, EyeOff } from 'lucide-react';

type Mode = 'login' | 'register' | 'reset';

interface Props {
  onClose: () => void;
}

export default function AuthModal({ onClose }: Props) {
  const { login, register, loginWithGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const set = (field: string, val: string) => {
    setForm(f => ({ ...f, [field]: val }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email) return setError('Email is required');
    if (mode !== 'reset' && !form.password) return setError('Password is required');
    if (mode === 'register' && !form.name) return setError('Full name is required');

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        onClose();
      } else if (mode === 'register') {
        await register(form.name, form.email, form.password);
        onClose();
      } else if (mode === 'reset') {
        await resetPassword(form.email);
        setResetSent(true);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Top amber accent bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-amber-400 to-amber-600" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X size={16} />
        </button>

        <div className="px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-black text-gray-900">
              {mode === 'login' && 'Welcome back 👋'}
              {mode === 'register' && 'Create account 🍳'}
              {mode === 'reset' && 'Reset password 🔑'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {mode === 'login' && "Sign in to your BiteBase account"}
              {mode === 'register' && "Join our culinary community today"}
              {mode === 'reset' && "We'll send you a reset link by email"}
            </p>
          </div>

          {/* Reset success */}
          {resetSent ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-3">📬</div>
              <p className="font-bold text-gray-900 mb-1">Email sent!</p>
              <p className="text-gray-400 text-sm mb-6">Check your inbox for the reset link.</p>
              <button onClick={() => { setMode('login'); setResetSent(false); }} className="text-amber-500 text-sm font-semibold hover:underline">
                Back to login
              </button>
            </div>
          ) : (
            <>
              {/* Google button */}
              {mode !== 'reset' && (
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-full py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors mb-5"
                >
                  {/* Google G icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                </button>
              )}

              {/* Divider */}
              {mode !== 'reset' && (
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">or continue with email</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <input
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className={inputCls}
                  />
                )}

                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className={inputCls}
                />

                {mode !== 'reset' && (
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Password"
                      value={form.password}
                      onChange={e => set('password', e.target.value)}
                      className={inputCls + ' pr-12'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                )}

                {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

                {mode === 'login' && (
                  <div className="text-right">
                    <button type="button" onClick={() => setMode('reset')} className="text-xs text-amber-500 font-semibold hover:underline">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-between bg-gray-900 hover:bg-amber-500 text-white font-bold py-3.5 px-6 rounded-full transition text-sm disabled:opacity-60"
                >
                  <span>
                    {mode === 'login' && (loading ? 'Signing in...' : 'Sign In')}
                    {mode === 'register' && (loading ? 'Creating account...' : 'Create Account')}
                    {mode === 'reset' && (loading ? 'Sending...' : 'Send Reset Link')}
                  </span>
                  <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-xs">→</span>
                </button>
              </form>

              {/* Footer toggle */}
              <p className="text-center text-sm text-gray-400 mt-5">
                {mode === 'login' && (
                  <>Don&apos;t have an account?{' '}
                    <button onClick={() => setMode('register')} className="text-amber-500 font-semibold hover:underline">Sign up</button>
                  </>
                )}
                {mode === 'register' && (
                  <>Already have an account?{' '}
                    <button onClick={() => setMode('login')} className="text-amber-500 font-semibold hover:underline">Sign in</button>
                  </>
                )}
                {mode === 'reset' && (
                  <button onClick={() => setMode('login')} className="text-amber-500 font-semibold hover:underline">← Back to login</button>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
