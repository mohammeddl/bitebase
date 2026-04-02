import { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';
import Link from 'next/link';
import AuthUpdatePassword from '@/components/AuthUpdatePassword';
import PageAnimations from '@/components/PageAnimations';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Update Password | BiteBase',
  description: 'Enter your new password to secure your account.',
});

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageAnimations />
      <section className="py-16">
        <div className="mx-auto max-w-md px-4">
          <div className="mb-8">
            <Link href="/" className="text-2xl font-black text-gray-900">
              BITE<span className="text-amber-500">BASE</span>
            </Link>
            <h1 className="text-3xl font-black text-gray-900 mt-6 mb-2">Set New Password</h1>
          </div>

          <AuthUpdatePassword />
        </div>
      </section>
    </div>
  );
}
