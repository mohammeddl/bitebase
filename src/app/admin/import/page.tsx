'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Database, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ChefHat, 
  Filter,
  Layers,
  Zap,
  Coffee,
  Pizza,
  Leaf
} from 'lucide-react';
import Swal from 'sweetalert2';

const CATEGORIES = [
  { id: 'all', name: 'All Types', icon: <Layers className="w-4 h-4" /> },
  { id: 'appetizer', name: 'Appetizers', icon: <Coffee className="w-4 h-4" /> },
  { id: 'main', name: 'Main Courses', icon: <Pizza className="w-4 h-4" /> },
  { id: 'vegetarian', name: 'Vegetarian', icon: <Leaf className="w-4 h-4" /> },
  { id: 'dessert', name: 'Desserts', icon: <ChefHat className="w-4 h-4" /> },
  { id: 'easy', name: 'Quick & Easy', icon: <Zap className="w-4 h-4" /> },
];

export default function AdminImportPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [isImporting, setIsImporting] = useState(false);
  const [count, setCount] = useState(10);
  const [offset, setOffset] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [results, setResults] = useState<{
    imported: number;
    skipped: number;
    errors: number;
    details: string[];
  } | null>(null);

  // Security Check: Only admins allowed
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleStartImport = async () => {
    if (isImporting) return;

    const result = await Swal.fire({
      title: 'Start Bulk Import?',
      text: `Are you sure you want to fetch and store ${count} recipes from "${selectedCategory}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Yes, start import',
      background: '#111827',
      color: '#fff'
    });

    if (!result.isConfirmed) return;

    setIsImporting(true);
    setResults(null);

    try {
      const response = await fetch('/api/admin/import/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          count,
          category: selectedCategory,
          offset,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResults({
          imported: data.imported,
          skipped: data.skipped,
          errors: data.errors,
          details: data.details,
        });
        
        // Auto-increment offset for the next batch
        setOffset(prev => prev + count);

        Swal.fire({
          title: 'Import Complete!',
          text: `Success: ${data.imported} | Skipped: ${data.skipped} | Errors: ${data.errors}`,
          icon: 'success',
          background: '#111827',
          color: '#fff',
          confirmButtonColor: '#f59e0b',
        });
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        background: '#111827',
        color: '#fff',
      });
    } finally {
      setIsImporting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  // If not admin, return null (useEffect will redirect)
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
        <div className="bg-red-900/10 border border-red-900/20 p-8 rounded-2xl text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">This page is reserved for administrators only. If you are an admin, please ensure your role is updated in the database.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <section className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
          RECIPE <span className="text-amber-500">IMPORT</span> ENGINE
        </h1>
        <p className="text-gray-400 flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-500" /> Pull high-quality recipe data from Spoonacular directly into your Supabase database.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 p-6 rounded-3xl shadow-2xl">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                <Filter className="w-5 h-5 text-amber-500" /> Configuration
              </h2>
              
              <div className="space-y-6">
                {/* Count Selector */}
                <div>
                  <label className="text-sm text-gray-400 mb-3 block font-medium">Number of Recipes</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      value={count}
                      onChange={(e) => setCount(parseInt(e.target.value))}
                      className="flex-1 accent-amber-500 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="w-12 h-10 bg-gray-800 rounded-xl flex items-center justify-center font-bold text-amber-500 border border-gray-700">
                      {count}
                    </span>
                  </div>
                </div>
                
                {/* Offset Selector */}
                <div>
                  <label className="text-sm text-gray-400 mb-3 block font-medium">Starting Offset (Pagination)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="number" 
                      min="0" 
                      value={offset}
                      onChange={(e) => setOffset(parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-800 rounded-xl px-4 py-3 font-bold text-amber-500 border border-gray-700 focus:border-amber-500 focus:outline-none transition-all"
                    />
                    <div className="text-[10px] text-gray-500 uppercase font-bold w-24">
                      Current Range: <br/> {offset} - {offset + count}
                    </div>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="text-sm text-gray-400 mb-3 block font-medium">Select Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          selectedCategory === cat.id 
                          ? 'bg-amber-500 border-amber-400 text-black font-bold' 
                          : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {cat.icon}
                        <span className="text-xs truncate">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStartImport}
                  disabled={isImporting}
                  className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-lg transition-all ${
                    isImporting 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      IMPORT RECIPES
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/40 p-4 rounded-2xl border border-gray-800">
                <p className="text-gray-500 text-xs font-bold uppercase mb-1 tracking-tighter">Total Imported</p>
                <p className="text-2xl font-black text-white">{results?.imported || 0}</p>
              </div>
              <div className="bg-gray-900/40 p-4 rounded-2xl border border-gray-800">
                <p className="text-gray-500 text-xs font-bold uppercase mb-1 tracking-tighter">Skipped (Dupes)</p>
                <p className="text-2xl font-black text-amber-500">{results?.skipped || 0}</p>
              </div>
            </div>
          </div>

          {/* Results/Log Column */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl h-full flex flex-col overflow-hidden">
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                  <CheckCircle className="w-5 h-5 text-green-500" /> Operation Log
                </h2>
                {isImporting && (
                  <span className="flex items-center gap-2 text-xs text-amber-500 animate-pulse font-bold">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    ACTIVE ENGINE
                  </span>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[500px] scrollbar-hide">
                {!results && !isImporting && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-30">
                    <Database className="w-16 h-16 mb-4" />
                    <p className="font-medium text-lg">No active session</p>
                    <p className="text-sm">Configure and import to see the log results here.</p>
                  </div>
                )}
                
                {isImporting && (
                  <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl text-amber-200 text-sm flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Fetching recipes from Spoonacular API and uploading to Supabase Storage...
                  </div>
                )}

                {results?.details.map((detail, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl text-xs font-medium border ${
                      detail.startsWith('Imported') 
                      ? 'bg-green-500/5 border-green-500/10 text-green-400' 
                      : 'bg-gray-800/50 border-gray-700/50 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${detail.startsWith('Imported') ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      {detail}
                    </div>
                  </div>
                ))}

                {results?.errors && results.errors > 0 && (
                  <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    {results.errors} failures occurred during import.
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-900/80 border-t border-gray-800 text-[10px] text-gray-500 flex justify-between">
                <span>SYSTEM STATUS: OPERATIONAL</span>
                <span>API LIMITS: MONITORED</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-12 p-8 border border-dashed border-gray-800 rounded-3xl text-center">
          <p className="text-gray-500 text-sm">
            Recipe data is fetched from <span className="text-white font-bold underline">Spoonacular API</span>. 
            Images are stored locally on <span className="text-white font-bold underline">Supabase CDN</span> for better performance and security.
          </p>
        </div>

    </div>
  );
}
