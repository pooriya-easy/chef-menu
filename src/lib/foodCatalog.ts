import { supabase } from './supabaseClient';

export const foodCategories = [
  'غذای سنتی',
  'فست فود',
  'غذای دریایی',
  'پیش غذا',
  'سالاد',
  'دسر',
  'نوشیدنی سرد',
  'نوشیدنی گرم',
] as const;

export type FoodCategory =
  | (typeof foodCategories)[number]
  | 'غذای اصلی'
  | 'پیش‌غذا'
  | 'نوشیدنی'
  | string;

export interface IngredientItem {
  name: string;
  amount?: number | string;
  quantity?: number | null;
  unit: string;
}

export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  calories: any;
  cookTime?: string;
  cookingTime?: string;
  image: string;
  ingredients: IngredientItem[];
  instructions?: string[];
  servings?: number;
  baseServings?: number;
  tags?: string[];
  placements?: string[];
  [key: string]: any;
}

export function normalizeFoodText(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک');
}

export const initialFoods: Food[] = [
  {
    id: '1',
    name: 'قورمه سبزی جاافتاده',
    category: 'غذای سنتی',
    calories: 450,
    cookTime: '۱۲۰ دقیقه',
    cookingTime: '۱۲۰ دقیقه',
    image: '/images/ghormeh.jpg',
    ingredients: [
      { name: 'گوشت گوسفندی', amount: 300, quantity: 300, unit: 'گرم' },
      { name: 'سبزی قورمه', amount: 400, quantity: 400, unit: 'گرم' },
    ],
    instructions: [
      'گوشت و پیاز را تفت دهید.',
      'سبزی سرخ‌شده را اضافه کنید.',
    ],
    servings: 4,
    baseServings: 4,
    tags: ['سنتی', 'ایرانی'],
    placements: ['منوی اصلی'],
  },
];

/**
 * دریافت لیست تمام غذاها از Supabase
 */
export async function fetchFoodsFromSupabase(): Promise<Food[]> {
  try {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching foods from Supabase:', error.message);
      return [...initialFoods];
    }

    if (!data || data.length === 0) {
      return [...initialFoods];
    }

    return data.map((item: any) => ({
      ...item,
      id: String(item.id),
      cookingTime: item.cookingTime || item.cookTime || '۳۰ دقیقه',
      cookTime: item.cookTime || item.cookingTime || '۳۰ دقیقه',
      ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
      instructions: Array.isArray(item.instructions) ? item.instructions : [],
    }));
  } catch (err) {
    console.error('Supabase fetch exception:', err);
    return [...initialFoods];
  }
}

/**
 * ذخیره یا به‌روزرسانی یک غذا در دیتابیس Supabase
 */
export async function saveFoodToSupabase(food: Food): Promise<boolean> {
  try {
    const payload = {
      id: String(food.id),
      name: food.name ?? '',
      category: food.category ?? 'غذای سنتی',
      calories: String(food.calories ?? ''),
      cookingTime: food.cookingTime || food.cookTime || '',
      image: food.image ?? '',
      ingredients: food.ingredients ?? [],
      instructions: food.instructions ?? [],
    };

    const { error } = await supabase.from('foods').upsert(payload);
    if (error) {
      console.error('Error saving food to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase save exception:', err);
    return false;
  }
}

/**
 * حذف یک غذا از دیتابیس Supabase
 */
export async function deleteFoodFromSupabase(foodId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('foods').delete().eq('id', String(foodId));
    if (error) {
      console.error('Error deleting food from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase delete exception:', err);
    return false;
  }
}

/**
 * توابع کمکی سازگاری محلی
 */
export function readFoodCatalog(rawSnapshot?: any): Food[] {
  if (rawSnapshot === null || rawSnapshot === undefined) {
    return [...initialFoods];
  }

  if (Array.isArray(rawSnapshot)) {
    return rawSnapshot;
  }

  try {
    const parsed = typeof rawSnapshot === 'string' ? JSON.parse(rawSnapshot) : rawSnapshot;
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // خطا در فرمت ذخیره‌شده
  }

  return [...initialFoods];
}

export function serializeFoodCatalog(foods: any): string {
  try {
    return JSON.stringify(foods ?? []);
  } catch {
    return '[]';
  }
}

export function upsertFood(...args: any[]): Food[] {
  if (args.length === 0) return initialFoods;

  let food: Food | null = null;
  let list: Food[] = [];

  if (Array.isArray(args[0])) {
    list = args[0];
    food = args[1] && typeof args[1] === 'object' ? args[1] : null;
  } else if (typeof args[0] === 'object' && args[0] !== null) {
    food = args[0];
    list = Array.isArray(args[1]) ? args[1] : [];
  }

  if (!food || !food.id) {
    return list;
  }

  const existingIndex = list.findIndex((item: any) => item?.id === food.id);
  if (existingIndex === -1) {
    return [food, ...list];
  }

  return list.map((item: any) => (item?.id === food.id ? { ...item, ...food } : item));
}
