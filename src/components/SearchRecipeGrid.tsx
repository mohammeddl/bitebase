import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { allRecipes, Recipe } from '@/lib/recipes';
import { searchRecipesByCategory, searchRecipes, type SpoonacularRecipe } from '@/lib/spoonacularAPI';
import WatchlistButton from '@/components/WatchlistButton';

gsap.registerPlugin(ScrollTrigger);

function RecipeCard({ recipe }: { recipe: Recipe | SpoonacularRecipe }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const topContentRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, { scale: 1.07, duration: 0.6, ease: 'power2.out' });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.35 });
    gsap.to(topContentRef.current, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' });
    gsap.to(tagsRef.current, { y: 0, opacity: 1, duration: 0.45, delay: 0.08, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, { scale: 1, duration: 0.5, ease: 'power2.inOut' });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
    gsap.to(topContentRef.current, { y: -20, opacity: 0, duration: 0.3 });
    gsap.to(tagsRef.current, { y: 20, opacity: 0, duration: 0.3 });
  };

  return (
    <article
      className="search-recipe-card relative rounded-3xl overflow-hidden cursor-pointer bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
      style={{ height: '360px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background image */}
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <Image 
          src={'img' in recipe ? recipe.img : recipe.image} 
          alt={recipe.title} 
          fill 
          className="object-cover" 
        />
      </div>

      {/* Always-on bottom gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

      {/* Dark hover overlay */}
      <div ref={overlayRef} className="absolute inset-0 bg-black/45" style={{ opacity: 0 }} />

      {/* Heart watchlist button — always top-right */}
      <div className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
        <WatchlistButton 
          recipeId={typeof (recipe as any).id === 'string' ? parseInt((recipe as any).id, 10) : (recipe as any).id} 
          recipeName={recipe.title}
          recipeImage={'img' in recipe ? (recipe as any).img : (recipe as any).image}
        />
      </div>

      {/* Top: title (slide down on hover) */}
      <div
        ref={topContentRef}
        className="absolute top-0 left-0 right-0 p-5"
        style={{ opacity: 0, transform: 'translateY(-20px)' }}
      >
        <h3 className="text-xl font-black text-white leading-tight">{recipe.title}</h3>
      </div>

      {/* Bottom: tags + button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-3">
        {/* Tags: slide up on hover */}
        <div
          ref={tagsRef}
          className="flex flex-wrap gap-2"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          {'tags' in recipe && recipe.tags.map((tag) => (
            <span key={tag} className="bg-white text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Button: always visible */}
        <Link
          href={`/recipe/${'slug' in recipe ? recipe.slug : recipe.id}`}
          className="flex items-center justify-between w-full bg-gray-950 hover:bg-amber-500 text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <span>See Complete Recipe</span>
          <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-base">🍳</span>
        </Link>
      </div>
    </article>
  );
}

export default function SearchRecipeGrid({
  category = 'all',
  currentPage = 1,
  onPageChange,
  searchQuery = '',
}: {
  category?: string;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  searchQuery?: string;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [recipes, setRecipes] = useState<(Recipe | SpoonacularRecipe)[]>([]);
  const [loading, setLoading] = useState(true);
  const RECIPES_PER_PAGE = 12;

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * RECIPES_PER_PAGE;
        let apiRecipes: SpoonacularRecipe[] = [];

        // If searchQuery exists, use search instead of category
        if (searchQuery.trim()) {
          apiRecipes = await searchRecipes(searchQuery, RECIPES_PER_PAGE, offset);
        } else {
          apiRecipes = await searchRecipesByCategory(category, RECIPES_PER_PAGE, offset);
        }

        if (apiRecipes.length > 0) {
          setRecipes(apiRecipes);
        } else {
          setRecipes(allRecipes.slice(offset, offset + RECIPES_PER_PAGE));
        }
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
        setRecipes(allRecipes.slice((currentPage - 1) * RECIPES_PER_PAGE, currentPage * RECIPES_PER_PAGE));
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [category, currentPage, searchQuery]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.search-recipe-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    }, gridRef);
    return () => ctx.revert();
  }, [recipes]);

  return (
    <div ref={gridRef}>
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600">Loading recipes...</div>
        </div>
      )}
      
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && recipes.length > 0 && (
        <div className="mt-10">
          {/* ── Mobile pagination ── */}
          <div className="flex sm:hidden flex-col items-center gap-4">
            {/* Arrow row */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>

              {/* Page indicator */}
              <span className="text-sm font-semibold text-gray-600">
                Page {currentPage}
              </span>

              <button
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={recipes.length < RECIPES_PER_PAGE}
                className="w-11 h-11 rounded-full bg-gray-900 hover:bg-amber-500 flex items-center justify-center text-white transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>

          {/* ── Desktop pagination ── */}
          <div className="hidden sm:flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from(
                { length: Math.max(7, Math.floor(currentPage / 5) * 5 + 5) },
                (_, i) => i + 1
              )
                .slice(Math.max(0, currentPage - 4), currentPage + 3)
                .map((n) => (
                  <button
                    key={n}
                    onClick={() => onPageChange?.(n)}
                    className={`min-w-[36px] h-9 rounded-lg text-sm font-bold transition-all ${
                      currentPage === n
                        ? 'bg-amber-500 text-white shadow-md hover:shadow-lg hover:bg-amber-600'
                        : 'text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900'
                    }`}
                  >
                    {n}
                  </button>
                ))}
            </div>

            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={recipes.length < RECIPES_PER_PAGE}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gray-900 hover:bg-amber-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
