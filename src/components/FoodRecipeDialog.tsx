"use client";

import { useEffect, useId, useRef } from "react";
import { useFoods } from "../lib/foodStore";
import FoodImage from "./FoodImage";
import RecipeIngredientCalculator from "./RecipeIngredientCalculator";

export default function FoodRecipeDialog({
  foodId,
  onClose,
}: {
  foodId: string | null;
  onClose: () => void;
}) {
  const foods = useFoods();
  // تبدیل ایمن هر دو به رشته برای جلوگیری از خطای تطابق number و string
  const food = foods.find(
    (item) => String(item?.id ?? "") === String(foodId ?? "")
  );
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    if (foodId && food) {
      if (!element.open) {
        element.showModal();
      }
    } else {
      if (element.open) {
        element.close();
      }
    }
  }, [foodId, food]);

  if (!foodId) return null;

  // پاکسازی داده‌ها و گارد مقادیر تهی
  const safeIngredients =
    food?.ingredients?.map((ing) => ({
      ...ing,
      name: ing?.name ?? "ماده اولیه",
      quantity: ing?.quantity ?? 0,
      unit: ing?.unit ?? "",
    })) ?? [];

  const safeBaseServings = food?.baseServings ?? 1;
  const safeInstructions = food?.instructions ?? [];

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      dir="rtl"
      onClose={onClose}
      onClick={(event) => {
        // بستن با کلیک روی بک‌دراپ بیرون از پنجره
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 m-auto max-h-[85dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-xl border-2 border-[var(--orange)] bg-background p-6 text-foreground shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 id={titleId} className="text-xl font-bold">
          {food?.name ?? "جزئیات غذا"}
        </h2>
        <button
          type="button"
          aria-label="بستن جزئیات غذا"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-2xl text-[var(--orange)] hover:bg-[var(--orange)] hover:text-black transition"
        >
          ✕
        </button>
      </div>

      {food ? (
        <>
          <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-xl bg-[var(--surface-soft)]">
            <FoodImage food={food} />
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="rounded-lg border border-[var(--orange)]/50 bg-[var(--surface-soft)] px-3 py-1 text-xs text-[var(--orange)]">
              {food?.category ?? "غذا"}
            </span>
            <div className="flex items-center gap-4 text-xs text-[var(--orange)]">
              <span>🔥 {food?.calories ?? 0} کالری</span>
              <span>◷ {food?.cookingTime ?? "نامشخص"}</span>
            </div>
          </div>

          {/* کامپوننت محاسبه هوشمند مواد اولیه بر اساس تعداد نفرات */}
          <RecipeIngredientCalculator
            key={food.id}
            ingredients={safeIngredients}
            baseServings={safeBaseServings}
          />

          <section className="mt-6" aria-labelledby={`${titleId}-steps`}>
            <h3
              id={`${titleId}-steps`}
              className="mb-3 font-bold text-[var(--orange)]"
            >
              مراحل و دستور پخت
            </h3>
            {safeInstructions.length > 0 ? (
              <ol className="list-inside list-decimal space-y-3 text-sm leading-8 text-zinc-300">
                {safeInstructions.map((step, index) => (
                  <li key={index} className="pr-1">
                    {step}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm leading-7 text-[var(--muted)]">
                دستور پخت این غذا هنوز ثبت نشده است.
              </p>
            )}
          </section>
        </>
      ) : (
        <div className="py-8 text-center text-zinc-400">
          در حال بارگذاری اطلاعات غذا...
        </div>
      )}
    </dialog>
  );
}
