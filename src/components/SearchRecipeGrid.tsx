'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { allRecipes } from '@/lib/recipes';
import WatchlistButton from '@/components/WatchlistButton';

gsap.registerPlugin(ScrollTrigger);

function RecipeCard({ recipe }: { recipe: typeof allRecipes[0] }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const topContentRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, { scale: 1.07, duration: 0.6, ease: 'power2.out' });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.35 });
    gsap.to(topContentRef.current, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' });
    gsap.to(tagsRef.current, { y: 0, opacity: 1, duration: 0.45, delay: 0.08, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, { scale: 1, duration: 0.5, ease: 'power2.inOut' });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
    gsap.to(topContentRef.current, { y: -20, opacity: 0, duration: 0.3 });
    gsap.to(tagsRef.current, { y: 20, opacity: 0, duration: 0.3 });
  };

  return (
    <article
      className="search-recipe-card relative rounded-3xl overflow-hidden cursor-pointer bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
      style={{ height: '360px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background image */}
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <Image src={recipe.img} alt={recipe.title} fill className="object-cover" />
      </div>

      {/* Always-on bottom gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

      {/* Dark hover overlay */}
      <div ref={overlayRef} className="absolute inset-0 bg-black/45" style={{ opacity: 0 }} />

      {/* Heart watchlist button — always top-right */}
      <div className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
        <WatchlistButton slug={recipe.slug} />
      </div>

      {/* Top: title (slide down on hover) */}
      <div
        ref={topContentRef}
        className="absolute top-0 left-0 right-0 p-5"
        style={{ opacity: 0, transform: 'translateY(-20px)' }}
      >
        <h3 className="text-xl font-black text-white leading-tight">{recipe.title}</h3>
      </div>

      {/* Bottom: tags + button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-3">
        {/* Tags: slide up on hover */}
        <div
          ref={tagsRef}
          className="flex flex-wrap gap-2"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          {recipe.tags.map((tag) => (
            <span key={tag} className="bg-white text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Button: always visible */}
        <Link
          href={`/recipe/${recipe.slug}`}
          className="flex items-center justify-between w-full bg-gray-950 hover:bg-amber-500 text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <span>See Complete Recipe</span>
          <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-base">🍳</span>
        </Link>
      </div>
    </article>
  );
}

export default function SearchRecipeGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.search-recipe-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={gridRef}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10">

        {/* ── Mobile pagination ── */}
        <div className="flex sm:hidden flex-col items-center gap-4">
          {/* Arrow row */}
          <div className="flex items-center gap-4">
            <button className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors text-lg">
              ←
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className={`rounded-full transition-all duration-300 ${
                    n === 1 ? 'w-6 h-2.5 bg-amber-500' : 'w-2.5 h-2.5 bg-gray-200'
                  }`}
                  aria-label={`Page ${n}`}
                />
              ))}
            </div>

            <button className="w-11 h-11 rounded-full bg-gray-900 hover:bg-amber-500 flex items-center justify-center text-white transition-colors text-lg">
              →
            </button>
          </div>

          {/* Load more pill */}
          <button className="w-full max-w-xs flex items-center justify-center gap-2 border border-gray-200 rounded-full text-sm font-semibold text-gray-600 py-3 hover:bg-gray-50 transition-colors">
            Load More Recipes
          </button>
        </div>

        {/* ── Desktop pagination ── */}
        <div className="hidden sm:flex items-center justify-between">
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-full text-sm font-semibold text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors">
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                  n === 1
                    ? 'bg-amber-500 text-white scale-110'
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-amber-500 text-white rounded-full text-sm font-semibold transition-colors">
            Next →
          </button>
        </div>

      </div>

    </div>
  );
}
