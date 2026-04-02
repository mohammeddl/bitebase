import { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';
import Link from 'next/link';
import AuthLogin from '@/components/AuthLogin';
import PageAnimations from '@/components/PageAnimations';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Sign In | BiteBase',
  description: 'Sign in to your BiteBase account.',
});

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageAnimations />
      <section className="py-16">
        <div className="mx-auto max-w-md px-4">
          <div className="mb-8">
            <Link href="/" className="text-2xl font-black text-gray-900">
              BITE<span className="text-amber-500">BASE</span>
            </Link>
            <h1 className="text-3xl font-black text-gray-900 mt-6 mb-2">Welcome Back</h1>
            <p className="text-gray-500">Sign in to access your saved recipes</p>
          </div>

          <AuthLogin />

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="font-semibold text-amber-500 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
