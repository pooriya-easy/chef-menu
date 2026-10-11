"use client";

import { useState } from "react";
import styles from "./IngredientCalculator.module.css";
import { useFoods } from "../lib/foodStore";
import { formatQuantity, scaleQuantity } from "../lib/recipeIngredients";

const numberFormat = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 });
const minGuests = 1;
const maxGuests = 100;

export default function IngredientCalculator({ standalone = false }: { standalone?: boolean }) {
  const foods = useFoods();
  const recipe = foods.find((food) => food.placements.includes("calculator"));
  const [guests, setGuests] = useState(4);
  const Heading = standalone ? "h1" : "h2";

  return (
    <section id="calculator" className={styles.section} dir="rtl" aria-labelledby="calculator-title">
      <div className={styles.panel}>
        <div className={styles.intro}>
          <span className={styles.icon} aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="3" /><path d="M8 6h8v4H8zM8 14h1m6 0h1m-8 4h1m6 0h1" /></svg>
          </span>
          <Heading id="calculator-title" className={styles.title}>ماشین‌حساب هوشمند مواد اولیه</Heading>
          <p className={styles.description}>تعداد نفرات را مشخص کن تا مقدار مواد اولیه دقیقاً محاسبه شود.</p>

          <div className={styles.servings}>
            <span id="guest-count-label" className={styles.counterLabel}>برای چند نفر می‌پزی؟</span>
            <div className={styles.counter} role="group" aria-labelledby="guest-count-label" aria-describedby="guest-count-hint">
              <button type="button" aria-label="افزایش تعداد نفرات" aria-controls="ingredient-amounts" disabled={!recipe || guests === maxGuests} onClick={() => setGuests((current) => Math.min(maxGuests, current + 1))}>+</button>
              <output className={styles.count} aria-live="polite" aria-atomic="true"><strong>{numberFormat.format(guests)}</strong><span>نفر</span></output>
              <button type="button" aria-label="کاهش تعداد نفرات" aria-controls="ingredient-amounts" disabled={!recipe || guests === minGuests} onClick={() => setGuests((current) => Math.max(minGuests, current - 1))}>−</button>
            </div>
            <p id="guest-count-hint" className={styles.hint}>از ۱ تا ۱۰۰ نفر؛ مقدارها با هر تغییر به‌روز می‌شوند.</p>
          </div>
          {standalone && <a className={styles.back} href="#home">بازگشت به خانه <span aria-hidden="true">←</span></a>}
        </div>

        <div className={styles.recipe}>
          <div className={styles.recipeHeading}>
            <div><span className={styles.sample}>یک نمونه خوشمزه</span><h3>{recipe?.name ?? 'دستور نمونه حذف شده است'}</h3></div>
            <span className={styles.portions}>{numberFormat.format(guests)} نفر</span>
          </div>
          <dl id="ingredient-amounts" className={styles.ingredients}>
            {recipe?.ingredients.map((ingredient, index) => {
              const quantity = scaleQuantity(ingredient.quantity, guests, recipe.baseServings);
              return <div key={index} className={styles.row}>
                <dt>{ingredient.name}</dt>
                <dd><strong>{quantity === null ? 'مقدار ثبت نشده' : formatQuantity(quantity)}</strong><span>{ingredient.unit}</span></dd>
              </div>;
            })}
          </dl>
          <p className={styles.recipeNote}>مقادیر نمونه‌اند و متناسب با تعداد نفرات تغییر می‌کنند؛ نمک و ادویه را به سلیقه‌ات اضافه کن.</p>
        </div>
      </div>
    </section>
  );
}
