import { Metadata } from 'next';
import { generateSEOMetadata, SITE_NAME } from '@/lib/seo';
import Link from 'next/link';
import AdUnit from '@/components/AdUnit';

export const metadata: Metadata = generateSEOMetadata({
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `Read our privacy policy to understand how ${SITE_NAME} handles your personal data and cookie usage.`,
});

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <Link href="/" className="text-amber-600 hover:text-amber-700 mb-8 inline-block font-semibold">
          ← Back to Home
        </Link>

        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{SITE_NAME} Privacy Policy</h1>
          <p className="text-gray-500 mb-10 font-medium">Last updated: April 6, 2026</p>

          <section className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-wider text-amber-500 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to <strong>{SITE_NAME}</strong>. We respect your privacy and are committed to protecting it. This Privacy Policy
              explains how we collect, use, and safeguard your information when you visit our website, including any other media form, 
              media channel, mobile website, or mobile application related or connected thereto.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-wider text-amber-500 mb-4">2. Cookies and Web Beacons</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our website uses &quot;Cookies&quot; to enhance your experience. A cookie is a small file placed on your computer&apos;s hard drive. 
              Cookies help us analyze web traffic and allow web applications to respond to you as an individual.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually 
              modify your browser setting to decline cookies if you prefer. However, this may prevent you from taking full 
              advantage of the website.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-wider text-amber-500 mb-4">3. Google AdSense & DoubleClick Cookie</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Google, as a third-party vendor, uses cookies to serve ads on our site. Google&apos;s use of the DoubleClick cookie enables 
              it and its partners to serve ads to our users based on their visit to our site or other sites on the Internet.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Users may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting the 
              <a href="https://www.google.com/ads/preferences/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline mx-1">
                Google Ads Settings
              </a> page.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-wider text-amber-500 mb-4">4. Information Collection</h2>
            <p className="text-gray-700 leading-relaxed">
              We collect information you voluntarily provide to us, such as when you contact us, sign
              up for our newsletter, or leave comments. This may include your name, email address,
              and any dietary preferences you share with our AI Chef.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-wider text-amber-500 mb-4">5. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us via 
              <Link href="/contact" className="text-amber-600 hover:underline mx-1 font-semibold">
                our contact page
              </Link>.
            </p>
          </section>
        </article>

        {/* AdSense Ad Placement Placeholder */}
        <div className="mt-20 bg-gray-50 border border-dashed border-gray-200 rounded-4xl p-8 text-center text-gray-400 min-h-[120px] flex flex-col items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Sponsored Content</span>
          <div className="w-full h-px bg-gray-100 max-w-[100px] mb-2" />
          <span className="text-xs font-medium italic">Advertisement area will appear here</span>
        </div>
      </div>
    </main>
  );
}
