import axios from 'axios';
import { supabaseClient } from './supabaseClient';

// Types for Spoonacular API
export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
}

export interface SpoonacularRecipeDetail extends SpoonacularRecipe {
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  summary: string;
  cuisines: string[];
  extendedIngredients: Array<{
    original: string;
    name: string;
    amount: number;
    unit: string;
  }>;
  analyzedInstructions: Array<{
    steps: Array<{
      step: string;
      number: number;
    }>;
  }>;
  nutrition?: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
}

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
const API_URL = 'https://api.spoonacular.com/recipes';

const apiClient = axios.create({
  baseURL: API_URL,
  params: {
    apiKey: API_KEY,
  },
});

/**
 * Search recipes by query string
 */
export async function searchRecipes(
  query: string,
  number = 12,
  offset = 0
): Promise<SpoonacularRecipe[]> {
  try {
    const response = await apiClient.get('/complexSearch', {
      params: {
        query,
        number,
        offset,
        addRecipeInformation: true,
        fillIngredients: false,
      },
    });

    return response.data.results || [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
}

/**
 * Search recipes by category and query
 */
export async function searchRecipesByCategory(
  category: string,
  number = 12,
  offset = 0
): Promise<SpoonacularRecipe[]> {
  try {
    // Map category to search queries
    const categoryQueries: { [key: string]: string } = {
      all: '',
      appetizer: 'appetizer',
      main: 'main course',
      vegetarian: 'vegetarian',
      dessert: 'dessert',
      easy: 'quick and easy',
    };

    const query = categoryQueries[category] || '';

    const response = await apiClient.get('/complexSearch', {
      params: {
        query,
        number,
        offset,
        addRecipeInformation: true,
        fillIngredients: false,
      },
    });

    return response.data.results || [];
  } catch (error) {
    console.error(`Error searching recipes by category ${category}:`, error);
    return [];
  }
}

/**
 * Get recipe by ID with full details
 */
export async function getRecipeById(
  id: number
): Promise<SpoonacularRecipeDetail | null> {
  try {
    const response = await apiClient.get(`/${id}/information`, {
      params: {
        includeNutrition: true,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error);
    return null;
  }
}

/**
 * Get random recipes
 */
export async function getRandomRecipes(number = 8): Promise<SpoonacularRecipe[]> {
  try {
    const response = await apiClient.get('/random', {
      params: {
        number,
      },
    });

    return response.data.recipes || [];
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    return [];
  }
}

/**
 * Search recipes by cuisine type
 */
export async function searchByCuisine(
  cuisine: string,
  number = 12
): Promise<SpoonacularRecipe[]> {
  try {
    const response = await apiClient.get('/complexSearch', {
      params: {
        cuisine,
        number,
        addRecipeInformation: true,
      },
    });

    return response.data.results || [];
  } catch (error) {
    console.error(`Error searching by cuisine ${cuisine}:`, error);
    return [];
  }
}

/**
 * Search recipes by diet type
 */
export async function searchByDiet(
  diet: string,
  number = 12
): Promise<SpoonacularRecipe[]> {
  try {
    const response = await apiClient.get('/complexSearch', {
      params: {
        diet,
        number,
        addRecipeInformation: true,
      },
    });

    return response.data.results || [];
  } catch (error) {
    console.error(`Error searching by diet ${diet}:`, error);
    return [];
  }
}
/**
 * Search local database recipes
 */
export async function searchLocalRecipes(
  query: string,
  category: string,
  number = 8,
  offset = 0
): Promise<any[]> {
  try {
    let supabaseQuery = supabaseClient
      .from('recipes')
      .select('*');

    // Filter by search query if present
    if (query.trim()) {
      supabaseQuery = supabaseQuery.ilike('title', `%${query}%`);
    }

    // Filter by category if present
    if (category !== 'all') {
      // Map frontend categories to our DB's cuisine or title matching
      const catMap: { [key: string]: string } = {
        appetizer: 'Appetizer',
        main: 'Main Course',
        vegetarian: 'Vegetarian',
        dessert: 'Dessert',
        easy: 'Easy'
      };
      
      const mappedCat = catMap[category];
      if (mappedCat) {
        // Search in cuisine OR title OR description for the category keyword
        supabaseQuery = supabaseQuery.or(`cuisine.ilike.%${mappedCat}%,title.ilike.%${mappedCat}%,description.ilike.%${mappedCat}%`);
      }
    }

    const { data, error } = await supabaseQuery
      .range(offset, offset + number - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching local recipes:', error);
    return [];
  }
}

/**
 * Get local recipe by ID
 */
export async function getLocalRecipeById(id: string | number): Promise<any | null> {
  try {
    const { data, error } = await supabaseClient
      .from('recipes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      // Also try external_id just in case
      const { data: extData, error: extError } = await supabaseClient
        .from('recipes')
        .select('*')
        .eq('external_id', Number(id))
        .maybeSingle();
        
      if (extError || !extData) return null;
      return extData;
    }
    return data;
  } catch (error) {
    console.error(`Error fetching local recipe ${id}:`, error);
    return null;
  }
}
