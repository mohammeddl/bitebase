'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Sparkles, Wand2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AIPromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Don't show the promo if we're already on the AI Chef page
    if (pathname === '/ai-chef') return;

    // Check if user has already dismissed it this session
    const hasClosed = sessionStorage.getItem('aiPromoClosed');
    
    if (!hasClosed) {
      // Delay the popup so it doesn't overwhelm the user immediately on load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for exit animation to finish before removing from DOM
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      sessionStorage.setItem('aiPromoClosed', 'true');
    }, 400); 
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-100 w-[calc(100vw-3rem)] sm:w-[480px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col sm:flex-row transition-all duration-500 ease-out ${
        isClosing 
          ? 'opacity-0 translate-y-8 scale-95' 
          : 'opacity-100 translate-y-0 scale-100 animate-in slide-in-from-bottom-12 fade-in zoom-in-95'
      }`}
    >
      {/* Close button */}
      <button 
        onClick={handleClose}
        className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-white sm:text-gray-900 sm:bg-gray-100 sm:hover:bg-gray-200 transition-colors backdrop-blur-sm"
      >
        <X size={16} strokeWidth={3} />
      </button>

      {/* Left side: Image */}
      <div className="relative h-40 sm:h-auto sm:w-2/5 shrink-0 overflow-hidden">
        <Image 
          src="/images/home/featured-dish.jpg" 
          alt="AI Chef Magic" 
          width={300}
          height={400}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
       
      </div>

      {/* Right side: Content */}
      <div className="p-6 sm:w-3/5 flex flex-col justify-center">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg w-fit mb-3">
          <Sparkles size={12} />
          <span className="text-[9px] font-black uppercase tracking-widest">New Feature Launch</span>
        </div>
        
        <h3 className="text-xl font-black text-gray-900 leading-tight mb-2">
          Meet Your Personal <span className="text-amber-500">AI Chef</span>
        </h3>
        
        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-5">
          Tell us what ingredients you have, and our magical AI will write a custom recipe and paint a beautiful picture of it.
        </p>

        <Link 
          href="/ai-chef"
          onClick={() => {
            // Also close it when they click the button so it doesn't follow them back everywhere
            sessionStorage.setItem('aiPromoClosed', 'true');
            setIsVisible(false);
          }}
          className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-bold text-white bg-gray-900 rounded-xl hover:bg-amber-500 transition-colors group"
        >
          Try it for Free 
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
