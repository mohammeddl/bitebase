import { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: "AI Chef - Digital Alchemy",
  description: "No ingredients? No problem. Use our AI Chef magic to generate delicious recipes from whatever you have in your kitchen.",
});

export default function AIChefLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
