import { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Privacy Policy | Recipe Hub',
  description: 'Read our privacy policy to understand how we handle your personal data.',
});

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <Link href="/" className="text-orange-600 hover:text-orange-700 mb-8 inline-block">
          ← Back to Home
        </Link>

        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <p className="text-gray-600 mb-6">Last updated: March 26, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Recipe Hub (&quot;we&quot; or &quot;us&quot;) operates the https://recipehub.com website. This page
              informs you of our policies regarding the collection, use, and disclosure of personal
              data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information Collection</h2>
            <p className="text-gray-700 mb-4">
              We collect information you voluntarily provide to us, such as when you contact us, sign
              up for our newsletter, or leave comments. This may include your name, email address,
              and message content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Use of Data</h2>
            <p className="text-gray-700 mb-4">
              We use the collected data for various purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in features on our Site</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information about our Service usage</li>
              <li>To monitor the effectiveness of our Service</li>
              <li>To detect, prevent, and address technical and security issues</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Security</h2>
            <p className="text-gray-700 mb-4">
              The security of your data is important to us but remember that no method of
              transmission over the Internet or method of electronic storage is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <Link href="/contact" className="text-orange-600 hover:text-orange-700">
                our contact page
              </Link>
              .
            </p>
          </section>
        </article>

        {/* AdSense Ad Placement */}
        <div className="mt-20 bg-gray-200 rounded-lg p-4 text-center text-gray-600 h-24 flex items-center justify-center">
          <span className="text-sm">Advertisement</span>
        </div>
      </div>
    </main>
  );
}
