"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import styles from "./SmartSearch.module.css";
import { useFoods } from "../lib/foodStore";
import { normalizeFoodText as normalize } from "../lib/foodCatalog";
import FoodRecipeDialog from "./FoodRecipeDialog";

const quickTags = ["غذای ایرانی", "دسر و شیرینی", "رژیمی", "فستفود"];

export default function SmartSearch() {
  const foods = useFoods();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = submitted ? foods.filter((item) =>
    normalize(`${item.name} ${item.category} ${item.tags.join(" ")}`).includes(normalize(submitted))) : [];

  function search(value: string) {
    if (!normalize(value)) {
      setSubmitted("");
      setError("نام غذا یا یکی از دسته‌بندی‌ها را وارد کن.");
      inputRef.current?.focus();
      return;
    }
    setError("");
    setSubmitted(value.trim());
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    search(query);
  }

  return (
    <section className={styles.section} dir="rtl" aria-labelledby="search-title">
      <h2 id="search-title" className={styles.title}>طعم دلخواهت را پیدا کن</h2>
      <form role="search" aria-label="جستجوی غذا" onSubmit={handleSubmit}>
        <div className={styles.searchBar}>
          <svg className={styles.icon} width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
          <label className={styles.srOnly} htmlFor="food-search">نام غذا یا دسته‌بندی</label>
          <input ref={inputRef} id="food-search" name="q" type="search" enterKeyHint="search" autoComplete="off" maxLength={120} value={query}
            onChange={(event) => { setQuery(event.target.value); setSubmitted(""); setError(""); }}
            placeholder="امروز هوس چه غذایی کردی؟ (مثلاً: قورمهسبزی، پاستا، کیک شکلاتی...)"
            aria-invalid={Boolean(error)} aria-describedby={error ? "food-search-error" : undefined} />
          <button className={styles.submit} type="submit">جستجو <span aria-hidden="true">←</span></button>
        </div>
        {error && <p id="food-search-error" className={styles.error} role="alert">{error}</p>}
      </form>
      <div className={styles.tags} role="group" aria-label="جستجوی سریع">
        <span className={styles.tagsLabel}>پیشنهاد برای تو:</span>
        {quickTags.map((tag) => <button key={tag} type="button" className={styles.tag} aria-pressed={submitted === tag}
          onClick={() => { setQuery(tag); search(tag); }}>{tag}</button>)}
      </div>
      <div role="status" aria-live="polite" aria-atomic="true">
        {submitted && <div className={styles.results}>
          <p className={styles.resultHeading}>{results.length ? `پیشنهادها برای «${submitted}»` : `برای «${submitted}» پیشنهادی پیدا نشد.`}</p>
          {results.length > 0 && <ul className={styles.resultList}>{results.map((item) => <li key={item.id}><button type="button" aria-haspopup="dialog" onClick={() => setSelectedId(item.id)} className="w-full bg-transparent text-right">{item.name}<span>{item.category}</span></button></li>)}</ul>}
        </div>}
      </div>
      <FoodRecipeDialog foodId={selectedId} onClose={() => setSelectedId(null)} />
    </section>
  );
}
