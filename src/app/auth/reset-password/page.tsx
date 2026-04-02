import { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';
import Link from 'next/link';
import AuthResetPassword from '@/components/AuthResetPassword';
import PageAnimations from '@/components/PageAnimations';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Reset Password | BiteBase',
  description: 'Request a password reset link for your account.',
});

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageAnimations />
      <section className="py-16">
        <div className="mx-auto max-w-md px-4">
          <div className="mb-8">
            <Link href="/" className="text-2xl font-black text-gray-900">
              BITE<span className="text-amber-500">BASE</span>
            </Link>
            <h1 className="text-3xl font-black text-gray-900 mt-6 mb-2">Reset Password</h1>
          </div>

          <AuthResetPassword />

          <p className="text-center text-sm text-gray-600 mt-6">
            Remembered your password?{' '}
            <Link href="/auth/login" className="font-semibold text-amber-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
