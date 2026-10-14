export const foodCategories = [
  'سنتی',
  'فست‌فود',
  'غذای دریایی',
  'غذای رژیمی',
  'پیش‌غذا',
  'فینگرفود',
  'سوپ',
  'سالاد مجلسی',
  'سالاد رژیمی',
  'دسر',
  'نوشیدنی‌های سرد',
  'نوشیدنی‌های گرم',
] as const;

export type FoodCategory = (typeof foodCategories)[number] | string;

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
  calories: number;
  cookTime?: string;
  cookingTime?: string;
  image: string;
  servings?: number;
  ingredients?: IngredientItem[];
  instructions?: string[];
  description?: string;
}

export const initialFoods: Food[] = [
  {
    id: 'ghormeh-sabzi',
    name: 'قورمه سبزی مجلسی',
    category: 'سنتی',
    calories: 450,
    cookingTime: '۱۸۰ دقیقه',
    cookTime: '۱۸۰ دقیقه',
    image: '/images/ghormeh.jpg',
    servings: 4,
    description: 'خورشت اصیل ایرانی با گوشت تازه، سبزی سرخ‌شده خوش‌عطر و لیمو عمانی.',
    ingredients: [
      { name: 'گوشت گوسفندی یا گوساله', amount: 400, unit: 'گرم' },
      { name: 'سبزی قورمه سرخ‌شده', amount: 400, unit: 'گرم' },
      { name: 'لوبیا قرمز یا چیتی', amount: 150, unit: 'گرم' },
    ],
    instructions: [
      'پیاز را نگینی خرد کرده و در روغن تفت دهید تا سبک و طلایی شود.',
      'گوشت را اضافه کرده و همراه با زردچوبه و فلفل سیاه تفت دهید.',
    ],
  },
  {
    id: 'chelo-kabab',
    name: 'چلو کباب کوبیده',
    category: 'سنتی',
    calories: 680,
    cookingTime: '۴۵ دقیقه',
    cookTime: '۴۵ دقیقه',
    image: '/images/kabab.jpg',
    servings: 2,
    description: 'کباب کوبیده زعفرانی خوش‌طعم و آبدار به همراه برنج ایرانی و کره.',
    ingredients: [
      { name: 'گوشت چرخ‌کرده', amount: 500, unit: 'گرم' },
      { name: 'پیاز رنده‌شده', amount: 2, unit: 'عدد' },
    ],
    instructions: [
      'گوشت را با پیاز و ادویه ورز دهید.',
      'به سیخ کشیده و کباب کنید.',
    ],
  },
  {
    id: 'pasta-alfredo',
    name: 'پاستا پنه آلفردو',
    category: 'فست‌فود',
    calories: 540,
    cookingTime: '۳۰ دقیقه',
    cookTime: '۳۰ دقیقه',
    image: '/images/pasta.jpg',
    servings: 2,
    description: 'پاستای لذیذ با فیله مرغ گریل، قارچ تفت‌داده شده و سس خامه و پارمزان.',
    ingredients: [
      { name: 'پاستا پنه', amount: 250, unit: 'گرم' },
      { name: 'سینه مرغ', amount: 200, unit: 'گرم' },
    ],
    instructions: [
      'پاستا را پخته و آبکش کنید.',
      'مرغ و قارچ را با خامه مخلوط کنید.',
    ],
  },
  {
    id: 'pizza-pepperoni',
    name: 'پیتزا مخصوص سرآشپز',
    category: 'فست‌فود',
    calories: 720,
    cookingTime: '۲۵ دقیقه',
    cookTime: '۲۵ دقیقه',
    image: '/images/pizza.jpg',
    servings: 2,
    description: 'پیتزای خوش‌طعم با پنیر موزارلای کش‌دار و پپرونی.',
    ingredients: [
      { name: 'خمیر پیتزا', amount: 1, unit: 'عدد' },
      { name: 'پنیر موزارلا', amount: 200, unit: 'گرم' },
    ],
    instructions: [
      'سس و پنیر را روی خمیر بریزید.',
      'در فر بپزید.',
    ],
  },
  {
    id: 'grilled-salmon',
    name: 'ماهی قزل‌آلا و سالمون گریل',
    category: 'غذای دریایی',
    calories: 380,
    cookingTime: '۲۵ دقیقه',
    cookTime: '۲۵ دقیقه',
    image: '/images/fish.jpg',
    servings: 1,
    description: 'فیله ماهی مرینیت‌شده با روغن زیتون و رزماری.',
    ingredients: [
      { name: 'فیله ماهی', amount: 250, unit: 'گرم' },
    ],
    instructions: [
      'ماهی را مزه‌دار کرده و گریل کنید.',
    ],
  },
  {
    id: 'kashk-bademjan',
    name: 'کشک بادمجان سنتی',
    category: 'پیش‌غذا',
    calories: 310,
    cookingTime: '۴۰ دقیقه',
    cookTime: '۴۰ دقیقه',
    image: '/images/kashk.jpg',
    servings: 3,
    description: 'بادمجان کبابی نرم به همراه کشک غلیظ.',
    ingredients: [
      { name: 'بادمجان', amount: 5, unit: 'عدد' },
      { name: 'کشک', amount: 4, unit: 'قاشق' },
    ],
    instructions: [
      'بادمجان را له کرده و با کشک تفت دهید.',
    ],
  },
  {
    id: 'salad-shirazi',
    name: 'سالاد شیرازی تازه',
    category: 'سالاد مجلسی',
    calories: 90,
    cookingTime: '۱۵ دقیقه',
    cookTime: '۱۵ دقیقه',
    image: '/images/salad.jpg',
    servings: 3,
    description: 'ترکیب نگینی خیار، گوجه و پیاز.',
    ingredients: [
      { name: 'خیار و گوجه', amount: 6, unit: 'عدد' },
    ],
    instructions: [
      'مواد را نگینی خرد کرده و با آبغوره مخلوط کنید.',
    ],
  },
  {
    id: 'chocolate-cake',
    name: 'کیک شکلاتی لاوا',
    category: 'دسر',
    calories: 420,
    cookingTime: '۲۰ دقیقه',
    cookTime: '۲۰ دقیقه',
    image: '/images/cake.jpg',
    servings: 2,
    description: 'کیک شکلاتی داغ با هسته شکلات مذاب.',
    ingredients: [
      { name: 'شکلات', amount: 100, unit: 'گرم' },
    ],
    instructions: [
      'مواد را مخلوط کرده و در فر قرار دهید.',
    ],
  },
  {
    id: 'fresh-mojito',
    name: 'موهیتو نعناع و لیمو طبیعی',
    category: 'نوشیدنی‌های سرد',
    calories: 110,
    cookingTime: '۱۰ دقیقه',
    cookTime: '۱۰ دقیقه',
    image: '/images/mojito.jpg',
    servings: 1,
    description: 'نوشیدنی خنک و گازدار با نعناع و لیمو.',
    ingredients: [
      { name: 'نعناع و لیمو', amount: 1, unit: 'بسته' },
    ],
    instructions: [
      'نعناع و لیمو را کوبیده و با سودا مخلوط کنید.',
    ],
  },
  {
    id: 'cappuccino-coffee',
    name: 'قهوه کاپوچینو / لاته آرت',
    category: 'نوشیدنی‌های گرم',
    calories: 130,
    cookingTime: '۱۰ دقیقه',
    cookTime: '۱۰ دقیقه',
    image: '/images/coffee.jpg',
    servings: 1,
    description: 'اسپرسوی غلیظ با شیر فوم‌گرفته.',
    ingredients: [
      { name: 'اسپرسو', amount: 1, unit: 'شات' },
    ],
    instructions: [
      'شیر را فوم‌گرفته و روی اسپرسو بریزید.',
    ],
  },
  {
    id: 'classic-burger',
    name: 'برگر کلاسیک با سیب‌زمینی',
    category: 'فست‌فود',
    calories: 690,
    cookingTime: '۲۵ دقیقه',
    cookTime: '۲۵ دقیقه',
    image: '/images/burger.jpg',
    servings: 1,
    description: 'برگر دست‌ساز با پنیر چدار.',
    ingredients: [
      { name: 'گوشت برگر', amount: 180, unit: 'گرم' },
    ],
    instructions: [
      'برگر را سرخ کرده و در نان قرار دهید.',
    ],
  },
  {
    id: 'zereshk-polo',
    name: 'زرشک پلو با مرغ مجلسی',
    category: 'سنتی',
    calories: 620,
    cookingTime: '۹۰ دقیقه',
    cookTime: '۹۰ دقیقه',
    image: '/images/zereshk.jpg',
    servings: 2,
    description: 'مرغ زعفرانی با برنج و زرشک.',
    ingredients: [
      { name: 'مرغ و برنج', amount: 1, unit: 'پرس' },
    ],
    instructions: [
      'مرغ را پخته و با برنج و زرشک سرو کنید.',
    ],
  },
];

