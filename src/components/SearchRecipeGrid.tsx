import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { allRecipes, Recipe } from '@/lib/recipes';
import { 
  searchRecipesByCategory, 
  searchRecipes, 
  type SpoonacularRecipe 
} from '@/lib/spoonacularAPI';
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
      className="search-recipe-card relative rounded-3xl overflow-hidden cursor-pointer bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
      style={{ height: '360px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/recipe/${'slug' in recipe ? recipe.slug : recipe.id}`} className="block h-full w-full">
        {/* Background image */}
        <div ref={imageRef} className="absolute inset-0 will-change-transform">
          <Image 
            src={'img' in recipe ? recipe.img : recipe.image} 
            alt={recipe.title} 
            fill 
            className="object-cover"
            unoptimized={('img' in recipe ? recipe.img : recipe.image).includes('supabase.co')}
          />
        </div>

        {/* Always-on bottom gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

        {/* Dark hover overlay */}
        <div ref={overlayRef} className="absolute inset-0 bg-black/45" style={{ opacity: 0 }} />

        {/* Top: title (slide down on hover) */}
        <div
          ref={topContentRef}
          className="absolute top-0 left-0 right-0 p-5"
          style={{ opacity: 0, transform: 'translateY(-20px)' }}
        >
          <h3 className="text-xl font-black text-white leading-tight group-hover:text-amber-400 transition-colors">{recipe.title}</h3>
          {(recipe as any).isLocal && (
            <span className="inline-block mt-2 px-3 py-1 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
              Community
            </span>
          )}
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
          <div
            className="flex items-center justify-between w-full bg-gray-950 group-hover:bg-amber-500 text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors"
          >
            <span>See Complete Recipe</span>
            <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-base">🍳</span>
          </div>
        </div>
      </Link>

      {/* Heart watchlist button — always top-right */}
      <div 
        className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <WatchlistButton 
          recipeId={typeof (recipe as any).id === 'string' ? parseInt((recipe as any).id, 10) : (recipe as any).id} 
          recipeName={recipe.title}
          recipeImage={'img' in recipe ? (recipe as any).img : (recipe as any).image}
        />
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
  
  // 70% DB (8) + 30% API (4) = 12 total
  const DB_COUNT = 8;
  const API_COUNT = 4;
  const RECIPES_PER_PAGE = DB_COUNT + API_COUNT;

  // Final fallback state
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHybridRecipes = async () => {
      setLoading(true);
      setDbError(null);
      
      const supUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

      if (!supUrl) {
        setDbError('DATABASE CONFIG MISSING: NEXT_PUBLIC_SUPABASE_URL is not set in Vercel.');
        setLoading(false);
        return;
      }

      // Safety timeout increased to 10 seconds for production resilience
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Fetch timeout hit')), 10000); 
      });

      // Independent force-clear for the loading state (safety valve)
      const forceClearTimer = setTimeout(() => {
        setLoading(false);
      }, 11000);

      try {
        const dbOffset = (currentPage - 1) * DB_COUNT;
        const apiOffset = (currentPage - 1) * API_COUNT;

        // Fetch from server-side API route (bypasses Supabase RLS)
        const dbFetchPromise = fetch(
          `/api/recipes?q=${encodeURIComponent(searchQuery)}&category=${category}&limit=${DB_COUNT}&offset=${dbOffset}`
        ).then(r => r.json()).then(j => j.recipes || []).catch(err => {
          console.error('DB API fetch failure:', err);
          return [];
        });

        // Race our data fetching against the safety timeout
        const [dbResults, apiResults] = await Promise.race([
          Promise.all([
            dbFetchPromise,
            (searchQuery.trim() 
              ? searchRecipes(searchQuery, API_COUNT, apiOffset)
              : searchRecipesByCategory(category, API_COUNT, apiOffset)
            ).catch(err => {
              console.warn('Spoonacular API failure (bypassing):', err);
              return [];
            })
          ]),
          timeoutPromise
        ]) as any[][];

        console.log(`Results Rx - DB: ${dbResults?.length || 0}, API: ${apiResults?.length || 0}`);

        // Normalize DB recipes
        const normalizedDB = (dbResults || []).map((r: any) => ({
          ...r,
          id: r.id.toString(),
          img: r.image,
          tags: [r.cuisine, r.difficulty].filter(Boolean),
          isLocal: true
        }));

        // Normalize API recipes
        const normalizedAPI = (apiResults || []).map((r: any) => ({
          ...r,
          isLocal: false
        }));

        // Combine: DB first (70%), then API (30%)
        let combined = [...normalizedDB, ...normalizedAPI];
        
        // --- RESILIENCE LOGIC: If API failed or is empty, fill with more from DB ---
        if (combined.length < RECIPES_PER_PAGE && (dbResults?.length || 0) > 0) {
          console.log(`Grid under-filled (${combined.length}/${RECIPES_PER_PAGE}). Fetching more from DB...`);
          const missingCount = RECIPES_PER_PAGE - combined.length;
          const additionalDbResults = await fetch(
            `/api/recipes?q=${encodeURIComponent(searchQuery)}&category=${category}&limit=${missingCount}&offset=${dbOffset + DB_COUNT}`
          ).then(r => r.json()).then(j => j.recipes || []).catch(() => []);

          if (additionalDbResults.length > 0) {
            const normalizedExtra = additionalDbResults.map((r: any) => ({
              ...r,
              id: r.id.toString(),
              img: r.image,
              tags: [r.cuisine, r.difficulty].filter(Boolean),
              isLocal: true
            }));
            combined = [...combined, ...normalizedExtra];
          }
        }
        
        console.log(`Final Grid Total: ${combined.length} recipes`);
        setRecipes(combined);
        
      } catch (error: any) {
        console.error('Critical failure in hybrid fetch:', error);
        const errorMsg = error.message || error.toString();
        
        // ONLY show the high-level error screen if it's a real config or block issue
        // NOT for simple timeouts (which just need more time or a retry)
        const isFatal = errorMsg.toLowerCase().includes('database') || 
                        errorMsg.toLowerCase().includes('policy') || 
                        errorMsg.toLowerCase().includes('missing');

        if (isFatal) {
          setDbError(`DB ACCESS ERROR: ${errorMsg}`);
        } else {
          console.warn('Non-fatal fetch issue (timeout/latency). Retrying with local data...');
        }

        // Recovery: fill with whatever local recipes we have immediately
        try {
          const localJson = await fetch(
            `/api/recipes?q=${encodeURIComponent(searchQuery)}&category=${category}&limit=${RECIPES_PER_PAGE}&offset=${(currentPage - 1) * RECIPES_PER_PAGE}`
          ).then(r => r.json()).catch(() => ({ recipes: [] }));
          const localOnly = localJson.recipes || [];
          if (localOnly && localOnly.length > 0) {
             const normalized = localOnly.map((r: any) => ({
              ...r,
              id: r.id.toString(),
              img: r.image,
              tags: [r.cuisine, r.difficulty].filter(Boolean),
              isLocal: true
            }));
            setRecipes(normalized);
          } else if (recipes.length === 0) {
            const staticOffset = (currentPage - 1) * RECIPES_PER_PAGE;
            setRecipes(allRecipes.slice(staticOffset, staticOffset + RECIPES_PER_PAGE));
          }
        } catch (innerErr) {
          if (recipes.length === 0) {
            const staticOffset = (currentPage - 1) * RECIPES_PER_PAGE;
            setRecipes(allRecipes.slice(staticOffset, staticOffset + RECIPES_PER_PAGE));
          }
        }
      } finally {
        console.log('--- Hybrid Fetch End ---');
        clearTimeout(forceClearTimer);
        setLoading(false);
      }
    };

    fetchHybridRecipes();
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
      {dbError && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h3 className="text-2xl font-black text-red-600 mb-2">Configuration Error</h3>
          <p className="text-gray-500 max-w-md mx-auto">{dbError}</p>
          <div className="mt-8 p-4 bg-gray-50 rounded-xl text-left text-xs font-mono text-gray-400 border border-gray-100 italic">
            Tip: Ensure NEXT_PUBLIC_SUPABASE_URL is set in your Vercel project settings.
          </div>
        </div>
      )}

      {loading && !dbError && recipes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4"></div>
          <div className="text-gray-400 font-medium animate-pulse">Finding the best recipes for you...</div>
        </div>
      )}
      
      {!loading && !dbError && recipes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-6">🍳</div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            We couldn't find any recipes matching your search. Try adjusting your filters or searching for something else!
          </p>
          <button 
            onClick={() => onPageChange?.(1)}
            className="mt-8 px-8 py-3 bg-gray-950 text-white font-bold rounded-full hover:bg-amber-500 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
      
      {(recipes.length > 0) && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-500 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
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
