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

export type FoodCategory = (typeof foodCategories)[number];

export interface IngredientItem {
  name: string;
  amount?: number;
  quantity?: number | null;
  unit: string;
}

export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  calories: number;
  cookTime?: string;
  cookingTime?: string;
  image: string;
  ingredients: IngredientItem[];
  instructions?: string[];
  servings?: number;
  baseServings?: number;
  tags?: string[];
  placements?: string[];
}

// لیست پیش‌فرض اولیه سازگار
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

export function upsertFood(food: any): Food[] {
  return [food];
}
