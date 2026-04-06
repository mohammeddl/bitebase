'use client';

import { useState } from 'react';
import { Sparkles, Utensils, Zap, Leaf, Heart } from 'lucide-react';

interface Props {
  onGenerate: (ingredients: string[], vibe: string) => void;
  isLoading: boolean;
}

const VIBES = [
  { id: 'quick', label: 'Quick & Easy', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'gourmet', label: 'Gourmet Chef', icon: Utensils, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'healthy', label: 'Fresh & Healthy', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'hearty', label: 'Family Hearty', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
];

export default function AIChefForm({ onGenerate, isLoading }: Props) {
  const [ingredients, setIngredients] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('quick');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;
    
    const list = ingredients.split(',').map(i => i.trim()).filter(Boolean);
    onGenerate(list, selectedVibe);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
      {/* Ingredients Input */}
      <div className="space-y-3">
        <label className="block text-sm font-black text-gray-900 uppercase tracking-widest">
          What&apos;s in your fridge?
        </label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g. Tomato, Pasta, Garlic, Basil..."
          className="w-full h-32 px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all resize-none font-medium"
        />
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-2">
          Separate ingredients with commas for better results
        </p>
      </div>

      {/* Vibe Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-black text-gray-900 uppercase tracking-widest">
          Choose a Cooking Vibe
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {VIBES.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedVibe(v.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all group ${
                selectedVibe === v.id
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-transparent bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <v.icon size={20} className={`mb-2 ${selectedVibe === v.id ? 'text-amber-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className={`text-[10px] font-black uppercase text-center ${selectedVibe === v.id ? 'text-amber-600' : 'text-gray-400'}`}>
                {v.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        type="submit"
        disabled={isLoading || !ingredients.trim()}
        className="w-full group relative bg-gray-900 hover:bg-amber-500 text-white font-black py-5 px-8 rounded-full transition-all flex items-center justify-center gap-3 overflow-hidden disabled:opacity-50 disabled:hover:bg-gray-900"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating magic...
          </span>
        ) : (
          <>
            <Sparkles size={18} className="group-hover:scale-125 transition-transform" />
            <span>Cast Recipe Spell</span>
          </>
        )}
      </button>
    </form>
  );
}
