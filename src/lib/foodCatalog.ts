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
 * خواندن کاتالوگ غذاها از استوریج یا لیست اولیه
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

/** تبدیل فهرست غذاها به متن JSON با هندل کردن امن خطاها */
export function serializeFoodCatalog(foods: any): string {
  try {
    return JSON.stringify(foods ?? []);
  } catch {
    return '[]';
  }
}

/**
 * افزودن یا به‌روزرسانی غذا (پشتیبانی هوشمند از هر ترتیب ورودی در ادمین)
 */
export function upsertFood(...args: any[]): Food[] {
  if (args.length === 0) return initialFoods;

  let food: Food | null = null;
  let list: Food[] = [];

  // تشخیص خودکار اینکه غذا کدام آرگومان است و لیست کدام است
  if (Array.isArray(args[0])) {
    list = args[0];
    food = args[1] && typeof args[1] === 'object' ? args[1] : null;
  } else if (typeof args[0] === 'object' && args[0] !== null) {
    food = args[0];
    list = Array.isArray(args[1]) ? args[1] : [];
  }

  // اگر غذای معتبری ارسال نشده بود
  if (!food || !food.id) {
    return list;
  }

  const existingIndex = list.findIndex((item: any) => item?.id === food.id);
  if (existingIndex === -1) {
    // افزودن غذای جدید به ابتدای لیست
    return [food, ...list];
  }

  // به‌روزرسانی غذای قبلی در صورت وجود
  return list.map((item: any) => (item?.id === food.id ? { ...item, ...food } : item));
}
