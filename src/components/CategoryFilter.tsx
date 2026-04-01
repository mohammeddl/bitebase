'use client';

import { useState } from 'react';

export interface Category {
  label: string;
  value: string;
}

export const CATEGORIES: Category[] = [
  { label: 'All Types', value: 'all' },
  { label: 'Appetizers', value: 'appetizer' },
  { label: 'Main Courses', value: 'main' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Desserts', value: 'dessert' },
  { label: 'Quick & Easy', value: 'easy' },
];

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
  activeCategory: string;
}

export default function CategoryFilter({ onCategoryChange, activeCategory }: CategoryFilterProps) {
  return (
    <div data-gsap="stagger" className="flex flex-wrap justify-center gap-3 mb-10">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onCategoryChange(cat.value)}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            activeCategory === cat.value
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-700'
          }`}
        >
          {activeCategory === cat.value && <span className="w-2 h-2 bg-amber-400 rounded-full" />}
          {cat.label}
        </button>
      ))}
    </div>
  );
}
