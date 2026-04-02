'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { allRecipes } from '@/lib/recipes';
import { useRouter } from 'next/navigation';
import { Camera, Save, ArrowLeft, Heart, Trash2 } from 'lucide-react';
import PageAnimations from '@/components/PageAnimations';

export default function ProfilePage() {
  const { user, isLoggedIn, updateProfile, logout } = useAuth();
  const { watchlist, toggle } = useWatchlist();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    full_name: user?.full_name ?? '',
    email: user?.email ?? '',
  });
  const [saved, setSaved] = useState(false);

  // Saved recipes data — the watchlist contains recipe IDs from Spoonacular API
  // For now, we'll display a message since allRecipes is mock data
  // In production, you'd fetch the actual recipes from Spoonacular using the IDs

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🔒</p>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Sign in required</h1>
          <p className="text-gray-400 text-sm mb-6">Please sign in to view your profile.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-gray-900 hover:bg-amber-500 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors">
            ← Go Home
          </Link>
        </div>
      </div>
    );
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { uploadAvatar } = await import('@/lib/authUtils');
      if (user?.id) {
        const avatar_url = await uploadAvatar(user.id, file);
        updateProfile({ avatar_url });
      }
    } catch (err) {
      console.error('Failed to upload avatar:', err);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ full_name: form.full_name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-white">
      <PageAnimations />

      {/* ─── Hero Banner ─── */}
      <section className="bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{ background: '#1A1A1A', minHeight: '160px' }}
          >
            <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-amber-500/10" />
            <div className="absolute bottom-[-30px] right-[80px] w-32 h-32 rounded-full bg-amber-500/5" />

            <div className="relative z-10 flex items-center gap-6 px-6 sm:px-10 py-10">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-amber-500 flex items-center justify-center text-white text-3xl font-black border-4 border-white/20">
                  {user.avatar_url ? (
                    <Image src={user.avatar_url} alt={user.full_name} width={80} height={80} className="object-cover w-full h-full" />
                  ) : user.full_name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center shadow-md hover:bg-amber-600 transition"
                >
                  <Camera size={12} className="text-white" />
                </button>
              </div>

              <div>
                <h1 data-gsap="hero" className="text-2xl font-black text-white">{user.full_name}</h1>
                <p className="text-white/50 text-sm">{user.email}</p>
                {watchlist.length > 0 && (
                  <p className="text-amber-400 text-xs mt-1 font-semibold">
                    ❤️ {watchlist.length} saved recipe{watchlist.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <Link href="/" className="ml-auto flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                <ArrowLeft size={14} /> Back
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Profile Form ─── */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Left: Avatar upload card */}
            <div data-gsap="slide-left" className="flex flex-col items-center gap-4">
              <div
                onClick={() => fileRef.current?.click()}
                className="w-36 h-36 rounded-3xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-amber-400 transition-colors relative group"
              >
                {user.avatar_url ? (
                  <Image src={user.avatar_url} alt={user.full_name} width={144} height={144} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-center text-gray-400">
                    <Camera size={28} className="mx-auto mb-1" />
                    <p className="text-xs font-medium">Upload photo</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <p className="text-xs text-gray-400 text-center">Click to upload profile photo<br />JPG, PNG, GIF up to 5MB</p>

              {/* Danger zone */}
              <div className="w-full mt-4 border border-red-100 rounded-2xl p-4">
                <p className="text-xs font-bold text-red-400 mb-3">Danger Zone</p>
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="w-full text-xs font-semibold text-red-500 border border-red-200 rounded-full py-2 hover:bg-red-50 transition"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Right: Edit form */}
            <div data-gsap="slide-right" className="md:col-span-2">
              <h2 className="text-xl font-black text-gray-900 mb-6">Edit Profile</h2>

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400 transition"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400 transition"
                    placeholder="your@email.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-between bg-gray-900 hover:bg-amber-500 text-white font-bold py-4 px-6 rounded-full transition text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Save size={15} />
                    {saved ? 'Saved! ✓' : 'Save Changes'}
                  </span>
                  <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-xs">→</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Watchlist / Saved Recipes ─── */}
      <section id="watchlist" className="py-12 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Heart size={20} className="text-red-500 fill-red-500" />
            <h2 className="text-2xl font-black text-gray-900">
              My <span className="text-amber-500">Saved</span> Recipes
            </h2>
            {watchlist.length > 0 && (
              <span className="bg-red-100 text-red-500 text-xs font-bold px-2.5 py-1 rounded-full">
                {watchlist.length}
              </span>
            )}
          </div>

          {watchlist.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl">
              <Heart size={40} className="text-gray-200 mx-auto mb-4" />
              <p className="text-lg font-bold text-gray-400 mb-2">No saved recipes yet</p>
              <p className="text-gray-400 text-sm mb-6">Browse recipes and tap the ❤️ to save them here</p>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-amber-500 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Browse Recipes →
              </Link>
            </div>
          ) : (
            <div className="text-center py-12 bg-amber-50 rounded-3xl border border-amber-100">
              <Heart size={32} className="text-amber-500 mx-auto mb-3" />
              <p className="text-gray-700 font-semibold mb-2">You have {watchlist.length} saved recipe{watchlist.length !== 1 ? 's' : ''}</p>
              <p className="text-sm text-gray-600">Your saved recipes are stored securely in our database.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
