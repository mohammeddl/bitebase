import { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Browse Recipes | BiteBase',
  description: 'Search and filter thousands of delicious recipes. Find the perfect dish for any occasion.',
  keywords: ['search', 'filter', 'recipes', 'cooking'],
});

const filters = ['All Types', 'Appetizers', 'Main Courses', 'International Flavors', 'Desserts & Sweets'];

const allRecipes = [
  { id: '1', title: 'Fresh Salad with Tahini Sauce', slug: 'tahini-salad', category: 'Mediterranean', reviews: '250+', difficulty: 'Easy', emoji: '🥗' },
  { id: '2', title: 'Chili con Carne with Nachos', slug: 'chili-carne', category: 'Mexican Food', reviews: '180+', difficulty: 'Medium', emoji: '🌶️' },
  { id: '3', title: 'Flat Noodles with Shrimp Veggie', slug: 'shrimp-noodles', category: 'Asian Food', reviews: '200+', difficulty: 'Medium', emoji: '🍜' },
  { id: '4', title: 'Classic Italian Beef Maltagliati', slug: 'beef-maltagliati', category: 'Italian Food', reviews: '500+', difficulty: 'Beginner Friendly', emoji: '🍝', featured: true },
  { id: '5', title: 'Ground Beef Mexican Tacos', slug: 'beef-tacos', category: 'Mexican Food', reviews: '320+', difficulty: 'Easy', emoji: '🌮' },
  { id: '6', title: 'Spicy Korean Bibimbap', slug: 'bibimbap', category: 'Korean Food', reviews: '140+', difficulty: 'Medium', emoji: '🍱' },
];

export default function SearchPage() {
  return (
    <div className="min-h-screen" style={{ background: '#FFFBF5' }}>

      {/* ─── Hero Banner ─── */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest text-amber-500 uppercase mb-4">Explore</p>
              <h1 className="text-5xl font-black text-gray-900 leading-tight">
                Explore<br /><span className="text-amber-500">Culinary</span> Insights
              </h1>
            </div>
            <div className="bg-amber-50 rounded-3xl h-44 flex items-center justify-center text-6xl">
              🥩
            </div>
          </div>

          {/* Filter pills */}
          <div className="mt-10 flex flex-wrap gap-3">
            {filters.map((f, i) => (
              <button
                key={f}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition ${
                  i === 0
                    ? 'bg-gray-900 text-white'
                    : 'bg-amber-50 text-gray-700 hover:bg-amber-100 border border-amber-100'
                }`}
              >
                {i === 0 && <span>🍽️</span>}
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Recipe Grid ─── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-gray-900">
              What to <span className="text-amber-500">Cook</span>
            </h2>
            <select className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-amber-500 bg-white">
              <option>Most Popular</option>
              <option>Newest First</option>
              <option>Highest Rated</option>
              <option>Fastest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allRecipes.map((recipe) => (
              <article
                key={recipe.id}
                className={`rounded-3xl overflow-hidden group border transition hover:shadow-lg ${
                  recipe.featured ? 'bg-amber-400 border-amber-400' : 'bg-white border-gray-100'
                }`}
              >
                {/* Image */}
                <div className={`h-48 flex items-center justify-center relative text-7xl ${
                  recipe.featured ? 'bg-amber-300' : 'bg-amber-50'
                }`}>
                  {recipe.emoji}
                  <span className="absolute top-3 right-3 bg-black/70 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    ⭐ {recipe.reviews}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-3 inline-block ${
                    recipe.featured ? 'bg-white/30 text-gray-900' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {recipe.category}
                  </span>
                  <h3 className={`font-bold text-lg mb-1 leading-snug ${recipe.featured ? 'text-gray-900' : 'text-gray-900'}`}>
                    {recipe.title}
                  </h3>
                  <p className={`text-sm mb-4 ${recipe.featured ? 'text-gray-700' : 'text-gray-400'}`}>
                    {recipe.difficulty}
                  </p>
                  <Link
                    href={`/recipe/${recipe.slug}`}
                    className="pill-btn w-full justify-center text-sm"
                  >
                    See Complete Recipe
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <button className="w-10 h-10 rounded-full border border-gray-200 hover:bg-amber-50 flex items-center justify-center text-sm font-semibold text-gray-600">←</button>
            {[1, 2, 3].map((n) => (
              <button key={n} className={`w-10 h-10 rounded-full text-sm font-bold transition ${n === 1 ? 'bg-amber-500 text-white' : 'border border-gray-200 text-gray-600 hover:bg-amber-50'}`}>
                {n}
              </button>
            ))}
            <button className="w-10 h-10 rounded-full border border-gray-200 hover:bg-amber-50 flex items-center justify-center text-sm font-semibold text-gray-600">→</button>
          </div>
        </div>
      </section>

    </div>
  );
}
