// Shared recipe data — used by SearchRecipeGrid, PopularRecipesSection, Watchlist, etc.

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  img: string;
  tags: string[];
  desc?: string;
}

export const allRecipes: Recipe[] = [
  {
    id: '1',
    slug: 'spicy-beef-tacos',
    title: 'Spicy Beef Mexican Tacos',
    img: '/images/home/hero-food.jpg',
    tags: ['Mexican Food', 'Quick & Easy'],
    desc: 'Juicy seasoned beef with the vibrant flavors of traditional Mexican cuisine.',
  },
  {
    id: '2',
    slug: 'caprese-salad-skewers',
    title: 'Caprese Salad Skewers',
    img: '/images/home/featured-dish.jpg',
    tags: ['Italian', 'Salads'],
    desc: 'Fresh mozzarella and cherry tomatoes with a drizzle of balsamic glaze.',
  },
  {
    id: '3',
    slug: 'quinoa-chickpea-buddha',
    title: 'Quinoa & Chickpea Buddha',
    img: '/images/about/hero-pasta.jpg',
    tags: ['Healthy', 'Plant-Based'],
    desc: 'A wholesome bowl packed with plant protein and creamy tahini dressing.',
  },
  {
    id: '4',
    slug: 'chicken-parmesan',
    title: 'Creamy Chicken Parmesan',
    img: '/images/about/chefs-team.jpg',
    tags: ['Italian', 'Comfort Food'],
    desc: 'Crispy chicken topped with marinara sauce and melted mozzarella cheese.',
  },
  {
    id: '5',
    slug: 'mango-smoothie',
    title: 'Mango Tango Smoothie',
    img: '/images/about/grating-step.jpg',
    tags: ['Drinks', 'Healthy'],
    desc: 'Tropical mango blended to perfection with yogurt and fresh lime.',
  },
  {
    id: '6',
    slug: 'chocolate-lava-cake',
    title: 'Chocolate Lava Cake',
    img: '/images/home/chef-woman.jpg',
    tags: ['Desserts', 'Baking'],
    desc: 'Rich molten chocolate cake with a gooey center — pure indulgence.',
  },
  {
    id: '7',
    slug: 'spinach-feta',
    title: 'Spinach and Feta Stuffed',
    img: '/images/about/chef-live.jpg',
    tags: ['Vegetarian', 'Mediterranean'],
    desc: 'Delicious stuffed peppers with wilted spinach and crumbled feta.',
  },
  {
    id: '8',
    slug: 'thai-curry',
    title: 'Thai Green Chicken Curry',
    img: '/images/home/step-cutting.jpg',
    tags: ['Asian', 'Spicy'],
    desc: 'Fragrant green curry with tender chicken and fresh Thai basil.',
  },
  {
    id: '9',
    slug: 'berry-parfait',
    title: 'Berry Bliss Delight Parfait',
    img: '/images/home/cooking-banner.jpg',
    tags: ['Desserts', 'Fresh'],
    desc: 'Layers of Greek yogurt, granola and fresh mixed berries.',
  },
];
