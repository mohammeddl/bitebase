'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      console.error("Missing NEXT_PUBLIC_GOOGLE_SCRIPT_URL in .env.local");
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
      return;
    }

    try {
      // no-cors is required for Google Apps Script web apps from client JS
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      // With no-cors we can't read the response properly, but if it didn't throw a network error, we count it as success
      setStatus('success');
      setEmail('');
      
    } catch (error) {
      console.error('Newsletter submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-6 py-4 rounded-full w-full">
        <span className="text-xl">✅</span>
        <p className="font-semibold text-sm">Thanks for joining! You are on the list.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full relative">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address..."
        disabled={status === 'loading'}
        className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-amber-500 text-sm disabled:opacity-50"
      />
      <button 
        type="submit"
        disabled={status === 'loading'}
        className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-full transition whitespace-nowrap min-w-[120px] disabled:opacity-70 flex justify-center items-center"
      >
        {status === 'loading' ? (
           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : 'Join Now'}
      </button>
      
      {status === 'error' && (
        <span className="absolute -bottom-8 left-4 text-xs font-semibold text-red-400">
           Setup error: Please check your Google Script URL.
        </span>
      )}
    </form>
  );
}
