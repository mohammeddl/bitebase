import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/seo';
import { AuthProvider } from '@/contexts/AuthContext';
import { WatchlistProvider } from '@/contexts/WatchlistContext';
import { BackgroundAudio } from '@/components/BackgroundAudio';
import JsonLd from '@/components/JsonLd';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LayoutContent from '@/components/LayoutContent';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'GSC_VERIFICATION_TOKEN_HERE',
    yandex: 'YANDEX_VERIFICATION_TOKEN_HERE',
    other: {
      'msvalidate.01': 'BING_VERIFICATION_TOKEN_HERE',
      'p:domain_verify': 'f8ddf44f08a23f4116bb8364c99c1759',
    },
  },
  icons: {
    icon: [
      { url: '/icon.png' },
      new URL('/icon.png', SITE_URL)
    ],
    shortcut: ['/icon.png'],
    apple: [
      { url: '/icon.png' },
    ],
  },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6243314131851417"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col" style={{ background: '#FFFBF5', fontFamily: "'Inter', sans-serif" }}>
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID || ''} />
        <BackgroundAudio />
        <WatchlistProvider>
          <AuthProvider>
            <LayoutContent>{children}</LayoutContent>
          </AuthProvider>
        </WatchlistProvider>
        <Analytics />
        <SpeedInsights />
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/logo.png`,
          sameAs: [
            'https://facebook.com/bitebase',
            'https://instagram.com/bitebase',
            'https://twitter.com/bitebase'
          ]
        }} />
      </body>
    </html>
  );
}
