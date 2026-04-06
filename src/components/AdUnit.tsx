'use client';

import { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

export default function AdUnit({ slot, format = 'auto', className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`ad-container my-8 w-full overflow-hidden flex flex-col items-center ${className}`}>
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2 select-none">
        Sponsored Content
      </span>
      
      {/* Actual AdSense Unit */}
      <div className="w-full bg-gray-50 border border-dashed border-gray-200 rounded-3xl min-h-[100px] flex items-center justify-center relative">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-6243314131851417"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        
        {/* Placeholder text (visible if ad fails to load or during dev) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40">
           <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 text-xl mb-2">
             📢
           </div>
           <p className="text-[10px] font-bold text-gray-400">Ad Slot: {slot}</p>
        </div>
      </div>
    </div>
  );
}