export const defaultFoods: Food[] = initialFoods;
const STORAGE_KEY = 'chef_menu_custom_foods_v1';

export function readFoodCatalog(): Food[] {
  if (typeof window === 'undefined') return initialFoods;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialFoods;
    
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return initialFoods;

    const customFoods = parsed.filter(
      (item: Food) => item && item.id && !initialFoods.some((def) => def.id === item.id)
    );
    
    const combined = [...initialFoods, ...customFoods];
    return combined.length > 0 ? combined : initialFoods;
  } catch (e) {
    console.error('Error reading catalog', e);
    return initialFoods;
  }
}

export function serializeFoodCatalog(foods: Food[]): string {
  return JSON.stringify(foods);
}

export function getFoodCatalog(): Food[] {
  return readFoodCatalog();
}

export async function upsertFood(food: Food): Promise<Food> {
  const current = readFoodCatalog();
  const index = current.findIndex((f) => f.id === food.id);
  let updated: Food[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = food;
  } else {
    updated = [food, ...current];
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return food;
}

export async function saveFoodToSupabase(food: Food): Promise<Food> {
  return upsertFood(food);
}

export async function deleteFoodFromSupabase(id: string): Promise<boolean> {
  const current = readFoodCatalog();
  const updated = current.filter((f) => f.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return true;
}

export function searchFoods(query: string, category?: string): Food[] {
  const foods = readFoodCatalog();
  return foods.filter((food) => {
    const matchesQuery =
      !query ||
      food.name.toLowerCase().includes(query.toLowerCase()) ||
      (food.description && food.description.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory =
      !category || category === 'همه' || food.category === category;

    return matchesQuery && matchesCategory;
  });
}
