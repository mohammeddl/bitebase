import { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';
import Link from 'next/link';
import AuthSignUp from '@/components/AuthSignUp';
import PageAnimations from '@/components/PageAnimations';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Sign Up | BiteBase',
  description: 'Create your BiteBase account to save your favorite recipes.',
});

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageAnimations />
      <section className="py-16">
        <div className="mx-auto max-w-md px-4">
          <div className="mb-8">
            <Link href="/" className="text-2xl font-black text-gray-900">
              BITE<span className="text-amber-500">BASE</span>
            </Link>
            <h1 className="text-3xl font-black text-gray-900 mt-6 mb-2">Create Account</h1>
            <p className="text-gray-500">Join us to save your favorite recipes</p>
          </div>

          <AuthSignUp />

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-amber-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
