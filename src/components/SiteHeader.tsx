'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useWatchlist } from '@/contexts/WatchlistContext';
import AuthModal from '@/components/AuthModal';
import { LogOut, User, ChevronDown, Menu, X, Heart } from 'lucide-react';
import Swal from 'sweetalert2';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT' },
  { href: '/search', label: 'RECIPES' },
  { href: '/ai-chef', label: 'AI CHEF' },
  { href: '/contact', label: 'CONTACT' },
];

export default function SiteHeader() {
  const { user, isLoggedIn, logout } = useAuth();
  const { count: watchlistCount } = useWatchlist();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [burgerOpen, setBurgerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when burger open
  useEffect(() => {
    document.body.style.overflow = burgerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [burgerOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 shrink-0">
              <span className="text-2xl font-black tracking-tight text-gray-900">
                BITE<span className="text-amber-500">BASE</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs font-semibold tracking-widest text-gray-600 hover:text-amber-500 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right: search + watchlist + auth */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search bar — desktop only */}
              <div className="hidden lg:flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-32"
                />
              </div>

              {/* Watchlist icon */}
              <Link
                href="/profile"
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    Swal.fire({
                      icon: 'info',
                      title: 'Authentication Required',
                      text: 'Please sign in or create an account to view your Watchlist!',
                      confirmButtonColor: '#f59e0b',
                      confirmButtonText: 'Sign In'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        setShowModal(true);
                      }
                    });
                  }
                }}
                className="relative w-9 h-9 rounded-full bg-gray-100 hover:bg-amber-50 flex items-center justify-center transition-colors"
                title="My Watchlist"
              >
                <Heart size={16} className="text-gray-600" />
                {watchlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {watchlistCount > 9 ? '9+' : watchlistCount}
                  </span>
                )}
              </Link>


              {/* Logged out: Sign In button — hidden on mobile (use burger) */}
              {!isLoggedIn && (
                <button
                  onClick={() => setShowModal(true)}
                  className="hidden sm:flex items-center gap-2 bg-gray-900 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                >
                  Sign In
                </button>
              )}

              {/* Logged in: Avatar + dropdown */}
              {isLoggedIn && user && (
                <div ref={dropdownRef} className="relative hidden sm:block">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-amber-500 flex items-center justify-center text-white font-bold text-sm shrink-0 border-2 border-amber-200">
                      {user.avatar_url ? (
                        <Image src={user.avatar_url} alt={user.full_name} width={36} height={36} className="object-cover w-full h-full" />
                      ) : (
                        user.full_name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="hidden sm:block text-sm font-semibold text-gray-900 max-w-[90px] truncate">
                      {user.full_name.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 w-52 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.full_name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                      >
                        <User size={15} /> My Profile
                      </Link>
                      <Link
                        href="/profile#watchlist"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                      >
                        <Heart size={15} /> Watchlist
                        {watchlistCount > 0 && (
                          <span className="ml-auto bg-red-100 text-red-500 text-xs font-bold px-2 py-0.5 rounded-full">{watchlistCount}</span>
                        )}
                      </Link>
                      <button
                        onClick={() => { logout(); setShowDropdown(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Burger menu button — mobile only */}
              <button
                onClick={() => setBurgerOpen(true)}
                className="md:hidden w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                aria-label="Open menu"
              >
                <Menu size={18} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Mobile Drawer ─── */}
      {burgerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setBurgerOpen(false)}
          />

          {/* Slide-in panel */}
          <div className="fixed top-0 right-0 h-full w-72 bg-white z-[70] shadow-2xl flex flex-col md:hidden"
            style={{ animation: 'slideInRight 0.3s ease-out' }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <span className="text-xl font-black text-gray-900">
                BITE<span className="text-amber-500">BASE</span>
              </span>
              <button
                onClick={() => setBurgerOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* User info (if logged in) */}
            {isLoggedIn && user && (
              <div className="flex items-center gap-3 px-6 py-4 bg-amber-50 border-b border-amber-100">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-500 flex items-center justify-center text-white font-bold shrink-0">
                  {user.avatar_url ? (
                    <Image src={user.avatar_url} alt={user.full_name} width={40} height={40} className="object-cover w-full h-full" />
                  ) : user.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{user.full_name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Nav links */}
            <nav className="flex flex-col px-4 py-4 gap-1 flex-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setBurgerOpen(false)}
                  className="flex items-center px-4 py-3.5 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                >
                  {label}
                </Link>
              ))}

              <div className="border-t border-gray-100 mt-3 pt-3">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setBurgerOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      <User size={16} /> My Profile
                    </Link>
                    <Link
                      href="/profile#watchlist"
                      onClick={() => setBurgerOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      <Heart size={16} /> Watchlist
                      {watchlistCount > 0 && (
                        <span className="ml-auto bg-red-100 text-red-500 text-xs font-bold px-2 py-0.5 rounded-full">{watchlistCount}</span>
                      )}
                    </Link>
                    <button
                      onClick={() => { logout(); setBurgerOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setShowModal(true); setBurgerOpen(false); }}
                    className="w-full flex items-center justify-between bg-gray-900 hover:bg-amber-500 text-white font-semibold px-5 py-3.5 rounded-full transition-colors text-sm"
                  >
                    Sign In <span className="text-xs">→</span>
                  </button>
                )}
              </div>
            </nav>
          </div>

          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </>
      )}

      {/* Auth modal */}
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  );
}
