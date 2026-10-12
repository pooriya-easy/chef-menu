"use client";

import { useState } from "react";
import { useFoods } from "../lib/foodStore";
import FoodRecipeDialog from "./FoodRecipeDialog";

export default function RandomFoodSuggestion() {
  const foods = useFoods().filter((food) => (food.placements ?? []).includes("random"));
  const [selected, setSelected] = useState<string | null>(null);
  const [recipeId, setRecipeId] = useState<string | null>(null);
  function pickFood() {
    const alternatives = foods.filter((food) => food.id !== selected);
    const pool = alternatives.length ? alternatives : foods;
    if (!pool.length) return;
    const index = crypto.getRandomValues(new Uint32Array(1))[0] % pool.length;
    setSelected(pool[index].id);
  }
  const food = foods.find((item) => item.id === selected);
  return (
    <section id="random-food" dir="rtl" aria-labelledby="random-title" className="scroll-mt-36 pb-20 text-foreground">
      <div className="rounded-xl border border-zinc-700 bg-[var(--surface)] p-6 text-center shadow-sm md:p-12">
        <span aria-hidden="true" className="mb-4 inline-flex rounded-xl bg-[var(--surface)] p-4 text-[#FF7A00] shadow-sm"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="7" cy="7" r="1" /><circle cx="17" cy="7" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="7" cy="17" r="1" /><circle cx="17" cy="17" r="1" /></svg></span>
        <h2 id="random-title" className="text-2xl font-bold leading-relaxed md:text-3xl">نمی‌دونی چی بپزی؟ غذای شانست رو پیدا کن!</h2>
        <p className="mt-3 text-sm leading-8 text-[var(--muted)]">یک کلیک، یک ایده‌ی خوشمزه برای امروز.</p>
        <button type="button" onClick={pickFood} disabled={!foods.length} className="mt-6 min-h-12 rounded-xl bg-[#FF7A00] text-zinc-950 px-6 py-3 text-sm font-bold shadow-[4px_4px_0_#000] transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50">⚄ پیشنهاد غذای تصادفی</button>
        <div role="status" aria-live="polite" aria-atomic="true">
          {food && <div key={food.id} className="food-result mx-auto mt-6 max-w-md rounded-xl border border-zinc-700 bg-[var(--surface)] p-6"><span className="text-xs text-[#FF7A00]">پیشنهاد این بار</span><h3 className="mt-2 text-xl font-bold">{food.name}</h3><p className="mt-3 text-sm text-[var(--muted)]">{food.cookingTime} · {food.calories}</p><button type="button" aria-haspopup="dialog" onClick={() => setRecipeId(food.id)} className="mt-4 rounded-lg bg-[var(--surface-soft)] px-4 py-2 text-sm text-[#FF7A00]">مشاهده دستور پخت</button></div>}
          {!foods.length && <p className="mt-4 text-sm text-[var(--muted)]">در حال حاضر غذایی برای پیشنهاد وجود ندارد.</p>}
        </div>
      </div>
      <FoodRecipeDialog foodId={recipeId} onClose={() => setRecipeId(null)} />
    </section>
  );
}
