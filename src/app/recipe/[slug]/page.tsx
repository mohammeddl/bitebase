import { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getRecipe(slug: string) {
  return {
    id: slug,
    title: 'Ground Beef Mexican Tacos',
    accentWord: 'Beef',
    slug,
    category: 'Mexican Food',
    description: 'Savor the bold and savory flavors of our Ground Beef Tacos! The impeccably seasoned ground beef, nestled in warm tortillas, creates a symphony of textures complemented by vibrant toppings like crisp lettuce, juicy tomatoes, and a dollop of zesty salsa.',
    image: '/images/recipes/tacos.jpg',
    cookTime: '10 Minutes',
    prepTime: '15 Minutes',
    servings: '4 Persons',
    difficulty: 'Intermediate Level',
    cuisine: 'Mexican Food',
    rating: 4.8,
    reviews: 124,
    tags: ['Mexican Food', 'Tacos', 'Spicy', 'Seafood', 'Featured Recipe'],
    ingredients: [
      { name: '1 lb ground beef 70-80% lean' },
      { name: '2 tbsp olive oil' },
      { name: '1 tsp smoked paprika' },
      { name: '1 tsp cumin' },
      { name: '½ tsp cayenne pepper' },
      { name: 'Salt and pepper to taste' },
      { name: '8 small flour tortillas' },
      { name: '1 cup shredded lettuce' },
      { name: '1 cup diced tomatoes' },
      { name: '½ cup chopped red onion' },
      { name: '¼ cup chopped fresh cilantro' },
      { name: '1 avocado, sliced' },
    ],
    instructions: [
      'In a clean bowl, toss the ground beef with spices olive oil, smoked paprika, cumin, cayenne pepper, salt, and pepper.',
      'Heat a skillet over medium-high heat. Add the seasoned ground beef and cook for 2-3 minutes per side until opaque.',
      'Warm the prepared flour tortillas in a dry pan or microwave. Make sure to heaten the microwave in 180 degrees for 2 minutes.',
      'Assemble tacos: Place ground beef on each tortilla, top with lettuce, tomatoes, red onion, paprika, cilantro, and avocado slices.',
      'Squeeze lime over each taco for a burst of freshness. Serve immediately and enjoy your Spicy Ground Beef Mexican Tacos!',
    ],
    nutrition: { calories: 320, protein: '25g', fat: '15g', fiber: '5g', sugars: '2g', carbs: '20g' },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  return generateSEOMetadata({
    title: `${recipe.title} Recipe | BiteBase`,
    description: recipe.description,
    keywords: [recipe.title, recipe.category, 'recipe', 'cooking', slug],
  });
}

const relatedRecipes = [
  { title: 'Salad with Tahini Sauce', slug: 'tahini-salad', reviews: '250+', emoji: '🥗' },
  { title: 'Delicious English Breakfast', slug: 'english-breakfast', reviews: '300+', emoji: '🍳' },
  { title: 'Flat Noodles with Shrimp', slug: 'shrimp-noodles', reviews: '180+', emoji: '🍜' },
];

const cookingReviews = [
  { text: 'A culinary delight that brings together perfectly seasoned beef with a medley of fresh toppings, delivering a burst of flavor in every bite. The simplicity of this recipe makes it a go-to choice.', author: 'Angeline Nguyen', date: '8 September 2023' },
];

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  return (
    <div className="min-h-screen" style={{ background: '#FFFBF5' }}>

      {/* ─── Recipe Header ─── */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-amber-500">Home</Link>
            {' '}/{' '}
            <Link href="/search" className="hover:text-amber-500">Recipes</Link>
            {' '}/{' '}
            <span className="text-gray-700">{recipe.title}</span>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-2">Let&apos;s Cook</p>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
                {recipe.title.split(recipe.accentWord).map((part, i, arr) =>
                  i < arr.length - 1
                    ? <span key={i}>{part}<span className="text-amber-500">{recipe.accentWord}</span></span>
                    : <span key={i}>{part}</span>
                )}
              </h1>

              {/* 5-col metadata bar */}
              <div className="flex flex-wrap gap-4 mt-6 mb-6">
                {[
                  { label: 'Cuisine', value: recipe.cuisine, icon: '🍴' },
                  { label: 'Servings', value: recipe.servings, icon: '👥' },
                  { label: 'Prep Time', value: recipe.prepTime, icon: '⏱️' },
                  { label: 'Cook Time', value: recipe.cookTime, icon: '🍳' },
                  { label: 'Difficulty', value: recipe.difficulty, icon: '⭐' },
                ].map((m) => (
                  <div key={m.label} className="flex items-center gap-2">
                    <span className="text-amber-500 text-lg">{m.icon}</span>
                    <div>
                      <p className="text-xs text-gray-400">{m.label}</p>
                      <p className="text-sm font-semibold text-gray-900">{m.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mb-4">{recipe.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {recipe.tags.map((tag) => (
                  <span key={tag} className="text-xs text-amber-600 hover:text-amber-700 cursor-pointer font-medium">{tag}</span>
                ))}
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-gray-900 hover:bg-amber-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition">
                  📄 Download Recipe PDF
                </button>
                <button className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-amber-500 hover:border-amber-300 transition">
                  ↗
                </button>
              </div>
            </div>

            {/* Hero image */}
            <div className="bg-amber-50 rounded-3xl h-72 flex items-center justify-center text-9xl relative">
              🌮
              <div className="absolute bottom-4 right-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3 max-w-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">👩‍🍳</div>
                <div>
                  <p className="text-xs text-gray-400">Chef</p>
                  <p className="text-sm font-bold text-gray-900">Chef Maria Rodriguez</p>
                  <Link href="#" className="text-xs text-amber-500 font-semibold">See More</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Ingredients + Instructions ─── */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Instructions */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-black text-gray-900 mb-8">
                Cooking <span className="text-amber-500">Instructions</span>
              </h2>
              <ol className="space-y-6">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-6 items-start">
                    <span className="text-3xl font-black text-amber-500 flex-shrink-0 leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-gray-600 leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ol>

              {/* Cooking Reviews */}
              <div className="mt-14">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900">
                    Cooking <span className="text-amber-500">Reviews</span>
                  </h2>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-xs hover:bg-amber-50">←</button>
                    <button className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-xs hover:bg-amber-50">→</button>
                  </div>
                </div>

                {cookingReviews.map((review, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 flex gap-6">
                    <div className="w-16 h-16 bg-amber-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">🥗</div>
                    <div>
                      <span className="text-amber-500 text-2xl font-black">&ldquo;</span>
                      <p className="text-gray-600 text-sm leading-relaxed mt-1">{review.text}</p>
                      <div className="flex items-center gap-2 mt-4">
                        <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">A</div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{review.author}</p>
                          <p className="text-xs text-gray-400">{review.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar: Ingredients + Nutrition */}
            <div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 sticky top-4">
                <h3 className="text-lg font-black text-gray-900 mb-5">Ingredients</h3>
                <ul className="space-y-2 text-sm text-gray-700 mb-6">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-1">•</span>
                      {ing.name}
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-black text-gray-900 mb-4 border-t border-gray-100 pt-4">Nutritional Info</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  {Object.entries(recipe.nutrition).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key}</span>
                      <span className="font-semibold text-gray-900">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Related Recipes ─── */}
      <section className="py-14 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-gray-900 mb-8">
            Related <span className="text-amber-500">Recipes</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedRecipes.map((r) => (
              <article key={r.slug} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition group">
                <div className="h-36 bg-amber-50 flex items-center justify-center text-6xl relative">
                  {r.emoji}
                  <span className="absolute top-2 right-2 bg-black/70 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    ⭐ {r.reviews}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-3">{r.title}</h3>
                  <Link href={`/recipe/${r.slug}`} className="pill-btn w-full justify-center text-xs">
                    See Complete Recipe →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
