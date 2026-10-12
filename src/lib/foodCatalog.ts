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

// پشتیبانی از همه دسته‌بندی‌ها برای جلوگیری از ارور تایپ
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

// تابع نرمال‌سازی متن برای جستجو
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
  if (!rawSnapshot) {
    return [...initialFoods];
  }
  if (Array.isArray(rawSnapshot)) {
    return rawSnapshot;
  }
  try {
    const parsed = typeof rawSnapshot === 'string' ? JSON.parse(rawSnapshot) : rawSnapshot;
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // بازگشت لیست پیش‌فرض در صورت بروز خطا در پارس
  }
  return [...initialFoods];
}

/** تبدیل فهرست غذاها به متن JSON */
export function serializeFoodCatalog(foods: any): string {
  return JSON.stringify(foods, null, 2);
}

/**
 * افزودن یا به‌روزرسانی غذا (پشتیبانی از هر نوع ورودی در ادمین)
 */
export function upsertFood(...args: any[]): any {
  if (args.length === 0) return initialFoods;
  
  // اگر ورودی اول یک آرایه از غذاها باشد
  if (Array.isArray(args[0])) {
    return args[0];
  }

  // اگر غذا به صورت آبجکت تکی فرستاده شده باشد
  const food = args[0];
  const list = Array.isArray(args[1]) ? args[1] : initialFoods;

  const existingIndex = list.findIndex((item: any) => item.id === food.id);
  if (existingIndex === -1) {
    return [...list, food];
  }
  return list.map((item: any) => (item.id === food.id ? food : item));
}
