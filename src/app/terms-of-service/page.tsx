import { Metadata } from 'next';
import { generateSEOMetadata, SITE_NAME } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEOMetadata({
  title: `Terms of Service | ${SITE_NAME}`,
  description: `Read the terms of service for using ${SITE_NAME}.`,
});

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <Link href="/" className="text-amber-600 hover:text-amber-700 mb-8 inline-block font-semibold">
          ← Back to Home
        </Link>

        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">{SITE_NAME} Terms of Service</h1>

          <p className="text-gray-500 mb-8 font-medium">Last updated: April 6, 2026</p>

          <section className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-wider text-amber-500 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using <strong>{SITE_NAME}</strong>, you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to abide by the above, please
              do not use this service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-wider text-amber-500 mb-4">2. Use License</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials on {SITE_NAME}
              for personal, non-commercial transitory viewing only. This is the grant of a license,
              not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software on {SITE_NAME}</li>
              <li>Remove any copyright or other proprietary notations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-wider text-amber-500 mb-4">3. Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              The materials on {SITE_NAME} are provided on an &quot;as is&quot; basis. {SITE_NAME} makes no
              warranties, expressed or implied, and hereby disclaims and negates all other warranties
              including, without limitation, implied warranties or conditions of merchantability,
              fitness for a particular purpose, and non-infringement.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-wider text-amber-500 mb-4">4. Limitations</h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall {SITE_NAME} or its suppliers be liable for any damages (including,
              without limitation, damages for loss of data or profit, or due to business interruption)
              arising out of the use or inability to use the materials on {SITE_NAME}.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-wider text-amber-500 mb-4">5. Accuracy of Materials</h2>
            <p className="text-gray-700 leading-relaxed">
              The materials appearing on {SITE_NAME} could include technical, typographical, or
              photographic errors. {SITE_NAME} does not warrant that any of the materials on its
              website are accurate, complete, or current.
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
