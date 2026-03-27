import { Metadata } from 'next';
import { generateSEOMetadata, SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';
import { User, UtensilsCrossed, Heart, Trophy, Tv, BookOpen } from 'lucide-react';
import PopularRecipesSection from '@/components/PopularRecipesSection';
import PageAnimations from '@/components/PageAnimations';

export const metadata: Metadata = generateSEOMetadata({
  title: `${SITE_NAME} - Discover Amazing Recipes`,
  description: SITE_DESCRIPTION,
  keywords: ['recipes', 'cooking', 'food', 'cuisine', 'culinary'],
});

const features = [
  {
    icon: <User size={18} />,
    title: 'User-Centered',
    desc: 'Your feedback shapes our platform, ensuring a seamless and satisfying culinary journey.',
  },
  {
    icon: <UtensilsCrossed size={18} />,
    title: 'Diverse Recipes',
    desc: 'We celebrate diverse culinary traditions from around the world, inspiring you today.',
  },
  {
    icon: <Heart size={18} />,
    title: 'Fun Community',
    desc: 'We foster a vibrant foodie community where joy comes from sharing recipes with us.',
  },
];

const missionItems = [
  { icon: <Trophy size={16} />, label: 'Achievement', sub: 'Cook 2 foods today' },
  { icon: <Tv size={16} />, label: 'Live Now', sub: 'Chef Mark Johnson' },
  { icon: <BookOpen size={16} />, label: "Today's Recipe", sub: 'Spaghetti Bolognese' },
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
                  href="/search"
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:border-gray-900 font-semibold py-3 px-6 rounded-full transition-colors text-sm"
                >
                  Get Our Mobile App
                  <span className="text-xs">↓</span>
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
            <div data-gsap="fade-in" className="lg:w-72 border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <Image
                  src="/images/home/featured-dish.jpg"
                  alt="Featured recipe"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Featured</p>
                <p className="text-sm font-black text-gray-900 leading-tight mb-1">
                  Salisbury Steak and Asparagus
                </p>
                {/* Audio waveform decoration */}
                <div className="flex items-center gap-1 my-2">
                  {[3,5,8,6,9,5,4,7,5,3,6,8,4].map((h, i) => (
                    <div key={i} className="w-0.5 bg-gray-300 rounded-full" style={{ height: `${h}px` }} />
                  ))}
                  <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center ml-1 shrink-0">
                    <span className="text-white text-[8px]">▶</span>
                  </div>
                </div>
                <Link href="/search" className="text-xs text-amber-500 font-semibold hover:underline">
                  See Recipe →
                </Link>
              </div>
            </div>

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

            {/* Col 4: LIVE chef image card — tallest */}
            <div className="relative rounded-3xl overflow-hidden" style={{ minHeight: '360px' }}>
              <Image
                src="/images/home/chef-woman.jpg"
                alt="Cook with master chefs"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                <span className="text-white text-xs font-bold">LIVE</span>
              </div>
              <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                👁 100+
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white font-black text-lg leading-tight">Cook with<br />Master Chefs</p>
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

              {/* Top-right: community card */}
              <div className="flex justify-end">
                <div className="bg-white rounded-2xl shadow-md px-4 py-3 flex flex-col gap-2 min-w-[180px]">
                  <p className="text-xs font-black text-gray-900">Join Our Community</p>
                  <p className="text-xs text-gray-400">1,000+ Members</p>
                  <div className="flex items-center">
                    {['#E0C3A0', '#C8A882', '#B08558'].map((c, i) => (
                      <span
                        key={i}
                        className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: c, marginLeft: i > 0 ? '-6px' : '0' }}
                      >
                        {['A', 'B', 'C'][i]}
                      </span>
                    ))}
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: '#F59E0B', marginLeft: '-6px' }}
                    >
                      +
                    </span>
                  </div>
                </div>
              </div>

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
                    Share Your Recipe
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
              <p className="text-gray-400">Join our community and get exclusive recipes weekly.</p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email address..."
                className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
              <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-full transition whitespace-nowrap">
                Join Now
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
