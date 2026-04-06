import { Metadata } from 'next';
import { generateSEOMetadata, generateRecipeJsonLd } from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';
import PageAnimations from '@/components/PageAnimations';
import JsonLd from '@/components/JsonLd';
import { getRecipeById, searchRecipes } from '@/lib/spoonacularAPI';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getRecipe(slug: string) {
  // Try to parse slug as recipe ID
  const recipeId = parseInt(slug, 10);
  
  if (!isNaN(recipeId)) {
    try {
      const apiRecipe = await getRecipeById(recipeId);
      if (apiRecipe) {
        // Parse nutrition data from API
        const nutritionMap: { [key: string]: string } = {
          calories: 'N/A',
          protein: 'N/A',
          fat: 'N/A',
          carbs: 'N/A',
          fiber: 'N/A',
          sugars: 'N/A',
        };

        // Extract nutrition values from API response
        if (apiRecipe.nutrition?.nutrients) {
          apiRecipe.nutrition.nutrients.forEach((nutrient: any) => {
            const name = nutrient.name.toLowerCase();
            if (name.includes('calor')) {
              nutritionMap.calories = `${Math.round(nutrient.amount)} ${nutrient.unit}`;
            } else if (name.includes('protein')) {
              nutritionMap.protein = `${nutrient.amount.toFixed(1)} ${nutrient.unit}`;
            } else if (name.includes('fat') && !name.includes('saturated')) {
              nutritionMap.fat = `${nutrient.amount.toFixed(1)} ${nutrient.unit}`;
            } else if (name.includes('carbohydrate')) {
              nutritionMap.carbs = `${nutrient.amount.toFixed(1)} ${nutrient.unit}`;
            } else if (name.includes('fiber')) {
              nutritionMap.fiber = `${nutrient.amount.toFixed(1)} ${nutrient.unit}`;
            } else if (name.includes('sugar')) {
              nutritionMap.sugars = `${nutrient.amount.toFixed(1)} ${nutrient.unit}`;
            }
          });
        }

        return {
          id: apiRecipe.id,
          title: apiRecipe.title,
          slug: slug,
          description: apiRecipe.summary ? apiRecipe.summary.replace(/<[^>]*>/g, '') : 'A delicious recipe.',
          img: apiRecipe.image,
          chefImg: '/images/home/chef-woman.jpg',
          chefName: 'From Spoonacular',
          cookTime: `${apiRecipe.readyInMinutes} Minutes`,
          prepTime: `${Math.round(apiRecipe.readyInMinutes * 0.4)} Minutes`,
          servings: `${apiRecipe.servings} Persons`,
          difficulty: 'Medium Level',
          cuisine: 'International',
          rating: 4.5,
          reviews: 0,
          tags: ['Delicious', 'Tasty', 'Well Prepared'],
          ingredients: apiRecipe.extendedIngredients
            .map((ing) => ing.original)
            .slice(0, 12),
          instructions: apiRecipe.analyzedInstructions[0]
            ? apiRecipe.analyzedInstructions[0].steps.map((step) => step.step).slice(0, 8)
            : ['Follow the recipe instructions carefully.'],
          instructionImg: apiRecipe.image,
          nutrition: nutritionMap,
        };
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    }
  }

  // Fallback to mock data
  return {
    id: slug,
    title: 'Caprese Salad Skewers',
    accentWord: 'Salad',
    slug,
    category: 'Appetizers',
    description: 'Each skewer bursts with the quintessential flavors of Italy. The juicy sweetness of the cherry tomatoes pairs perfectly with the mild, milky flavor of the mozzarella. Fresh basil leaves add a fragrant and slightly peppery note, enhancing the overall taste experience. To finish, we drizzle the skewers with balsamic glaze and a pinch of salt for a light and tangy depth to every bite.',
    img: '/images/home/featured-dish.jpg',
    chefImg: '/images/home/chef-woman.jpg',
    chefName: 'Chef Isabela Rodriguez',
    cookTime: '10 Minutes',
    prepTime: '15 Minutes',
    servings: '4 Persons',
    difficulty: 'Easy Level',
    cuisine: 'Appetizers',
    rating: 4.8,
    reviews: 124,
    tags: ['International Food', 'Italian Inspired', 'Quick & Easy', 'All Dishes'],
    ingredients: [
      '16 cherry tomatoes',
      '16 mini fresh mozzarella balls',
      '16 small fresh basil leaves',
      'Balsamic glaze for drizzling',
      'Salt and pepper to taste',
      'Toothpicks or small skewers',
    ],
    instructions: [
      'Wash the cherry tomatoes and pat them dry.',
      'Thread one cherry tomato, then one mozzarella ball, and one basil leaf on to each pick or skewer.',
      'Repeat the process until all ingredients are used.',
      'Arrange the Caprese salad skewers on a serving platter.',
      'Drizzle with balsamic glaze and season with salt and pepper to taste.',
    ],
    instructionImg: '/images/home/featured-dish.jpg',
    nutrition: { calories: 95, protein: '5g', fat: '6g', carbs: '4g', fiber: '1g', sugars: '3g' },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  return generateSEOMetadata({
    title: `${recipe.title} Recipe | BiteBase`,
    description: recipe.description,
    keywords: [recipe.title, recipe.category ?? 'recipe', 'recipe', 'cooking', slug].filter(Boolean),
  });
}

async function getRelatedRecipes(recipeTitle: string) {
  try {
    // Search for related recipes using keywords from the main recipe
    const keywords = recipeTitle.split(' ')[0]; // Get first word as search term
    const results = await searchRecipes(keywords, 3, 0);
    
    return results.map((recipe) => ({
      title: recipe.title,
      slug: String(recipe.id),
      img: recipe.image,
    }));
  } catch (error) {
    console.error('Error fetching related recipes:', error);
    // Fallback to mock data
    return [
      { title: 'Spicy Beef Mexican Tacos', slug: 'spicy-beef-tacos', img: '/images/home/hero-food.jpg' },
      { title: 'Quinoa & Chickpea Buddha', slug: 'quinoa-chickpea-buddha', img: '/images/about/hero-pasta.jpg' },
      { title: 'Creamy Chicken Parmesan', slug: 'chicken-parmesan', img: '/images/about/chefs-team.jpg' },
    ];
  }
}

const cookingReviews = [
  {
    text: 'The Caprese Salad Skewers recipe was a triumph! I prepared them for a party\'s barbecue and everyone loved them. The basil was so aromatic, the mozzarella so fresh, and the skewers were the perfect size and an appropriate.',
    author: 'Michael Burns',
    date: 'July 1, 2023',
    img: '/images/home/featured-dish.jpg',
  },
];

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  const relatedRecipes = await getRelatedRecipes(recipe.title);
  const recipeJsonLd = generateRecipeJsonLd(recipe);

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={recipeJsonLd} />
      <PageAnimations />

      {/* ─── Hero Header ─── */}
      <section className="bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <p data-gsap="hero" className="text-xs text-gray-400 mb-6">
            <Link href="/" className="hover:text-amber-500">Home</Link>
            {' / '}
            <Link href="/search" className="hover:text-amber-500">Recipes</Link>
            {' / '}
            <span className="text-gray-700">{recipe.title}</span>
          </p>

          {/* Rounded hero card */}
          <div
            className="relative rounded-3xl overflow-hidden mb-6"
            style={{ background: '#F8F5F0', minHeight: '260px' }}
          >
            {/* Left: title */}
            <div className="relative z-10 flex flex-col justify-center h-full px-10 py-10 max-w-md">
              <p data-gsap="hero" className="text-xs text-gray-400 font-medium mb-2">Let&apos;s Cook</p>
              <h1 data-gsap="hero" className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                {recipe.title}
              </h1>
            </div>

            {/* Right: recipe image */}
            <div className="absolute inset-y-0 right-0 w-1/2 lg:w-3/5">
              <Image
                src={recipe.img}
                alt={recipe.title}
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-y-0 left-0 w-2/5 bg-linear-to-r from-[#F8F5F0] to-transparent" />
            </div>
          </div>

          {/* Metadata strip */}
          <div data-gsap="fade-up" className="flex flex-wrap gap-6 py-4 border-y border-gray-100 mb-8">
            {[
              { label: 'Cuisine', value: recipe.cuisine, icon: '🍴' },
              { label: 'Servings', value: recipe.servings, icon: '👥' },
              { label: 'Prep Time', value: recipe.prepTime, icon: '⏱' },
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

        </div>
      </section>

      {/* ─── Main Content ─── */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ── Left/Main Column ── */}
            <div className="lg:col-span-2">

              {/* Description + tags */}
              <div data-gsap="fade-up" className="mb-10">
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{recipe.description}</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <span key={tag} className="text-xs text-amber-600 font-medium cursor-pointer hover:underline">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ingredients (inline, 2-col) */}
              <div data-gsap="fade-up" className="mb-10">
                <h2 className="text-xl font-black text-gray-900 mb-4">Ingredients</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {recipe.ingredients.map((ing, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5 text-xs">•</span>
                      <span className="text-sm text-gray-700">{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cooking Instructions */}
              <div data-gsap="fade-up" className="mb-10">
                <h2 className="text-xl font-black text-gray-900 mb-6">
                  Cooking <span className="text-amber-500">Instructions</span>
                </h2>
                <ol className="space-y-6">
                  {recipe.instructions.map((step, i) => (
                    <li key={i} className="flex gap-5 items-start border-b border-gray-50 pb-5">
                      <span className="text-2xl font-black text-amber-500 shrink-0 leading-none w-7">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="text-gray-600 leading-relaxed text-sm">{step}</p>
                    </li>
                  ))}
                </ol>

                {/* Step image */}
                <div className="relative rounded-2xl overflow-hidden mt-8" style={{ height: '220px' }}>
                  <Image
                    src={recipe.instructionImg}
                    alt="Recipe step"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Cooking Reviews */}
              <div data-gsap="fade-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-gray-900">
                    Cooking <span className="text-amber-500">Reviews</span>
                  </h2>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 border border-amber-200 text-amber-500 rounded-full flex items-center justify-center text-xs hover:bg-amber-50">←</button>
                    <button className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-amber-600">→</button>
                  </div>
                </div>

                {cookingReviews.map((review, i) => (
                  <div key={i} className="border border-gray-100 rounded-2xl p-5 flex gap-5">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <Image src={review.img} alt="Review" fill className="object-cover" />
                    </div>
                    <div>
                      <span className="text-amber-500 text-2xl font-black leading-none">&ldquo;</span>
                      <p className="text-gray-600 text-sm leading-relaxed mt-1">{review.text}</p>
                      <div className="flex items-center gap-2 mt-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                          {review.author[0]}
                        </div>
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

            {/* ── Right Sidebar ── */}
            <div className="space-y-6">

              {/* Nutritional Info */}
              <div data-gsap="slide-right" className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-black text-gray-900 mb-4">Nutritional Info</h3>
                <div className="space-y-2">
                  {Object.entries(recipe.nutrition).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-400 capitalize">{key}</span>
                      <span className="font-semibold text-gray-900">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef card */}
              <div data-gsap="slide-right" className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center">
                <p className="text-xs text-gray-400 mb-3">Recipe by</p>
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-3">
                  <Image src={recipe.chefImg} alt={recipe.chefName} fill className="object-cover object-top" />
                </div>
                <p className="text-sm font-black text-gray-900">{recipe.chefName}</p>
                <Link href="#" className="text-xs text-amber-500 font-semibold mt-1 hover:underline">See More →</Link>
              </div>

              {/* CTA cooking card */}
              <div data-gsap="slide-right" className="relative rounded-2xl overflow-hidden" style={{ minHeight: '200px' }}>
                <Image src="/images/home/cooking-banner.jpg" alt="Let's get into cooking" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <p className="text-white font-black text-xl leading-tight mb-3">Let&rsquo;s Get<br />into Cooking!</p>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition self-start"
                  >
                    See Recipes →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Related Recipes ─── */}
      <section className="py-12 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 data-gsap="fade-up" className="text-2xl font-black text-gray-900">
              Related <span className="text-amber-500">Recipes</span>
            </h2>
            <Link
              href="/search"
              className="inline-flex items-center gap-1 border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-50 transition"
            >
              Explore More →
            </Link>
          </div>

          <div data-gsap="stagger" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedRecipes.map((r) => (
              <article
                key={r.slug}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                <Link href={`/recipe/${r.slug}`} className="block">
                  <div className="px-4 pt-4 pb-2">
                    <h3 className="text-base font-black text-gray-900 group-hover:text-amber-600 transition-colors leading-snug">{r.title}</h3>
                  </div>
                  <div className="relative mx-3 rounded-2xl overflow-hidden" style={{ height: '180px' }}>
                    <Image
                      src={r.img}
                      alt={r.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="px-3 py-3">
                    <div
                      className="flex items-center justify-between w-full bg-gray-950 group-hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors"
                    >
                      <span>See Complete Recipe</span>
                      <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">🍳</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
