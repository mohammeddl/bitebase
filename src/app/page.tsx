import { Metadata } from 'next';
import { generateSEOMetadata, SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';
import { UtensilsCrossed, Heart, Trophy, BookOpen } from 'lucide-react';
import PopularRecipesSection from '@/components/PopularRecipesSection';
import PageAnimations from '@/components/PageAnimations';
import FeaturedRecipeCard from '@/components/FeaturedRecipeCard';
import NewsletterForm from '@/components/NewsletterForm';
export const metadata: Metadata = generateSEOMetadata({
  title: `${SITE_NAME} - Discover Amazing Recipes`,
  description: SITE_DESCRIPTION,
  keywords: ['recipes', 'cooking', 'food', 'cuisine', 'culinary'],
});

const features = [
  {
    icon: <Heart size={18} />,
    title: 'Diverse Recipes',
    desc: 'Explore thousands of recipes celebrating culinary traditions from around the world.',
  },
  {
    icon: <UtensilsCrossed size={18} />,
    title: 'Easy to Follow',
    desc: 'Step-by-step instructions and clear ingredients make cooking simple for everyone.',
  },
  {
    icon: <Trophy size={18} />,
    title: 'Tested & Trusted',
    desc: 'Every recipe has been verified and tested to ensure perfect results every time.',
  },
];

const missionItems = [
  { icon: <Trophy size={16} />, label: 'Achievement', sub: 'Cook 2 foods today' },
  { icon: <BookOpen size={16} />, label: "Today's Recipe", sub: 'Spaghetti Bolognese' },
  { icon: <UtensilsCrossed size={16} />, label: 'Quick Tips', sub: 'Master new techniques' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <PageAnimations />

      {/* ─── Hero Banner ─── */}
      <section className="bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Rounded hero card */}
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{ background: '#F8F5F0', minHeight: '380px' }}
          >
            {/* Left: text content */}
            <div className="relative z-10 flex flex-col justify-center h-full px-10 py-14 max-w-lg">
              <h1 data-gsap="hero" className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-4">
                Adventure<br />
                of <span className="text-amber-500">Delicacies</span>
              </h1>
              <p data-gsap="hero" className="text-gray-500 text-base mb-8 leading-relaxed">
                Unlock a world of variety culinary recipes and unleash your inner chef the easy way with BiteBase.
              </p>
              <div data-gsap="hero" className="flex flex-wrap gap-3">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-amber-500 text-white font-semibold py-3 px-6 rounded-full transition-colors text-sm"
                >
                  Explore Recipes
                  <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">▶</span>
                </Link>
                <Link
                  href="/ai-chef"
                  className="relative inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:border-gray-900 font-semibold py-3 px-6 rounded-full transition-colors text-sm group"
                >
                  Try AI Chef
                  <span className="text-xs">🪄</span>
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-amber-500 text-[8px] font-black text-white rounded-full leading-none shadow-sm group-hover:scale-110 transition-transform">
                    NEW
                  </span>
                </Link>
              </div>
            </div>

            {/* Right: food image — absolutely positioned */}
            <div className="absolute inset-y-0 right-0 w-1/2 lg:w-3/5">
              <Image
                src="/images/home/hero-food.jpg"
                alt="Delicious food"
                fill
                className="object-cover object-left"
                priority
              />
              {/* Fade left edge into card background */}
              <div className="absolute inset-y-0 left-0 w-2/5 bg-linear-to-r from-[#F8F5F0] to-transparent" />
            </div>
          </div>

        </div>
      </section>

      {/* ─── Feature strip + Featured card ─── */}
      <section className="py-8 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">

            {/* 3 feature columns */}
            <div data-gsap="stagger" className="flex-1 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
              {features.map((f) => (
                <div key={f.title} className="flex flex-col gap-3 p-6">
                  <span className="text-gray-400">{f.icon}</span>
                  <h3 className="font-bold text-gray-900 text-sm">{f.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Featured recipe card */}
            <FeaturedRecipeCard />

          </div>
        </div>
      </section>
      <PopularRecipesSection />

      {/* ─── Become a true chef ─── */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Centered heading */}
          <div data-gsap="fade-up" className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              Become a true <span className="text-amber-500">chef</span><br />with our recipes.
            </h2>
            <p className="text-gray-400 mt-4 text-sm max-w-sm mx-auto leading-relaxed">
              We are a home to variety of recipes worldwide for you to learn.
            </p>
          </div>

          {/* 4-column staggered cards */}
          <div data-gsap="stagger" className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-end">

            {/* Col 1: Step image card */}
            <div className="relative rounded-3xl overflow-hidden" style={{ minHeight: '280px' }}>
              <Image
                src="/images/home/step-cutting.jpg"
                alt="Easy step-by-step recipes"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 right-4 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                Step #1
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <span className="bg-white/90 text-gray-900 text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1">
                  🍋 Easy to follow recipes
                </span>
              </div>
            </div>

            {/* Col 2: Amber testimonial card */}
            <div
              className="rounded-3xl p-6 flex flex-col justify-between relative"
              style={{ background: '#F59E0B', minHeight: '320px' }}
            >
              <div className="absolute top-4 right-4 w-7 h-7 bg-white/30 rounded-full flex items-center justify-center text-white text-sm">
                ♡
              </div>
              <p className="font-black text-gray-900 text-xl leading-tight mt-8">
                &ldquo;Cooking has<br />never been<br />this easy!&rdquo;
              </p>
              <div className="flex items-center gap-2 mt-6">
                <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  M
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Marsha Rianty</p>
                  <p className="text-xs text-gray-700">Master Chef 2023</p>
                </div>
              </div>
            </div>

            {/* Col 3: Info cards */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-5" style={{ minHeight: '260px' }}>
              {missionItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center shrink-0">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Col 4: Featured recipe tips card — tallest */}
            <div className="relative rounded-3xl overflow-hidden" style={{ minHeight: '360px' }}>
              <Image
                src="/images/home/chef-woman.jpg"
                alt="Quick recipe tips"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Quick Tips
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white font-black text-lg leading-tight">Master Recipe<br />Techniques</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Let's Get Into Cooking CTA ─── */}
      <section className="py-10 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-gsap="scale" className="relative rounded-3xl overflow-hidden" style={{ minHeight: '240px' }}>

            {/* Full-width kitchen image */}
            <Image
              src="/images/home/cooking-banner.jpg"
              alt="Chef cooking in kitchen"
              fill
              className="object-cover object-center"
            />

            {/* Dark overlay so text is readable */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content on top of image */}
            <div className="relative z-10 flex flex-col justify-between h-full px-10 py-8" style={{ minHeight: '240px' }}>



              {/* Bottom: heading + buttons */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-8">
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight max-w-xs">
                  Let&rsquo;s Get<br />Into Cooking!
                </h2>
                <div className="flex gap-3">
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 bg-gray-900 hover:bg-amber-500 text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors"
                  >
                    Explore Recipes
                    <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">→</span>
                  </Link>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white hover:text-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors border border-white/50"
                  >
                    Browse All Recipes
                    <span className="text-xs">→</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* ─── Newsletter CTA ─── */}
      <section className="py-16 bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black text-white mb-3">
                Your Ultimate Place<br />to <span className="text-amber-500">Better Cooking</span>
              </h2>
              <p className="text-gray-400">Get the best recipes delivered to your inbox every week.</p>
            </div>
            <div className="flex gap-3 w-full">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
