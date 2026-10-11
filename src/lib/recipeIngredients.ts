export interface RecipeIngredient {
  name: string;
  quantity: number | null;
  unit: string;
}

export const minServings = 1;
export const maxServings = 100;
export const defaultServings = 2;

export function normalizeNumericText(value: string) {
  return value.trim().replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))).replace(/٫/g, ".");
}

export function parseQuantity(value: unknown): number | null {
  const normalized = typeof value === "string" ? normalizeNumericText(value) : value;
  if (typeof normalized === "string" && !/^\d+(?:\.\d+)?$/.test(normalized)) return null;
  if (typeof normalized !== "string" && typeof normalized !== "number") return null;
  const quantity = Number(normalized);
  return Number.isFinite(quantity) && quantity >= 0 && quantity <= Number.MAX_SAFE_INTEGER ? quantity : null;
}

export function parseServings(value: unknown): number | null {
  const normalized = typeof value === "string" ? normalizeNumericText(value) : value;
  if (typeof normalized === "string" && !/^\d+$/.test(normalized)) return null;
  if (typeof normalized !== "string" && typeof normalized !== "number") return null;
  const servings = Number(normalized);
  return Number.isInteger(servings) && servings >= minServings && servings <= maxServings ? servings : null;
}

export function normalizeIngredients(value: unknown): RecipeIngredient[] {
  const items: unknown[] = Array.isArray(value) ? value
    : typeof value === "string" ? value.split(/[,،\n]/) : [];
  return items.flatMap((item): RecipeIngredient[] => {
    // Keep existing name-only ingredients visible without inventing amounts.
    if (typeof item === "string") return item.trim() ? [{ name: item.trim(), quantity: null, unit: "" }] : [];
    if (!item || typeof item !== "object") return [];
    const ingredient = item as Record<string, unknown>;
    if (typeof ingredient.name !== "string" || !ingredient.name.trim()) return [];
    return [{ name: ingredient.name.trim(), quantity: parseQuantity(ingredient.quantity ?? ingredient.amount),
      unit: typeof ingredient.unit === "string" ? ingredient.unit.trim() : "" }];
  });
}

export function scaleQuantity(quantity: number | null, servings: number, baseServings: number): number | null {
  if (quantity === null || parseQuantity(quantity) === null || parseServings(servings) === null || parseServings(baseServings) === null) return null;
  return quantity * (servings / baseServings);
}

export function formatQuantity(quantity: number) {
  return new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 8 }).format(quantity);
}
