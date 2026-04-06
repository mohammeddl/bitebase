import { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';
import { UtensilsCrossed, Star, Zap } from 'lucide-react';
import PageAnimations from '@/components/PageAnimations';

export const metadata: Metadata = generateSEOMetadata({
  title: 'About Us | BiteBase',
  description: 'Learn about BiteBase and our culinary mission.',
});

const stats = [
  { value: '1 Million+', label: 'Food Lovers Worldwide', amber: true },
  { value: '10,000+', label: 'Officially Published Recipes', amber: false },
  { value: '98%', label: 'User Satisfaction Rate', amber: false },
  { value: '50,000+', label: 'Recipe Reviews & Ratings', amber: true },
];

const missionCards = [
  { icon: '🏆', label: 'Achievement', sub: 'Cook 2 foods today' },
  { icon: '🎥', label: 'Live Now', sub: 'Chef Mark Johnson' },
  { icon: '📖', label: "Today's Recipe", sub: 'Spaghetti Bolognese' },
  { icon: '✏️', label: 'Get Started', sub: 'Share your recipe' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <PageAnimations />

      {/* ─── Hero Banner ─── */}
      <section className="bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Rounded card banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gray-50" style={{ height: '240px' }}>
            {/* Background image — fills right 60% */}
            <div className="absolute inset-y-0 right-0 w-3/5">
              <Image
                src="/images/about/hero-pasta.jpg"
                alt="Pasta dish flat lay"
                fill
                className="object-cover"
                priority
              />
              {/* Fade to white on the left edge of image */}
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-gray-50 to-transparent" />
            </div>

            {/* Text on the left */}
            <div className="relative z-10 h-full flex items-center px-10">
              <h1 data-gsap="hero" className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                About Our<br />
                <span className="text-amber-500">Culinary</span> Stories
              </h1>
            </div>
          </div>

          {/* "Our History" pill — below the card, right-aligned */}
          <div className="flex justify-end mt-3">
            <button className="flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-full">
              Our History
              <span className="w-6 h-6 bg-white text-gray-900 rounded-full flex items-center justify-center text-xs">→</span>
            </button>
          </div>

        </div>
      </section>


      {/* ─── Mission / Belief Section ─── */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            {/* Col 1: Chef LIVE card — tall, spans full height */}
            <div data-gsap="slide-left" className="lg:col-span-3">
              <div className="relative rounded-3xl overflow-hidden h-full" style={{ minHeight: '520px' }}>
                <Image
                  src="/images/about/chef-live.jpg"
                  alt="Young chef cooking in kitchen"
                  fill
                  className="object-cover object-top"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                {/* LIVE badge */}
                <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-md tracking-wide">
                  LIVE
                </div>
                {/* 150+ badge */}
                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                  👁 150+
                </div>
                {/* Bottom text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-black text-xl leading-tight">Cook with<br />Master Chefs</p>
                </div>
              </div>
            </div>

            {/* Col 2: Full right side — text at top, 3-col row at bottom */}
            <div className="lg:col-span-9 flex flex-col gap-6">

              {/* Top: Heading + description */}
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
                  We believe in the{' '}
                  <span className="text-amber-500">transformative</span>{' '}
                  power of cooking and good food
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                  We provide a curated collection of recipes from around the world, helping you discover and master new culinary skills.
                  Our mission is to make cooking accessible, enjoyable, and inspiring for everyone.
                </p>
              </div>

              {/* Bottom row: info cards | amber testimonial | step image — staggered heights */}
              <div className="grid grid-cols-3 gap-4 items-end">

                {/* White info card — taller */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5" style={{ minHeight: '280px' }}>
                  {missionCards.map((card) => (
                    <div key={card.label} className="flex items-center gap-3">
                      <span className="text-xl w-8 shrink-0">{card.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{card.label}</p>
                        <p className="text-xs text-gray-400">{card.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Amber testimonial card — shorter */}
                <div className="bg-amber-400 rounded-2xl p-5 flex flex-col justify-between relative" style={{ minHeight: '220px' }}>
                  <div className="absolute top-4 right-4 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center text-sm">
                    ♡
                  </div>
                  <p className="font-black text-gray-900 text-lg leading-snug mt-2 pr-8">
                    &ldquo;BiteBase has always helped my cooking.&rdquo;
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      A
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Alyssia Tan</p>
                      <p className="text-xs text-gray-700">Master Chef 2022</p>
                    </div>
                  </div>
                </div>

                {/* Step image — tallest */}
                <div className="relative rounded-3xl overflow-hidden" style={{ minHeight: '360px' }}>
                  <Image
                    src="/images/about/grating-step.jpg"
                    alt="Hands grating food step by step"
                    fill
                    className="object-cover"
                  />
                  {/* Step badge */}
                  <div className="absolute top-4 right-4 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    Step #1
                  </div>
                  {/* Bottom label */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <span className="bg-white/90 text-gray-900 text-xs font-semibold px-4 py-2 rounded-full shadow flex items-center gap-1">
                      🍋 Easy to follow recipes
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ─── Stats Image Cards ─── */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-gsap="stagger" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                value: '1 Million+',
                label: 'Registered BiteBase Users',
                desc: 'A growing community of food lovers from around the world.',
                bg: '#F59E0B',
                img: '/images/about/hero-pasta.jpg',
              },
              {
                value: '10,000+',
                label: 'Officially Published Recipes',
                desc: 'Tested and verified recipes you can trust to turn out great every time.',
                bg: '#1A1A1A',
                img: '/images/home/chef-woman.jpg',
              },
              {
                value: '98%',
                label: 'User Satisfaction Rate',
                desc: 'Our users love the experience we craft for them.',
                bg: '#1A1A1A',
                img: '/images/home/step-cutting.jpg',
              },
              {
                value: '10,000+',
                label: 'Officially Published Recipes',
                desc: 'Curated, tested recipes you can trust to turn out great.',
                bg: '#F59E0B',
                img: '/images/about/chefs-team.jpg',
              },
            ].map((card) => (
              <div
                key={card.value}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
                style={{ height: '260px' }}
              >
                {/* Background image */}
                <Image
                  src={card.img}
                  alt={card.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Always-visible dark gradient at bottom */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Default visible: stat number at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5 transition-all duration-400 group-hover:opacity-0 group-hover:translate-y-2">
                  <p className="text-3xl font-black text-white leading-none">{card.value}</p>
                </div>

                {/* Hover reveal: slides up from bottom */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out p-5"
                  style={{ background: card.bg }}
                >
                  <p className="text-2xl font-black text-white leading-none mb-2">{card.value}</p>
                  <p className="text-sm font-bold text-white/90 mb-1">{card.label}</p>
                  <p className="text-xs text-white/70 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ─── Values Section — full-width image with overlay ─── */}
      <section className="relative overflow-hidden" style={{ minHeight: '360px' }}>
        {/* Background image */}
        <Image
          src="/images/about/chefs-team.jpg"
          alt="Professional chefs team"
          fill
          className="object-cover"
        />
        {/* Darker overlay */}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Play button */}
        <div className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <span className="text-gray-900 text-sm ml-0.5">▶</span>
        </div>

        {/* Text content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight max-w-md">
            Values That<br />
            <span className="text-amber-500">Shape</span> BiteBase
          </h2>
        </div>
      </section>

      {/* ─── Fun Community / Values cards ─── */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section label */}
          <p data-gsap="fade-up" className="text-xs font-bold tracking-widest text-amber-500 uppercase mb-3">Our Values</p>
          <h2 data-gsap="fade-up" className="text-3xl md:text-4xl font-black text-gray-900 mb-10">
            What We <span className="text-amber-500">Stand</span> For
          </h2>

          <div data-gsap="stagger" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                num: '01', icon: <UtensilsCrossed size={20} color="#fff" />, title: 'Recipe Discovery',
                desc: 'Explore thousands of delicious recipes carefully curated and tested for your kitchen success.',
                dark: true,
              },
              {
                num: '02', icon: <UtensilsCrossed size={20} color="#fff" />, title: 'Diverse Recipes',
                desc: 'We celebrate diverse culinary traditions from around the world, inspiring you today.',
                dark: false,
              },
              {
                num: '03', icon: <Star size={20} color="#fff" />, title: 'User-Centered',
                desc: 'Your feedback shapes our platform, ensuring a seamless and satisfying culinary journey.',
                dark: false,
              },
              {
                num: '04', icon: <Zap size={20} color="#fff" />, title: 'Innovation',
                desc: 'We constantly evolve to bring you new tools, features and inspiring culinary content.',
                dark: true,
              },
            ].map((v) => (
              <div
                key={v.title}
                className="rounded-3xl p-8 flex items-start gap-6 group hover:scale-[1.02] transition-transform duration-300"
                style={{ background: v.dark ? '#1A1A1A' : '#FFFBF5' }}
              >
                {/* Large decorative number */}
                <span
                  className="text-7xl font-black leading-none shrink-0 select-none"
                  style={{ color: v.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
                >
                  {v.num}
                </span>

                <div className="flex-1 pt-1">
                  {/* Icon pill */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-xl mb-4"
                    style={{ background: '#F59E0B' }}
                  >
                    {v.icon}
                  </div>
                  <h3
                    className="text-xl font-black mb-2 leading-tight"
                    style={{ color: v.dark ? '#FFFFFF' : '#1A1A1A' }}
                  >
                    {v.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: v.dark ? 'rgba(255,255,255,0.55)' : '#6B7280' }}
                  >
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
