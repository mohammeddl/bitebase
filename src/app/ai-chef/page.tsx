'use client';

import { useState, useEffect } from 'react';
import PageAnimations from '@/components/PageAnimations';
import AIChefForm from '@/components/AIChefForm';
import AIRecipeResult from '@/components/AIRecipeResult';
import gsap from 'gsap';
import { ChefHat, Sparkles, Wand2, Cookie, Utensils, Check, Search, Image as ImageIcon } from 'lucide-react';

export default function AIChefPage() {
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(1);

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
      
      // The AI Image is now fetched securely by the server and arrives inside data.imageUrl as a base64 string
      setRecipe(data);
      
      // Smooth scroll down to the results area after it appears
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

          {/* Generator Form */}
          <div className="bg-white p-2 sm:p-4 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 mb-20">
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-12">
               <AIChefForm onGenerate={generateRecipe} isLoading={loading} />
            </div>
          </div>

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
