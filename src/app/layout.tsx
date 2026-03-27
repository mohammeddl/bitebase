import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo';
import { LenisScroll } from '@/components/LenisScroll';

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: '#FFFBF5', fontFamily: "'Inter', sans-serif" }}>

        {/* ─── Header ─── */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between gap-6">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-1 flex-shrink-0">
                <span className="text-2xl font-black tracking-tight text-gray-900">
                  BITE<span className="text-amber-500">BASE</span>
                </span>
              </Link>

              {/* Nav */}
              <nav className="hidden md:flex items-center gap-8">
                {[
                  { href: '/', label: 'HOME' },
                  { href: '/about', label: 'ABOUT' },
                  { href: '/search', label: 'RECIPES' },
                  { href: '/contact', label: 'CONTACT' },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-xs font-semibold tracking-widest text-gray-600 hover:text-amber-500 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Search + Avatar */}
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-32"
                  />
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
                  B
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ─── Page Content ─── */}
        <LenisScroll>
          <main className="flex-1">{children}</main>
        </LenisScroll>

        {/* ─── Footer ─── */}
        <footer className="bg-gray-950 text-gray-400">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

              {/* Brand Column */}
              <div>
                <p className="text-2xl font-black text-white mb-3">
                  BITE<span className="text-amber-500">BASE</span>
                </p>
                <p className="text-sm leading-relaxed mb-5">
                  Join BiteBase now and embark on a culinary journey to explore, create, and savor amazing recipes!
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    className="flex-1 bg-gray-800 text-sm text-gray-300 placeholder-gray-500 rounded-full px-4 py-2 outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button className="w-9 h-9 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center transition flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { href: '/about', label: 'About Us' },
                    { href: '/about', label: 'Our Stories' },
                    { href: '/about', label: 'Work with Us' },
                    { href: '/about', label: 'User Testimonials' },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="hover:text-amber-500 transition-colors">{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-white font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { href: '/contact', label: 'FAQ' },
                    { href: '/contact', label: 'Membership' },
                    { href: '/privacy-policy', label: 'User Policy' },
                    { href: '/contact', label: 'Customer Support' },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="hover:text-amber-500 transition-colors">{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-white font-semibold mb-4">Contact</h3>
                <ul className="space-y-2 text-sm">
                  <li>Phone: (+555) 555-1234</li>
                  <li>Email: info@bitebase.com</li>
                  <li className="flex gap-3 pt-2">
                    {['FB', 'IG', 'TW', 'YT'].map((s) => (
                      <a key={s} href="#" className="w-8 h-8 bg-gray-800 hover:bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-gray-300 hover:text-white transition">
                        {s}
                      </a>
                    ))}
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
              <p>© 2024 BiteBase. All rights reserved.</p>
              <div className="flex gap-4">
                <Link href="/privacy-policy" className="hover:text-amber-500 transition">Privacy Policy</Link>
                <Link href="/terms-of-service" className="hover:text-amber-500 transition">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
