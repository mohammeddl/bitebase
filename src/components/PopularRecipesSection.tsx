'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const recipes = [
  {
    title: 'Spicy Beef Mexican Tacos',
    slug: 'spicy-beef-tacos',
    img: '/images/home/hero-food.jpg',
    desc: 'Juicy seasoned beef with the vibrant flavors of traditional Mexican cuisine.',
    tags: ['International Flavors', 'Quick & Easy', 'Mexican Food'],
  },
  {
    title: 'Caprese Salad Skewers',
    slug: 'caprese-salad-skewers',
    img: '/images/home/featured-dish.jpg',
    desc: 'Fresh mozzarella and cherry tomatoes with a drizzle of balsamic glaze.',
    tags: ['Italian Food', 'Salads', 'Quick & Easy'],
  },
  {
    title: 'Quinoa & Chickpea Buddha',
    slug: 'quinoa-chickpea-buddha',
    img: '/images/about/hero-pasta.jpg',
    desc: 'A wholesome bowl packed with plant protein and creamy tahini dressing.',
    tags: ['Healthy Bowl', 'Plant-Based', 'High Protein'],
  },
  {
    title: 'Garlic Butter Pasta Night',
    slug: 'garlic-butter-pasta',
    img: '/images/about/grating-step.jpg',
    desc: 'Simple, indulgent pasta tossed in golden garlic butter and fresh herbs.',
    tags: ['Italian', 'Comfort Food', 'Easy Dinner'],
  },
  {
    title: 'Grilled Salmon & Herbs',
    slug: 'grilled-salmon-herbs',
    img: '/images/about/chef-live.jpg',
    desc: 'Flaky salmon fillet seasoned with lemon, dill and a touch of olive oil.',
    tags: ['Seafood', 'Healthy', 'Quick Cook'],
  },
  {
    title: 'Classic Beef Burger',
    slug: 'classic-beef-burger',
    img: '/images/about/chefs-team.jpg',
    desc: 'A juicy homemade beef patty with all the classics — lettuce, tomato, cheese.',
    tags: ['American', 'Comfort Food', 'BBQ'],
  },
];

function RecipeCard({ recipe }: { recipe: typeof recipes[0] }) {
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
    <div
      className="recipe-card relative rounded-3xl overflow-hidden cursor-pointer flex-shrink-0"
      style={{ height: '420px', width: 'calc(33.333% - 16px)' }}
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

      {/* Top: title + desc (slide down on hover) */}
      <div
        ref={topContentRef}
        className="absolute top-0 left-0 right-0 p-6"
        style={{ opacity: 0, transform: 'translateY(-20px)' }}
      >
        <h3 className="text-2xl font-black text-white leading-tight mb-3">{recipe.title}</h3>
        <p className="text-white/80 text-sm leading-relaxed">{recipe.desc}</p>
      </div>

      {/* Bottom: tags + button */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-3">
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
        <Link
          href={`/recipe/${recipe.slug}`}
          className="flex items-center justify-between w-full bg-gray-950 hover:bg-amber-500 text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <span>See Complete Recipe</span>
          <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-base">🍳</span>
        </Link>
      </div>
    </div>
  );
}

export default function PopularRecipesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [current, setCurrent] = useState(0);

  const GAP = 24; // px — matches gap-6
  const CARDS_PER_VIEW = 3;
  const MAX_SLIDE = recipes.length - CARDS_PER_VIEW; // 3

  const getOffset = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return 0;
    const cardWidth = (container.offsetWidth - GAP * (CARDS_PER_VIEW - 1)) / CARDS_PER_VIEW;
    return -(index * (cardWidth + GAP));
  }, []);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, MAX_SLIDE));
    currentRef.current = clamped;
    setCurrent(clamped);
    gsap.to(trackRef.current, { x: getOffset(clamped), duration: 0.8, ease: 'power2.inOut' });
  }, [getOffset, MAX_SLIDE]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const next = currentRef.current >= MAX_SLIDE ? 0 : currentRef.current + 1;
      goTo(next);
    }, 3500);
  }, [goTo, MAX_SLIDE]);

  const handleNav = (dir: number) => {
    goTo(currentRef.current + dir);
    startTimer(); // reset timer on manual nav
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.recipe-card', {
        y: 60, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-14 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Popular <span className="text-amber-500">Recipes</span> Today
          </h2>
          <div className="flex items-center gap-3">
            {/* Prev / Next */}
            <button
              onClick={() => handleNav(-1)}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleNav(1)}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
            <Link
              href="/search"
              className="hidden sm:inline-flex items-center gap-2 bg-gray-900 hover:bg-amber-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors ml-2"
            >
              See More Recipes
            </Link>
          </div>
        </div>

        {/* Slider */}
        <div ref={containerRef} className="overflow-hidden">
          <div ref={trackRef} className="flex gap-6" style={{ willChange: 'transform' }}>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.slug} recipe={recipe} />
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: MAX_SLIDE + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); startTimer(); }}
              className={`rounded-full transition-all duration-300 ${
                current === i ? 'w-6 h-2.5 bg-amber-500' : 'w-2.5 h-2.5 bg-gray-200'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
