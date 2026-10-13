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
      { name: 'لوبیا قرمز', amount: 150, quantity: 150, unit: 'گرم' },
      { name: 'لیمو عمانی', amount: 3, quantity: 3, unit: 'عدد' }
    ],
    instructions: [
      'گوشت و پیاز را تفت دهید تا طلایی شود.',
      'لوبیا و سبزی سرخ‌شده را اضافه کنید و آب جوش بریزید.',
      'اجازه دهید با حرارت ملایم به مدت ۳ ساعت کاملاً جا بیفتد.'
    ],
    servings: 4,
    baseServings: 4,
    tags: ['سنتی', 'ایرانی', 'خورشت'],
    placements: ['منوی اصلی'],
  },
  {
    id: '2',
    name: 'چلو کباب کوبیده',
    category: 'غذای سنتی',
    calories: 650,
    cookTime: '۴۵ دقیقه',
    cookingTime: '۴۵ دقیقه',
    image: '/images/kabab.jpg',
    ingredients: [
      { name: 'گوشت چرخ‌کرده گوسفندی و گوساله', amount: 500, quantity: 500, unit: 'گرم' },
      { name: 'پیاز رنده شده', amount: 150, quantity: 150, unit: 'گرم' },
      { name: 'برنج ایرانی', amount: 400, quantity: 400, unit: 'گرم' },
      { name: 'کره', amount: 50, quantity: 50, unit: 'گرم' }
    ],
    instructions: [
      'گوشت را با پیاز آب‌گرفته، نمک و فلفل خوب ورز دهید.',
      'گوشت را به سیخ بکشید و روی آتش یا در فر کباب کنید.',
      'برنج را آبکش کرده و دم بگذارید.'
    ],
    servings: 3,
    baseServings: 3,
    tags: ['سنتی', 'کباب', 'مجلسی'],
    placements: ['منوی اصلی'],
  },
  {
    id: '3',
    name: 'پیتزا پپرونی مخصوص',
    category: 'فست فود',
    calories: 780,
    cookTime: '۳۰ دقیقه',
    cookingTime: '۳۰ دقیقه',
    image: '/images/pizza.jpg',
    ingredients: [
      { name: 'خمیر پیتزا', amount: 1, quantity: 1, unit: 'عدد' },
      { name: 'سالبامی یا پپرونی', amount: 200, quantity: 200, unit: 'گرم' },
      { name: 'پنیر موزارلا رنده شده', amount: 250, quantity: 250, unit: 'گرم' },
      { name: 'سس گوجه‌فرنگی', amount: 4, quantity: 4, unit: 'قاشق غذاخوری' }
    ],
    instructions: [
      'روی خمیر پیتزا سس گوجه‌فرنگی بمالید.',
      'پنیر موزارلا و ورقه‌های پپرونی را به طور یکنواخت روی آن بچینید.',
      'در فر با دمای ۲۲۰ درجه سانتی‌گراد به مدت ۲۰ دقیقه بپزید تا پنیر طلایی شود.'
    ],
    servings: 2,
    baseServings: 2,
    tags: ['فست فود', 'پیتزا', 'ایتالیایی'],
    placements: ['فست‌فود'],
  },
  {
    id: '4',
    name: 'همبرگر ذغالی دستی',
    category: 'فست فود',
    calories: 620,
    cookTime: '۲۵ دقیقه',
    cookingTime: '۲۵ دقیقه',
    image: '/images/burger.jpg',
    ingredients: [
      { name: 'گوشت چرخ‌کرده چرب', amount: 400, quantity: 400, unit: 'گرم' },
      { name: 'نان همبرگر', amount: 2, quantity: 2, unit: 'عدد' },
      { name: 'سس مخصوص', amount: 3, quantity: 3, unit: 'قاشق غذاخوری' },
      { name: 'خیارشور و گوجه', amount: 100, quantity: 100, unit: 'گرم' }
    ],
    instructions: [
      'گوشت را شکل داده و گریل یا سرخ کنید.',
      'نان همبرگر را تست کرده و مواد را همراه سس وسط آن بچینید.'
    ],
    servings: 2,
    baseServings: 2,
    tags: ['فست فود', 'برگر'],
    placements: ['فست‌فود'],
  },
  {
    id: '5',
    name: 'ماهی قزل‌آلا گریل شده',
    category: 'غذای دریایی',
    calories: 380,
    cookTime: '۳۰ دقیقه',
    cookingTime: '۳۰ دقیقه',
    image: '/images/fish.jpg',
    ingredients: [
      { name: 'فیله ماهی قزل‌آلا', amount: 1, quantity: 1, unit: 'عدد' },
      { name: 'روغن زیتون', amount: 2, quantity: 2, unit: 'قاشق غذاخوری' },
      { name: 'لیمو ترش', amount: 1, quantity: 1, unit: 'عدد' },
      { name: 'سیر رنده شده', amount: 2, quantity: 2, unit: 'حبه' }
    ],
    instructions: [
      'ماهی را با روغن زیتون، سیر، نمک و فلفل مزه‌دار کنید.',
      'در تابه گریل یا فر به مدت ۱۵ دقیقه هر طرف را بپزید.'
    ],
    servings: 2,
    baseServings: 2,
    tags: ['دریایی', 'سلامت', 'رژیمی'],
    placements: ['منوی اصلی'],
  },
  {
    id: '6',
    name: 'سوپ جو سفید',
    category: 'پیش غذا',
    calories: 220,
    cookTime: '۵۰ دقیقه',
    cookingTime: '۵۰ دقیقه',
    image: '/images/soup.jpg',
    ingredients: [
      { name: 'جو پرک', amount: 100, quantity: 100, unit: 'گرم' },
      { name: 'هویج نگینی', amount: 1, quantity: 1, unit: 'عدد' },
      { name: 'شیر', amount: 1, quantity: 1, unit: 'فنجان' },
      { name: 'سینه مرغ پخته', amount: 150, quantity: 150, unit: 'گرم' }
    ],
    instructions: [
      'جو و هویج را با آب مرغ بپزید.',
      'شیر و مرغ ریش‌ریش شده را اضافه کرده و بگذارید جا بیفتد.'
    ],
    servings: 4,
    baseServings: 4,
    tags: ['پیش غذا', 'سوپ'],
    placements: ['پیش‌غذا'],
  },
  {
    id: '7',
    name: 'سالاد سزار با مرغ گریل',
    category: 'سالاد',
    calories: 350,
    cookTime: '۲۰ دقیقه',
    cookingTime: '۲۰ دقیقه',
    image: '/images/caesar.jpg',
    ingredients: [
      { name: 'کاهو رسمی خردشده', amount: 1, quantity: 1, unit: 'بوته' },
      { name: 'سینه مرغ گریل‌شده', amount: 200, quantity: 200, unit: 'گرم' },
      { name: 'نان تست برشته (کروزان)', amount: 50, quantity: 50, unit: 'گرم' },
      { name: 'پنیر پارمسان', amount: 40, quantity: 40, unit: 'گرم' }
    ],
    instructions: [
      'کاهو، مرغ گریل‌شده و نان تست را در ظرف مخلوط کنید.',
      'سس مخصوص سزار و پنیر پارمسان را روی آن بریزید.'
    ],
    servings: 2,
    baseServings: 2,
    tags: ['سالاد', 'رژیمی', 'پیش غذا'],
    placements: ['پیش‌غذا', 'سالاد'],
  },
  {
    id: '8',
    name: 'کیک شکلاتی خیس',
    category: 'دسر',
    calories: 520,
    cookTime: '۶۰ دقیقه',
    cookingTime: '۶۰ دقیقه',
    image: '/images/cake.jpg',
    ingredients: [
      { name: 'آرد قنادی', amount: 2, quantity: 2, unit: 'فنجان' },
      { name: 'پودر کاکائو', amount: 0.5, quantity: 0.5, unit: 'فنجان' },
      { name: 'شکر', amount: 1.5, quantity: 1.5, unit: 'فنجان' },
      { name: 'شیر', amount: 1, quantity: 1, unit: 'فنجان' }
    ],
    instructions: [
      'مواد خشک را الک کرده و با شیر و روغن مخلوط کنید.',
      'در فر با دمای ۱۸۰ درجه به مدت ۴۰ دقیقه بپزید و سس شکلاتی روی آن بریزید.'
    ],
    servings: 6,
    baseServings: 6,
    tags: ['دسر', 'شیرینی', 'شکلاتی'],
    placements: ['دسر'],
  },
  {
    id: '9',
    name: 'نوشیدنی موهیتو نعناع',
    category: 'نوشیدنی سرد',
    calories: 120,
    cookTime: '۱۰ دقیقه',
    cookingTime: '۱۰ دقیقه',
    image: '/images/mojito.jpg',
    ingredients: [
      { name: 'برگ نعناع تازه', amount: 15, quantity: 15, unit: 'برگ' },
      { name: 'لیمو ترش تازه', amount: 2, quantity: 2, unit: 'عدد' },
      { name: 'سودا یا آب گازدار', amount: 1, quantity: 1, unit: 'لیوان' },
      { name: 'یخ خردشده', amount: 1, quantity: 1, unit: 'فنجان' }
    ],
    instructions: [
      'برگ نعناع و لیمو را کمی له کنید تا عطرشان آزاد شود.',
      'یخ و آب گازدار را اضافه کرده و سرو کنید.'
    ],
    servings: 2,
    baseServings: 2,
    tags: ['نوشیدنی', 'سرد', 'خنک'],
    placements: ['نوشیدنی'],
  },
  {
    id: '10',
    name: 'چای ماسالا سنتی',
    category: 'نوشیدنی گرم',
    calories: 140,
    cookTime: '۱۵ دقیقه',
    cookingTime: '۱۵ دقیقه',
    image: '/images/masala.jpg',
    ingredients: [
      { name: 'چای سیاه', amount: 2, quantity: 2, unit: 'قاشق چای‌خوری' },
      { name: 'شیر', amount: 1, quantity: 1, unit: 'لیوان' },
      { name: 'پودر دارچین و هل', amount: 1, quantity: 1, unit: 'قاشق چای‌خوری' },
      { name: 'زنجبیل تازه', amount: 1, quantity: 1, unit: 'تکه کوچک' }
    ],
    instructions: [
      'ادویه‌ها و چای را با آب بجوشانید.',
      'شیر را اضافه کرده و اجازه دهید چند جوش بزند.'
    ],
    servings: 2,
    baseServings: 2,
    tags: ['نوشیدنی', 'گرم', 'کافه'],
    placements: ['نوشیدنی'],
  }
];

// تعریف alias برای هماهنگی با foodStore.ts
export const defaultFoods: Food[] = initialFoods;

/**
 * دریافت لیست تمام غذاها (ابتدا از Supabase، در صورت خطا یا خالی بودن از لیست محلی)
 */
export async function fetchFoodsFromSupabase(): Promise<Food[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return [...initialFoods];
    }

    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
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
    return [...initialFoods];
  }
}

/**
 * ذخیره یا به‌روزرسانی یک غذا
 */
export async function saveFoodToSupabase(food: Food): Promise<boolean> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return true;
    }

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
      console.error('Supabase save error (falling back to local):', error.message);
      return true;
    }
    return true;
  } catch (err) {
    return true;
  }
}

/**
 * حذف یک غذا
 */
export async function deleteFoodFromSupabase(foodId: string): Promise<boolean> {
  try {
    await supabase.from('foods').delete().eq('id', String(foodId));
    return true;
  } catch (err) {
    return true;
  }
}

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
    // خطا در پارس
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
