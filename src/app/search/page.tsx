import { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';
import Image from 'next/image';
import PageAnimations from '@/components/PageAnimations';
import SearchRecipeGrid from '@/components/SearchRecipeGrid';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Browse Recipes | BiteBase',
  description: 'Search and filter thousands of delicious recipes. Find the perfect dish for any occasion.',
  keywords: ['search', 'filter', 'recipes', 'cooking'],
});

const categories = [
  { label: 'All Types', active: true },
  { label: 'Appetizers', active: false },
  { label: 'Main Courses', active: false },
  { label: 'Vegetarian Delights', active: false },
  { label: 'International Flavors', active: false },
  { label: 'Desserts & Sweets', active: false },
];

export default function SearchPage() {
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

      {/* ─── What to Cook + Filters ─── */}
      <section className="pt-10 pb-4 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 data-gsap="fade-up" className="text-2xl font-black text-gray-900 text-center mb-6">
            What <span className="text-amber-500">to</span> Cook?
          </h2>
          <div data-gsap="stagger" className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.label}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  cat.active
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-700'
                }`}
              >
                {cat.active && <span className="w-2 h-2 bg-amber-400 rounded-full" />}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Recipe Grid (GSAP hover) ─── */}
      <section className="pb-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SearchRecipeGrid />
        </div>
      </section>
    </div>
  );
}
