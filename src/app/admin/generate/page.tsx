'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Settings, 
  BrainCircuit, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ChefHat, 
  ArrowRight,
  RefreshCw,
import Swal from 'sweetalert2';
import { CATEGORIES } from '@/components/CategoryFilter';

export default function AIGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [count, setCount] = useState(5);
  const [theme, setTheme] = useState('');
  const [results, setResults] = useState<{
    created: number;
    errors: number;
    details: string[];
  } | null>(null);

  const handleGenerate = async () => {
    if (isGenerating) return;

    const result = await Swal.fire({
      title: 'Run AI Recipe Factory?',
      text: `Gemini will generate ${count} unique recipes with the theme "${theme || 'Original'}". This may take a moment.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Start Generation',
      background: '#111827',
      color: '#fff'
    });

    if (!result.isConfirmed) return;

    setIsGenerating(true);
    setResults(null);

    try {
      const response = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          count,
          theme: theme || 'creative and unique',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResults({
          created: data.created,
          errors: data.errors,
          details: data.details,
        });
        
        Swal.fire({
          title: 'AI Tasks Complete!',
          text: `Successfully created ${data.created} new recipes.`,
          icon: 'success',
          background: '#111827',
          color: '#fff',
          confirmButtonColor: '#f59e0b',
        });
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (error: any) {
      Swal.fire({
        title: 'System Error',
        text: error.message,
        icon: 'error',
        background: '#111827',
        color: '#fff',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      
      {/* Hero Header */}
      <div className="bg-linear-to-r from-amber-500/10 via-transparent to-transparent p-1 border-b border-amber-500/20 mb-12">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-amber-500/20 animate-pulse">
            <Sparkles size={24} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            AI <span className="text-amber-500 uppercase">Recipe Factory</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Control Panel */}
        <div className="lg:col-span-12">
          <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <BrainCircuit size={200} />
            </div>

            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-white">
                <Settings className="w-5 h-5 text-amber-500" /> Factory Configuration
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
                {/* Count Selection */}
                <div>
                  <label className="text-sm text-gray-400 mb-4 block font-black uppercase tracking-widest">Quantity</label>
                  <div className="flex items-center gap-6">
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      value={count}
                      onChange={(e) => setCount(parseInt(e.target.value))}
                      className="flex-1 accent-amber-500 h-2 bg-gray-800 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="w-16 h-16 bg-gray-800/80 rounded-3xl flex items-center justify-center font-black text-2xl text-amber-500 border border-gray-700 shadow-xl">
                      {count}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-3 font-bold uppercase tracking-tighter">Suggested: 5-10 per batch</p>
                </div>

                {/* Theme Selection */}
                <div>
                  <label className="text-sm text-gray-400 mb-4 block font-black uppercase tracking-widest">Theme / Cuisine</label>
                  <input
                    type="text"
                    placeholder="e.g. Modern Italian, Healthy Breakfast, Spicy Asian..."
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-amber-500/50 text-white placeholder-gray-600 transition-all font-medium"
                  />
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                    {CATEGORIES.filter(c => c.value !== 'all').map(cat => (
                      <button 
                        key={cat.value}
                        onClick={() => setTheme(cat.label)}
                        className="px-3 py-1 bg-gray-800 rounded-full text-[10px] text-gray-400 border border-gray-700 hover:text-amber-500 transition-colors whitespace-nowrap"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full py-6 rounded-[1.5rem] flex items-center justify-center gap-4 font-black text-xl transition-all relative overflow-hidden group ${
                  isGenerating 
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                  : 'bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-2xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    AI ENGINE IS COOKING...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    INITIALIZE FACTORY
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Stream */}
        {results || isGenerating ? (
          <div className="lg:col-span-12">
            <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-[2.5rem] overflow-hidden">
              <div className="p-8 border-b border-gray-800 flex items-center justify-between bg-gray-900/20">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5 text-green-500" /> Generation Log
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                    Status: {isGenerating ? 'Active' : 'Complete'}
                  </span>
                  <div className={`w-3 h-3 rounded-full ${isGenerating ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
                </div>
              </div>

              <div className="p-8 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                {isGenerating && !results && (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-amber-500/20 rounded-full animate-ping absolute inset-0"></div>
                      <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center relative z-10">
                        <Loader2 className="w-12 h-12 text-black animate-spin" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 underline decoration-amber-500 decoration-4">Gemini is Dreaming</h3>
                      <p className="text-gray-500 text-sm max-w-sm">Generating unique names, sourcing high-end images, and formatting instructions...</p>
                    </div>
                  </div>
                )}

                {results?.details.map((detail, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-5 bg-gray-800/30 border border-gray-700/50 rounded-2xl hover:bg-gray-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold">{detail.replace('Created: ', '')}</p>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Stored in Database & Storage</p>
                      </div>
                    </div>
                    <ArrowRight className="text-gray-700 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                ))}

                {results?.errors && results.errors > 0 && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 flex items-center gap-3 font-bold text-sm">
                    <AlertCircle size={20} />
                    {results.errors} generation cycles failed.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-12 py-12 text-center opacity-20">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ChefHat size={48} />
            </div>
            <p className="text-xl font-black uppercase tracking-[0.2em] text-gray-500">Ready for Command</p>
          </div>
        )}

      </div>
      
      {/* Visual Activity component (CSS Animation) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
      `}</style>
    </div>
  );
}

function Activity(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
