import { Metadata } from 'next';
import { generateSEOMetadata, SITE_NAME } from '@/lib/seo';
import Link from 'next/link';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Mock data - replace with real data fetching
async function getCategory(slug: string) {
  return {
    slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    description: `Discover delicious ${slug} recipes. Step-by-step instructions and cooking tips for authentic ${slug} cuisine.`,
    recipeCount: 42,
  };
}

async function getCategoryRecipes(slug: string) {
  return [
    {
      id: '1',
      title: 'Classic Spaghetti Carbonara',
      slug: 'spaghetti-carbonara',
      category: slug,
      image: '/images/recipes/carbonara.jpg',
      cookTime: '20 mins',
      servings: 4,
      difficulty: 'easy',
    },
    {
      id: '2',
      title: 'Homemade Pasta with Marinara',
      slug: 'pasta-marinara',
      category: slug,
      image: '/images/recipes/marinara.jpg',
      cookTime: '35 mins',
      servings: 4,
      difficulty: 'easy',
    },
    {
      id: '3',
      title: 'Risotto ai Funghi',
      slug: 'risotto-funghi',
      category: slug,
      image: '/images/recipes/risotto.jpg',
      cookTime: '30 mins',
      servings: 4,
      difficulty: 'medium',
    },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  return generateSEOMetadata({
    title: `${category.name} Recipes | ${SITE_NAME}`,
    description: category.description,
    keywords: [category.name, 'recipes', 'cooking', slug],
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);
  const recipes = await getCategoryRecipes(slug);

  return (
    <main className="min-h-screen bg-white">
      {/* Category Header */}
      <section className="bg-gradient-to-r from-orange-50 to-red-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-orange-600 hover:text-orange-700 mb-4 inline-block">
            ← Back to Home
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{category.name} Recipes</h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">{category.description}</p>
          <p className="text-sm text-gray-500">
            Showing <strong>{recipes.length}</strong> of <strong>{category.recipeCount}</strong> recipes
          </p>
        </div>

        {/* AdSense Ad Placement */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-gray-200 rounded-lg p-4 text-center text-gray-600 h-24 flex items-center justify-center">
            <span className="text-sm">Advertisement</span>
          </div>
        </div>
      </section>

      {/* Filter & Sort Options */}
      <section className="border-b border-gray-200 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search recipes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600">
              <option>All Difficulty Levels</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600">
              <option>Latest</option>
              <option>Most Popular</option>
              <option>Quick Fixes</option>
              <option>High Rated</option>
            </select>
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <article
                key={recipe.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
              >
                <div className="bg-gray-300 h-48 flex items-center justify-center text-gray-500">
                  {recipe.image}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      {recipe.difficulty}
                    </span>
                  </div>
                  <Link href={`/recipe/${recipe.slug}`}>
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-orange-600 mb-3">
                      {recipe.title}
                    </h3>
                  </Link>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <span>⏱️ {recipe.cookTime}</span>
                    <span>🍽️ {recipe.servings} servings</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Load More */}
      <section className="py-8 text-center">
        <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition">
          Load More Recipes
        </button>
      </section>

      {/* AdSense Ad Placement - Bottom */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-200 rounded-lg p-4 text-center text-gray-600 h-24 flex items-center justify-center">
            <span className="text-sm">Advertisement</span>
          </div>
        </div>
      </section>
    </main>
  );
}
