"use client";

import { useState } from "react";
import { foodCategories, normalizeFoodText } from "../lib/foodCatalog";
import { useFoods } from "../lib/foodStore";
import FoodImage from "./FoodImage";
import FoodRecipeDialog from "./FoodRecipeDialog";

const categories = ["همه", ...foodCategories] as const;
type Category = (typeof categories)[number];

export default function SmartMenu() {
  const foods = useFoods();
  const [category, setCategory] = useState<Category>("همه");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const results = foods.filter(
    (food) =>
      (category === "همه" || food?.category === category) &&
      normalizeFoodText(food?.name ?? "").includes(normalizeFoodText(query))
  );

  return (
    <section
      id="smart-menu"
      dir="rtl"
      aria-labelledby="smart-menu-title"
      className="relative my-12 scroll-mt-36 overflow-hidden rounded-xl border-2 border-zinc-700 bg-background px-5 py-8 text-foreground shadow-[var(--card-shadow)] sm:px-8 sm:py-10"
    >
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-3 text-xs font-bold tracking-wide text-[var(--orange)]">
            CHEF MENU / با سلیقه خودت انتخاب کن
          </p>
          <h2 id="smart-menu-title" className="text-2xl font-black sm:text-3xl">
            منوی هوشمند <span aria-hidden="true">✦</span>
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            از یک وعده خوشمزه تا یک نوشیدنی خنک؛ امروز چی میل داری؟
          </p>
        </div>
        <span
          aria-hidden="true"
          className="hidden rotate-6 rounded-xl border-2 border-[var(--orange)] bg-[var(--accent-soft)] p-4 text-4xl shadow-[var(--card-shadow)] sm:block"
        >
          👨‍🍳
        </span>
      </div>

      {/* نوار جستجو */}
      <div role="search" className="relative mb-5">
        <label htmlFor="smart-menu-search" className="sr-only">
          جستجو بر اساس نام غذا
        </label>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3.5 right-4 text-xl text-[var(--orange)]"
        >
          ⌕
        </span>
        <input
          id="smart-menu-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="اسم غذای دلخواهت رو بنویس..."
          autoComplete="off"
          maxLength={120}
          className="w-full rounded-xl border-2 border-zinc-700 bg-[var(--surface)] py-4 pr-12 pl-4 text-sm text-white placeholder:text-zinc-500 focus:border-[var(--orange)] focus:outline-none"
        />
      </div>

      {/* دکمه‌های دسته‌بندی */}
      <div
        role="group"
        aria-label="فیلتر دسته‌بندی غذا"
        className="mb-6 flex flex-wrap gap-2"
      >
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
            className={`rounded-xl border-2 px-4 py-2.5 text-xs font-bold transition ${
              category === item
                ? "border-[var(--orange)] bg-[var(--orange)] text-[var(--button-foreground)] shadow-[var(--card-shadow)]"
                : "border-zinc-700 bg-[var(--surface)] text-zinc-300 hover:border-[var(--orange)] hover:text-[var(--orange)]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <p role="status" aria-live="polite" className="mb-5 text-xs text-[var(--muted)]">
        {results.length.toLocaleString("fa-IR")} غذا برای انتخاب
      </p>

      {/* کارت‌های غذا */}
      {results.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((food) => (
            <article
              key={food.id}
              className="group overflow-hidden rounded-xl border-2 border-zinc-700 bg-[var(--surface)] text-right shadow-[var(--card-shadow)] transition flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-soft)]">
                  <FoodImage food={food} />
                  <span className="absolute top-3 right-3 rounded-lg border border-[var(--orange)]/50 bg-background/90 px-3 py-1.5 text-xs text-[var(--orange)]">
                    {food.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="mb-4 text-base font-bold text-white group-hover:text-[var(--orange)] transition">
                    {food.name}
                  </h3>
                  <div className="flex flex-wrap justify-between gap-2 text-xs">
                    <span className="text-[var(--orange)]">🔥 {food.calories}</span>
                    <span className="text-[var(--muted)]">◷ {food.cookingTime}</span>
                  </div>
                </div>
              </div>

              {/* دکمه اختصاصی شبیه پیشنهادهای شخصی */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => {
                    console.log("Clicked Food ID:", food.id, typeof food.id);
                    setSelectedId(String(food.id));
                  }}
                  className="w-full rounded-xl bg-zinc-900 text-white py-2.5 text-xs font-bold hover:bg-zinc-800 border border-zinc-700 transition active:scale-95"
                >
                  مشاهده دستور پخت
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-700 p-8 text-center">
          <p className="mb-4 text-sm leading-7 text-zinc-300">
            غذایی با این جستجو و دسته‌بندی پیدا نشد.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("همه");
            }}
            className="rounded-xl bg-[var(--orange)] px-4 py-3 text-sm font-bold text-[var(--button-foreground)]"
          >
            نمایش همه غذاها
          </button>
        </div>
      )}

      {/* مودال دستور پخت */}
      <FoodRecipeDialog
        foodId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </section>
  );
}
