export const interests = ["رژیمی", "گیاهی", "سریع و آسان", "سنتی", "دسرها"] as const;
export type Interest = (typeof interests)[number];
export const foodSuggestions = [
  { id: "salad", name: "سالاد سزار", minutes: 20, calories: 320, category: "رژیمی", tags: ["رژیمی", "سریع و آسان"], image: "photo-1512621776951-a57141f2eefd" },
  { id: "vegetables", name: "بشقاب سبزیجات کبابی", minutes: 30, calories: 240, category: "گیاهی", tags: ["گیاهی", "رژیمی"], image: "photo-1511690743698-d9d85f2fbf38" },
  { id: "pasta", name: "پاستا آلفردو", minutes: 25, calories: 520, category: "سریع و آسان", tags: ["سریع و آسان"], image: "photo-1473093295043-cdd812d0e601" },
  { id: "ghormeh", name: "قورمه‌سبزی", minutes: 150, calories: 480, category: "سنتی", tags: ["سنتی"], image: "photo-1547592180-85f173990554" },
  { id: "rice", name: "زرشک‌پلو با مرغ", minutes: 75, calories: 560, category: "سنتی", tags: ["سنتی"], image: "photo-1546069901-ba9599a7e63c" },
  { id: "cake", name: "کیک شکلاتی", minutes: 50, calories: 380, category: "دسرها", tags: ["دسرها"], image: "photo-1578985545062-69928b1d9587" },
] satisfies { id: string; name: string; minutes: number; calories: number; category: Interest; tags: Interest[]; image: string }[];
export const faNumber = (value: number) => new Intl.NumberFormat("fa-IR").format(value);
