'use client';

import { useState } from 'react';
import Image from 'next/image';
import PageAnimations from '@/components/PageAnimations';
import SearchRecipeGrid from '@/components/SearchRecipeGrid';
import CategoryFilter from '@/components/CategoryFilter';

export default function SearchPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-white">
      <PageAnimations />

      {/* ─── Hero Banner ─── */}
      <section className="bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{ background: '#F8F5F0', minHeight: '200px' }}
          >
            <div className="relative z-10 flex flex-col justify-center h-full px-10 py-12 max-w-sm">
              <h1 data-gsap="hero" className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Explore<br />
                <span className="text-amber-500">Culinary</span> Insight
              </h1>
            </div>
            <div className="absolute inset-y-0 right-0 w-1/2 lg:w-3/5">
              <Image
                src="/images/home/hero-food.jpg"
                alt="Explore recipes"
                fill
                className="object-cover object-left"
                priority
              />
              <div className="absolute inset-y-0 left-0 w-2/5 bg-linear-to-r from-[#F8F5F0] to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── What to Cook + Search + Filters ─── */}
      <section className="pt-10 pb-4 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 data-gsap="fade-up" className="text-2xl font-black text-gray-900 text-center mb-8">
            What <span className="text-amber-500">to</span> Cook?
          </h2>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for recipes..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-5 py-3 pl-12 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>

          {/* Category Filter */}
          {!searchQuery && (
            <CategoryFilter onCategoryChange={handleCategoryChange} activeCategory={activeCategory} />
          )}
        </div>
      </section>

      {/* ─── Recipe Grid (GSAP hover) ─── */}
      <section className="pb-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SearchRecipeGrid
            category={activeCategory}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            searchQuery={searchQuery}
          />
        </div>
      </section>
    </div>
  );
}
