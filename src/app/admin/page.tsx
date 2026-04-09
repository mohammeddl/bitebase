'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Database, 
  Download, 
  Users, 
  Activity, 
  ChefHat, 
  ArrowRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabaseClient';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalUsers: 0,
    recentImports: 0
  });

  useEffect(() => {
    async function fetchStats() {
      const { count: recipeCount } = await supabaseClient
        .from('recipes')
        .select('*', { count: 'exact', head: true });
      
      const { count: userCount } = await supabaseClient
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalRecipes: recipeCount || 0,
        totalUsers: userCount || 0,
        recentImports: 5 // Placeholder
      });
    }
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Recipes', value: stats.totalRecipes, icon: <ChefHat className="text-amber-500" />, color: 'bg-amber-500/10' },
    { name: 'Active Users', value: stats.totalUsers, icon: <Users className="text-blue-500" />, color: 'bg-blue-500/10' },
    { name: 'Recent Imports', value: stats.recentImports, icon: <Activity className="text-green-500" />, color: 'bg-green-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <header>
        <h1 className="text-3xl font-black text-white mb-2">
          Welcome back, <span className="text-amber-500">{user?.full_name?.split(' ')[0]}</span>!
        </h1>
        <p className="text-gray-400">Here is what is happening with BiteBase today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-gray-900/40 border border-gray-800 p-6 rounded-3xl hover:border-gray-700 transition-colors group">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{stat.name}</p>
            <p className="text-3xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Activity className="text-amber-500 w-5 h-5" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Link href="/admin/import" className="group">
            <div className="bg-linear-to-br from-amber-500 to-orange-600 p-8 rounded-3xl text-white relative overflow-hidden h-full">
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                  <Download className="w-6 h-6" /> Import New Data
                </h3>
                <p className="text-amber-100 text-sm mb-6 max-w-xs">
                  Fetch hundreds of new recipes from Spoonacular and sync them to your Supabase storage.
                </p>
                <div className="flex items-center gap-2 font-bold text-sm bg-black/20 w-fit px-4 py-2 rounded-full group-hover:bg-black/30 transition-colors">
                  Go to Importer <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <Download className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500" />
            </div>
          </Link>

          <Link href="/search" className="group">
            <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl text-white relative overflow-hidden h-full hover:border-gray-700 transition">
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-amber-500" /> Explore Recipes
                </h3>
                <p className="text-gray-400 text-sm mb-6 max-w-xs">
                  Visit the main site to browse your current collection and verify data integrity.
                </p>
                <div className="flex items-center gap-2 font-bold text-sm bg-gray-800 w-fit px-4 py-2 rounded-full group-hover:bg-gray-700 transition-colors">
                  Visit Site <ArrowRight className="w-4 h-4 text-amber-500" />
                </div>
              </div>
              <ChefHat className="absolute -right-8 -bottom-8 w-48 h-48 text-gray-800 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
            </div>
          </Link>
        </div>
      </section>

      {/* System Status */}
      <footer className="p-6 bg-gray-900/20 border border-gray-800 border-dashed rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">System Cloud Status: Operational</p>
        </div>
        <p className="text-[10px] text-gray-600">Database: Supabase | API: Spoonacular v1.0</p>
      </footer>
    </div>
  );
}
