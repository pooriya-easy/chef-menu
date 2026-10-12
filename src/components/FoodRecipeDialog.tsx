"use client";

import { useEffect, useId, useRef } from "react";
import { useFoods } from "../lib/foodStore";
import FoodImage from "./FoodImage";
import RecipeIngredientCalculator from "./RecipeIngredientCalculator";

export default function FoodRecipeDialog({ foodId, onClose }: { foodId: string | null; onClose: () => void }) {
  const foods = useFoods();
  const food = foods.find((item) => item.id === foodId);
  const hasFood = Boolean(food);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const element = dialog.current;
    if (foodId && hasFood) {
      if (element && !element.open) element.showModal();
    } else if (element?.open) element.close();
  }, [foodId, hasFood]);

  // پاکسازی داده‌ها برای حل خطای تایپ‌اسکریپت
  const safeIngredients = food?.ingredients?.map((ing) => ({
    ...ing,
    quantity: ing.quantity ?? 0, // اگر quantity تعریف نشده بود، 0 در نظر بگیر
  })) ?? [];

  const safeBaseServings = food?.baseServings ?? 1; // اگر تعداد نفرات نبود، 1 در نظر بگیر

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      dir="rtl"
      onClose={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current?.close();
      }}
      className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-xl border-2 border-[var(--orange)] bg-background p-6 text-foreground shadow-2xl backdrop:bg-background/80 backdrop:backdrop-blur-sm"
    >
      <button type="button" autoFocus aria-label="بستن جزئیات غذا" onClick={() => dialog.current?.close()} className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-2xl text-[var(--orange)]">
        ×
      </button>
      <h2 id={titleId} className="mb-4 text-xl font-bold">
        {food?.name ?? "جزئیات غذا"}
      </h2>
      {food && (
        <>
          <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-xl bg-[var(--surface-soft)]">
            <FoodImage food={food} />
          </div>
          <span className="text-xs text-[var(--orange)]">{food.category}</span>
          <div className="my-5 flex flex-wrap gap-4 rounded-xl bg-[var(--surface-soft)] p-4 text-sm text-[var(--orange)]">
            <span>🔥 {food.calories}</span>
            <span>◷ {food.cookingTime}</span>
          </div>
          
          {/* استفاده از داده‌های پاکسازی شده */}
          <RecipeIngredientCalculator key={food.id} ingredients={safeIngredients} baseServings={safeBaseServings} />
          
          <section className="mt-6" aria-labelledby={`${titleId}-steps`}>
            <h3 id={`${titleId}-steps`} className="mb-3 font-bold text-[var(--orange)]">مراحل و دستور پخت</h3>
            {(food.instructions ?? []).length > 0 ? (
              <ol className="list-inside list-decimal space-y-3 text-sm leading-8 text-zinc-300">
                {food.instructions?.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="text-sm leading-7 text-[var(--muted)]">دستور پخت این غذا هنوز ثبت نشده است.</p>
            )}
          </section>

        </>
      )}
    </dialog>
  );
}
