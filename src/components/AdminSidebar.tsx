'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Download, 
  User, 
  LogOut, 
  ExternalLink,
  ChefHat,
  Database
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Import Recipes', href: '/admin/import', icon: <Download size={20} /> },
    { name: 'AI Generator', href: '/admin/generate', icon: <ChefHat size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="w-72 bg-gray-950 border-r border-gray-800 flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Brand Logo */}
      <div className="p-8 pb-12">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/20">
            B
          </div>
          <div>
            <p className="text-xl font-black text-white leading-none">
              BITE<span className="text-amber-500">BASE</span>
            </p>
            <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase mt-1">
              Admin Control
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <p className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">
          Management
        </p>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/10' 
                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-black' : 'text-amber-500 group-hover:scale-110 transition-transform'}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-8">
          <p className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">
            Shortcuts
          </p>
          <Link
            href="/"
            className="flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-400 hover:bg-gray-900 hover:text-white transition-all group"
          >
            <span className="text-blue-400 group-hover:scale-110 transition-transform">
              <ExternalLink size={20} />
            </span>
            <span className="text-sm font-medium">View Client Site</span>
          </Link>
        </div>
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-gray-900">
        <div className="bg-gray-900/50 rounded-3xl p-4 border border-gray-800/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-amber-500 border border-gray-700">
              {user?.full_name?.[0]?.toUpperCase() || <User size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.full_name}</p>
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-tighter">System Admin</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <Link 
              href="/profile" 
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white p-2 rounded-lg transition"
            >
              <User size={14} /> My Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-xs text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition text-left"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
