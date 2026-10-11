"use client";

import { useId, useState } from "react";
import { defaultServings, formatQuantity, maxServings, minServings, parseServings, scaleQuantity } from "../lib/recipeIngredients";
import type { RecipeIngredient } from "../lib/recipeIngredients";

interface Props {
  ingredients: RecipeIngredient[];
  baseServings: number;
}

export default function RecipeIngredientCalculator({ ingredients, baseServings }: Props) {
  const id = useId();
  const [servings, setServings] = useState(defaultServings);
  const [input, setInput] = useState(String(defaultServings));
  const hasQuantities = ingredients.some((ingredient) => ingredient.quantity !== null);
  const invalid = parseServings(input) === null;

  function changeServings(next: number) {
    const valid = parseServings(next);
    if (valid === null) return;
    setServings(valid);
    setInput(String(valid));
  }

  if (!ingredients.length) return <p className="text-sm leading-7 text-[var(--muted)]">مواد اولیه این غذا هنوز ثبت نشده است.</p>;

  return (
    <section aria-labelledby={`${id}-title`} className="rounded-xl border border-emerald-800 bg-[var(--surface)] p-4 shadow-[var(--card-shadow)] sm:p-5">
      <h3 id={`${id}-title`} className="font-bold text-emerald-300">مواد لازم برای جمع شما</h3>
      {hasQuantities && <p className="mt-2 text-xs leading-6 text-[var(--muted)]">مقادیر پایه این دستور برای {formatQuantity(baseServings)} نفر است؛ تعداد نفرات را تغییر بده تا مواد لازم محاسبه شود.</p>}

      <label htmlFor={`${id}-servings`} className="mt-4 block text-sm font-bold">تعداد نفرات</label>
      <div className="mt-3 flex items-center gap-2 sm:gap-3">
        <button type="button" aria-label="کاهش تعداد نفرات" disabled={!hasQuantities || servings <= minServings}
          onClick={() => changeServings(servings - 1)}
          className="h-11 w-11 shrink-0 rounded-lg border! border-emerald-700 bg-emerald-950 text-xl text-emerald-200 transition hover:bg-emerald-900 focus-visible:outline-emerald-400! disabled:cursor-not-allowed disabled:opacity-40">−</button>
        <input id={`${id}-servings`} type="text" inputMode="numeric" role="spinbutton" aria-valuemin={minServings} aria-valuemax={maxServings}
          aria-valuenow={servings} value={input} disabled={!hasQuantities} maxLength={3}
          aria-invalid={invalid} aria-describedby={`${id}-hint${invalid ? ` ${id}-error` : ""}`} autoComplete="off"
          onChange={(event) => {
            const next = event.target.value;
            setInput(next);
            const valid = parseServings(next);
            if (valid !== null) setServings(valid);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
              event.preventDefault();
              changeServings(servings + (event.key === "ArrowUp" ? 1 : -1));
            }
          }}
          onBlur={() => { if (invalid) setInput(String(servings)); }}
          className="h-11 w-16 rounded-lg border border-zinc-600 bg-background text-center text-base text-white tabular-nums focus:border-emerald-400 focus:outline-none disabled:opacity-40 sm:w-20" />
        <button type="button" aria-label="افزایش تعداد نفرات" disabled={!hasQuantities || servings >= maxServings}
          onClick={() => changeServings(servings + 1)}
          className="h-11 w-11 shrink-0 rounded-lg border! border-emerald-700 bg-emerald-950 text-xl text-emerald-200 transition hover:bg-emerald-900 focus-visible:outline-emerald-400! disabled:cursor-not-allowed disabled:opacity-40">+</button>
        <span className="text-sm text-[var(--muted)]">نفر</span>
      </div>
      <p id={`${id}-hint`} className="mt-3 text-xs leading-6 text-[var(--muted)]">{hasQuantities ? "از ۱ تا ۱۰۰ نفر؛ مقدارهای اعشاری مواد نیز محاسبه می‌شوند." : "برای محاسبه، مقدار پایه مواد این غذا باید توسط ادمین ثبت شود."}</p>
      {invalid && <p id={`${id}-error`} role="alert" className="mt-2 text-xs leading-6 text-red-300">تعداد نفرات باید یک عدد صحیح بین ۱ و ۱۰۰ باشد. مقادیر فعلی برای {formatQuantity(servings)} نفر است.</p>}

      <div role="status" aria-live="polite" aria-atomic="true" className="mt-5">
        {hasQuantities && <p className="mb-3 text-xs font-bold text-emerald-300">مواد لازم برای {formatQuantity(servings)} نفر</p>}
        <dl className="divide-y divide-zinc-700 text-sm">
          {ingredients.map((ingredient, index) => {
            const quantity = scaleQuantity(ingredient.quantity, servings, baseServings);
            return <div key={index} className="flex items-start justify-between gap-4 py-3">
              <dt className="min-w-0 break-words leading-6 text-zinc-200">{ingredient.name}</dt>
              <dd className="max-w-[55%] shrink-0 break-words text-left leading-6 text-emerald-200 tabular-nums">
                {quantity === null ? ingredient.unit || "مقدار ثبت نشده" : `${formatQuantity(quantity)}${ingredient.unit ? ` ${ingredient.unit}` : ""}`}
              </dd>
            </div>;
          })}
        </dl>
      </div>
      {hasQuantities && ingredients.some((ingredient) => ingredient.quantity === null) && <p className="mt-3 text-xs leading-6 text-[var(--muted)]">موادی که مقدار عددی ندارند، بدون تغییر نمایش داده می‌شوند.</p>}
    </section>
  );
}
