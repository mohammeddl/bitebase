'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import PageAnimations from '@/components/PageAnimations';
import AIChefForm from '@/components/AIChefForm';
import AIRecipeResult from '@/components/AIRecipeResult';
import gsap from 'gsap';
import { ChefHat, Sparkles, Wand2, Cookie, Utensils, Check, Search, Image as ImageIcon, Clock, ArrowRight, Flame } from 'lucide-react';

const DAILY_LIMIT = 5;
const STORAGE_KEY = 'ai_chef_usage';

function getUsage(): { count: number; date: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, date: '' };
    return JSON.parse(raw);
  } catch {
    return { count: 0, date: '' };
  }
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0]; // e.g. '2026-04-09'
}

function incrementUsage(): number {
  const today = getTodayStr();
  const usage = getUsage();
  const count = usage.date === today ? usage.count + 1 : 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ count, date: today }));
  return count;
}

function getRemainingCount(): number {
  const today = getTodayStr();
  const usage = getUsage();
  if (usage.date !== today) return DAILY_LIMIT;
  return Math.max(0, DAILY_LIMIT - usage.count);
}

function getMidnightCountdown(): string {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function AIChefPage() {
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(1);
  const [remaining, setRemaining] = useState(DAILY_LIMIT);
  const [countdown, setCountdown] = useState('');

  // Load remaining count from localStorage on mount
  useEffect(() => {
    setRemaining(getRemainingCount());
  }, []);

  // Live countdown clock (only runs when limit is hit)
  useEffect(() => {
    if (remaining > 0) return;
    setCountdown(getMidnightCountdown());
    const interval = setInterval(() => {
      setCountdown(getMidnightCountdown());
      // Auto-reset if the day changed
      const newRemaining = getRemainingCount();
      if (newRemaining > 0) {
        setRemaining(newRemaining);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [remaining]);

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    if (loading) {
      setLoadingStep(1);
      timers.push(setTimeout(() => setLoadingStep(2), 4000));
      timers.push(setTimeout(() => setLoadingStep(3), 12000));
    } else {
      setLoadingStep(1);
    }
    return () => timers.forEach(clearTimeout);
  }, [loading]);

  const generateRecipe = async (ingredients: string[], vibe: string) => {
    if (remaining <= 0) return; // Guard
    setLoading(true);
    setError(null);
    setRecipe(null);
    
    try {
      const response = await fetch('/api/ai-chef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, vibe }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate recipe');
      
      // ✅ Increment usage count on success
      const newCount = incrementUsage();
      setRemaining(Math.max(0, DAILY_LIMIT - newCount));

      setRecipe(data);
      setTimeout(() => {
        document.getElementById('recipe-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Elegant entrance animations
    const ctx = gsap.context(() => {
      gsap.from('.ai-header-tag', { 
        y: 20, 
        opacity: 0, 
        duration: 0.8, 
        ease: 'power3.out' 
      });
      gsap.from('.ai-title', { 
        y: 40, 
        opacity: 0, 
        duration: 1, 
        delay: 0.2, 
        ease: 'power4.out' 
      });
      gsap.from('.ai-desc', { 
        y: 30, 
        opacity: 0, 
        duration: 1, 
        delay: 0.4, 
        ease: 'power3.out' 
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <PageAnimations />
      
      {/* ─── Full Screen Loading Overlay ─── */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300 px-6">
           <div className="relative mb-8">
             <div className="w-20 h-20 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center">
               <Sparkles className="w-8 h-8 text-amber-500" />
             </div>
           </div>
           
           <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2 text-center">Cooking Magic...</h2>
           <p className="font-medium text-gray-500 text-center max-w-sm mb-12">
             Good food takes time. Please wait up to 60 seconds.
           </p>

           <div className="w-full max-w-md mx-auto px-2 sm:px-6">
             <div className="flex justify-between items-start relative">
               {/* Connecting background progress line */}
               <div className="absolute left-[15%] right-[15%] top-5 h-1 bg-gray-100 -z-10 rounded-full"></div>
               <div 
                 className="absolute left-[15%] top-5 h-1 bg-amber-500 -z-10 transition-all duration-700 ease-in-out rounded-full" 
                 style={{ width: loadingStep === 1 ? '0%' : loadingStep === 2 ? '50%' : '70%' }}
               ></div>

               {/* Step 1 */}
               <div className="flex flex-col items-center gap-3 relative z-10 w-1/3">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${loadingStep === 1 ? 'bg-amber-500 text-white shadow-lg ring-4 ring-amber-100 scale-110' : loadingStep > 1 ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                   {loadingStep > 1 ? <Check size={18} strokeWidth={3} /> : <Search size={18} />}
                 </div>
                 <span className={`text-[11px] sm:text-xs font-bold text-center tracking-wide uppercase transition-colors ${loadingStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Analyzing<br/>Ingredients</span>
               </div>

               {/* Step 2 */}
               <div className="flex flex-col items-center gap-3 relative z-10 w-1/3">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${loadingStep === 2 ? 'bg-amber-500 text-white shadow-lg ring-4 ring-amber-100 scale-110' : loadingStep > 2 ? 'bg-amber-500 text-white' : 'bg-white border-2 border-gray-100 text-gray-400'}`}>
                   {loadingStep > 2 ? <Check size={18} strokeWidth={3} /> : <Wand2 size={18} />}
                 </div>
                 <span className={`text-[11px] sm:text-xs font-bold text-center tracking-wide uppercase transition-colors ${loadingStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Crafting<br/>Recipe</span>
               </div>

               {/* Step 3 */}
               <div className="flex flex-col items-center gap-3 relative z-10 w-1/3">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${loadingStep === 3 ? 'bg-amber-500 text-white shadow-lg ring-4 ring-amber-100 scale-110' : loadingStep > 3 ? 'bg-amber-500 text-white' : 'bg-white border-2 border-gray-100 text-gray-400'}`}>
                   {loadingStep > 3 ? <Check size={18} strokeWidth={3} /> : <ImageIcon size={18} />}
                 </div>
                 <span className={`text-[11px] sm:text-xs font-bold text-center tracking-wide uppercase transition-colors ${loadingStep >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>Visualizing<br/>Dish</span>
               </div>
             </div>
           </div>
        </div>
      )}

      {/* ─── Hero Section ─── */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Animated background icons */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
           <ChefHat className="absolute top-20 left-[10%] -rotate-12" size={120} />
           <Wand2 className="absolute top-40 right-[15%] rotate-45" size={100} />
           <Cookie className="absolute bottom-20 left-[20%] -rotate-45" size={80} />
           <Utensils className="absolute bottom-40 right-[10%] rotate-12" size={110} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="ai-title text-5xl sm:text-6xl md:text-7xl font-black text-gray-950 leading-[0.9] mb-8">
              The <span className="text-amber-500 italic">Chef&apos;s</span><br />
              Digital Alchemy
            </h1>
            
            <p className="ai-desc text-lg text-gray-500/80 font-medium leading-relaxed">
              No plan? No problem. Simply tell our AI what ingredients you have, 
              select your culinary vibe, and let magic take over your kitchen.
            </p>
          </div>

          {/* Usage indicator */}
          {remaining > 0 && (
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full text-sm font-semibold text-amber-700">
                <Flame size={14} className="text-amber-500" />
                {remaining} of {DAILY_LIMIT} free generations remaining today
              </div>
            </div>
          )}

          {/* Generator Form OR Limit Reached */}
          {remaining > 0 ? (
            <div className="bg-white p-2 sm:p-4 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 mb-20">
              <div className="bg-white rounded-[2.5rem] p-8 sm:p-12">
                <AIChefForm onGenerate={generateRecipe} isLoading={loading} />
              </div>
            </div>
          ) : (
            /* ─── Limit Reached Banner ─── */
            <div className="mb-20 rounded-[3rem] border border-amber-100 bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 p-2 shadow-xl shadow-amber-100/40">
              <div className="rounded-[2.5rem] bg-white/70 backdrop-blur-sm p-10 sm:p-14 text-center">
                {/* Icon */}
                <div className="w-20 h-20 bg-amber-500 rounded-3xl rotate-3 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-200">
                  <ChefHat size={36} className="text-white -rotate-3" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                  Daily Limit Reached! 🍳
                </h2>
                <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8 leading-relaxed">
                  You&apos;ve used all <span className="font-black text-gray-800">{DAILY_LIMIT} free AI generations</span> for today.
                  Your limit resets at midnight.
                </p>

                {/* Countdown */}
                <div className="inline-flex flex-col items-center gap-2 px-8 py-5 bg-gray-950 rounded-2xl mb-8">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-widest">
                    <Clock size={12} />
                    Resets in
                  </div>
                  <div className="text-4xl font-black text-white font-mono tracking-tight">
                    {countdown}
                  </div>
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-10">
                  {Array.from({ length: DAILY_LIMIT }).map((_, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"
                    />
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/search"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-amber-200 hover:shadow-amber-300 hover:-translate-y-0.5"
                  >
                    Browse 250+ Recipes
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm rounded-2xl transition-all"
                  >
                    Go Home
                  </Link>
                </div>

                <p className="mt-6 text-xs text-gray-400 font-medium">
                  Come back tomorrow for {DAILY_LIMIT} more free generations ✨
                </p>
              </div>
            </div>
          )}

          {/* Results section */}
          <div id="recipe-result" className="min-h-[200px] flex items-center justify-center">
            {error && (
              <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center max-w-md animate-in fade-in zoom-in duration-500">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">🥘</div>
                 <h3 className="text-lg font-black text-red-900 mb-2">Kitchen Mishap!</h3>
                 <p className="text-sm text-red-600/80 font-medium">{error}</p>
                 <button 
                  onClick={() => setError(null)}
                  className="mt-6 text-xs font-bold text-red-500 underline underline-offset-4 hover:text-red-700"
                 >
                   Try another spell
                 </button>
              </div>
            )}

            {recipe && <AIRecipeResult recipe={recipe} />}

            {!recipe && !loading && !error && (
              <div className="text-center opacity-20 py-20 grayscale">
                 <ChefHat size={48} className="mx-auto mb-4" />
                 <p className="text-xs font-black uppercase tracking-widest">Waiting for Your Ingredients...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer decoration */}
      <div className="h-40 bg-linear-to-t from-gray-50 to-transparent pointer-events-none" />
    </div>
  );
}
