import { defaultFoods } from "./defaultFoods";
import { defaultServings, normalizeIngredients, parseServings } from "./recipeIngredients";
import type { RecipeIngredient } from "./recipeIngredients";

export const foodCategories = ["غذای اصلی", "سالاد", "پیش‌غذا", "دسر", "نوشیدنی"] as const;
export type FoodCategory = (typeof foodCategories)[number];
export type Placement = "menu" | "personalized" | "random" | "search" | "calculator";
export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  calories: string;
  cookingTime: string;
  image: string;
  baseServings: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  tags: string[];
  placements: Placement[];
}

export function normalizeFoodText(value: string) {
  return value.normalize("NFKC").replace(/ي/g, "ی").replace(/ك/g, "ک")
    .replace(/[\s\u200c\u200d\u064b-\u065f\u0640]/g, "").toLocaleLowerCase("fa");
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim()
    : typeof value === "number" && Number.isFinite(value) ? String(value) : fallback;
}

function strings(value: unknown): string[] {
  return (Array.isArray(value) ? value : typeof value === "string" ? value.split(/\r?\n/) : [])
    .filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map((item) => item.trim());
}

function category(value: unknown, name: string): FoodCategory {
  const normalized = normalizeFoodText(text(value, "غذای اصلی"));
  if (normalized.includes("سالاد") && (!normalized.includes("پیش") || normalizeFoodText(name).includes("سالاد"))) return "سالاد";
  if (normalized.includes("پیش")) return "پیش‌غذا";
  if (normalized.includes("دسر") || normalized.includes("شیرینی")) return "دسر";
  if (normalized.includes("نوشیدنی")) return "نوشیدنی";
  return "غذای اصلی";
}

export function normalizeFood(value: unknown, index = 0, fallback?: Food): Food | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (typeof item.name !== "string" || !item.name.trim()) return null;
  const name = item.name.trim();
  const calories = text(item.calories, fallback?.calories ?? "ثبت نشده");
  const cookingTime = text(item.cookingTime ?? item.cookTime ?? item.time, fallback?.cookingTime ?? "ثبت نشده");
  const placements = strings(item.placements).filter((value): value is Placement => ["menu", "personalized", "random", "search", "calculator"].includes(value));
  const image = text(item.image, fallback?.image ?? "/food-placeholder.svg");
  return {
    id: fallback?.id ?? text(item.id, `legacy-${index}`), name,
    category: category(item.category ?? fallback?.category, name),
    calories: /^[\d۰-۹٠-٩]+(?:[.,٫]\d+)?$/.test(calories) ? `${calories} کیلوکالری` : calories,
    cookingTime: /^[\d۰-۹٠-٩]+$/.test(cookingTime) ? `${cookingTime} دقیقه` : cookingTime,
    image: /^(\/(?!\/)|https?:\/\/|data:image\/|blob:)/i.test(image) ? image : "/food-placeholder.svg",
    baseServings: parseServings(item.baseServings) ?? fallback?.baseServings ?? defaultServings,
    ingredients: item.ingredients === undefined ? fallback?.ingredients ?? [] : normalizeIngredients(item.ingredients),
    instructions: item.instructions === undefined && item.steps === undefined ? fallback?.instructions ?? [] : strings(item.instructions ?? item.steps),
    tags: item.tags === undefined ? fallback?.tags ?? [] : strings(item.tags),
    placements: item.placements === undefined ? fallback?.placements ?? ["menu", "personalized", "random", "search"] : placements,
  };
}

export function readFoodCatalog(raw: string | null): Food[] {
  if (!raw) return defaultFoods;
  try {
    const parsed: unknown = JSON.parse(raw);
    // A versioned snapshot distinguishes a deliberately emptied menu from missing data.
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const snapshot = parsed as Record<string, unknown>;
      if (snapshot.version !== 2 || !Array.isArray(snapshot.foods)) return defaultFoods;
      return uniqueFoods(snapshot.foods.flatMap((item, index) => {
        const normalized = normalizeFood(item, index);
        return normalized ? [normalized] : [];
      }));
    }
    if (!Array.isArray(parsed)) return defaultFoods;
    // Older arrays contained only admin-added foods. Bring in all original site recipes.
    const merged = new Map(defaultFoods.map((food) => [food.id, food]));
    parsed.forEach((item: unknown, index) => {
      const candidate = normalizeFood(item, index);
      if (!candidate) return;
      const original = defaultFoods.find((food) => food.id === candidate.id)
        ?? defaultFoods.find((food) => normalizeFoodText(food.name) === normalizeFoodText(candidate.name));
      const normalized = normalizeFood(item, index, original);
      if (normalized) merged.set(normalized.id, normalized);
    });
    return [...merged.values()];
  } catch {
    return defaultFoods;
  }
}

function uniqueFoods(foods: Food[]) {
  const ids = new Set<string>();
  return foods.map((food, index) => {
    let id = food.id;
    while (ids.has(id)) id = `${id}-${index}`;
    ids.add(id);
    return id === food.id ? food : { ...food, id };
  });
}

export function serializeFoodCatalog(foods: Food[]) {
  return JSON.stringify({ version: 2, foods });
}

export function upsertFood(foods: Food[], food: Food, editing = false): Food[] {
  const exists = foods.some((item) => item.id === food.id);
  if (editing && !exists) throw new Error("این غذا حذف شده است. دوباره فهرست غذاها را بررسی کنید.");
  return exists ? foods.map((item) => item.id === food.id ? food : item) : [food, ...foods];
}
