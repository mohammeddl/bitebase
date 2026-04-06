'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { Timer, Trophy, CheckCircle, Heart, Share2, Printer } from 'lucide-react';
import Swal from 'sweetalert2';
import Image from 'next/image';

interface Recipe {
  title: string;
  cookingTime: string;
  difficulty: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  servingSuggestion?: string;
  imageUrl?: string;
}

export default function AIRecipeResult({ recipe }: { recipe: Recipe }) {
  const { toggle, isSaved } = useWatchlist();
  const { isLoggedIn } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  // Create a pseudo-ID for AI recipes based on title to use with the watchlist
  const recipeId = Math.abs(recipe.title.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0));

  const saved = isSaved(recipeId);

  // We now use the image that was preloaded by the parent page component
  const dynamicImageUrl = recipe.imageUrl || '';

  const handleSave = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'info',
        title: 'Authentication Required',
        text: 'Please sign in or create an account to save AI recipes to your magical profile!',
        confirmButtonColor: '#f59e0b',
        confirmButtonText: 'Got it!'
      });
      return;
    }
    
    setIsSaving(true);
    try {
      await toggle(recipeId, recipe.title, dynamicImageUrl);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="printable-recipe" className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header section with full image */}
      <div className="relative p-8 sm:p-12 overflow-hidden min-h-[400px] flex flex-col justify-end">

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={dynamicImageUrl}
            alt="Recipe background"
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay to ensure white text is perfectly readable */}
          <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-900/60 to-transparent" />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">AI Created Masterpiece</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            {recipe.title}
          </h2>
          
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mb-8">
            {recipe.description}
          </p>
          
          <div className="flex flex-wrap gap-4 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Timer size={20} className="text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Time</p>
                <p className="text-sm font-black text-white">{recipe.cookingTime}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Trophy size={20} className="text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Skill</p>
                <p className="text-sm font-black text-white">{recipe.difficulty}</p>
              </div>
            </div>
            
            <div className="ml-auto flex items-center gap-3">
                <button 
                  onClick={handleSave}
                  title={saved ? "Remove from Watchlist" : "Save to Watchlist"}
                  disabled={isSaving}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    saved 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                    : 'bg-white/10 text-white hover:bg-white hover:text-gray-900 group backdrop-blur-sm'
                  }`}
                >
                  <Heart size={20} className={`transition-colors ${saved ? 'fill-white' : 'group-hover:fill-gray-900'}`} />
                </button>
                <button 
                  onClick={() => window.print()}
                  title="Save as PDF / Print"
                  className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-gray-900 transition-all backdrop-blur-sm"
                >
                  <Printer size={20} />
                </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16">
        {/* Ingredients sidebar */}
        <div className="md:col-span-4 lg:col-span-3">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
             <span className="w-6 h-1 bg-amber-500 rounded-full" />
             Ingredients
          </h3>
          <ul className="space-y-4">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600 font-medium leading-tight">
                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full mt-1.5 shrink-0" />
                {ing}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps section */}
        <div className="md:col-span-8 lg:col-span-9">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-8 flex items-center gap-2">
             <span className="w-6 h-1 bg-amber-500 rounded-full" />
             Instructions
          </h3>
          <div className="space-y-10 relative">
             <div className="absolute left-[11px] top-4 bottom-4 w-px bg-gray-100 hidden sm:block" />
             
             {recipe.instructions.map((step, i) => (
               <div key={i} className="relative flex gap-6 sm:gap-10 group">
                 <div className="w-6 h-6 rounded-full bg-gray-950 text-white text-[10px] font-black flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-125 group-hover:bg-amber-500">
                    {i + 1}
                 </div>
                 <div className="space-y-2">
                    <p className="text-gray-800 font-medium leading-relaxed">
                      {step}
                    </p>
                    <div className="h-px w-full bg-gray-50 " />
                 </div>
               </div>
             ))}
          </div>

          {recipe.servingSuggestion && (
            <div className="mt-12 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
               <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shrink-0 shadow-sm">💡</div>
               <div>
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Chef&apos;s Pro Tip</p>
                  <p className="text-sm text-gray-700 italic leading-relaxed">
                    &quot;{recipe.servingSuggestion}&quot;
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Print-specific styles to hide everything else on the page */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-recipe, #printable-recipe * {
            visibility: visible;
          }
          #printable-recipe {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            margin: 0 !important;
          }
          /* Hide the print/save buttons during print */
          #printable-recipe button {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
}

