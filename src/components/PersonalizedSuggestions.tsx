'use client';

import React, { useMemo, useState } from 'react';
import { useFoods } from '../lib/foodStore';
import FoodImage from './FoodImage';
import FoodRecipeDialog from './FoodRecipeDialog';

type Interest =
  | 'رژیمی'
  | 'گیاهی'
  | 'سریع و آسان'
  | 'سنتی'
  | 'دسر'
  | 'پروتئینی';

const INTERESTS: Interest[] = ['رژیمی', 'گیاهی', 'سریع و آسان', 'سنتی', 'دسر', 'پروتئینی'];

function Pill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-3 py-1.5 rounded-full text-sm transition border',
        active
          ? 'bg-[#FF7A00] text-zinc-950 border-[#FF7A00]'
          : 'bg-[var(--surface)] text-zinc-200 border-zinc-700 hover:border-[#FF7A00]/60',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

export default function PersonalizedSuggestions() {
  const foods = useFoods();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Interest | 'همه'>('همه');

  const filtered = useMemo(() => {
    return foods.filter((food) => food.placements.includes('personalized') && (selected === 'همه' || food.tags.includes(selected)));
  }, [foods, selected]);

  return (
    <section className="w-full py-14 bg-background" dir="rtl">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              پیشنهادهای شخصی‌سازی‌شده
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              علایقت رو انتخاب کن تا غذاها و دسرهای مناسب‌تر بهت پیشنهاد بدیم.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Pill active={selected === 'همه'} onClick={() => setSelected('همه')}>
              همه
            </Pill>
            {INTERESTS.map((t) => (
              <Pill key={t} active={selected === t} onClick={() => setSelected(t)}>
                {t}
              </Pill>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-zinc-700 bg-[var(--surface)] overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="relative h-36 overflow-hidden bg-[var(--surface-soft)]"><FoodImage food={item} /></div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <span className="text-xs rounded-full px-2 py-1 bg-[#FF7A00]/10 text-[#FF7A00] border border-[#FF7A00]/20">
                    {item.category}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>زمان: {item.cookingTime}</span>
                  <span>کالری: {item.calories}</span>
                </div>

                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => setSelectedId(item.id)}
                  className="mt-4 w-full rounded-xl bg-zinc-900 text-white py-2.5 hover:bg-zinc-800 transition"
                >
                  مشاهده دستور پخت
                </button>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && <p role="status" className="mt-6 text-sm text-[var(--muted)]">در این دسته غذایی وجود ندارد.</p>}
        <FoodRecipeDialog foodId={selectedId} onClose={() => setSelectedId(null)} />
        <div className="mt-8 rounded-xl border border-[#FF7A00]/20 bg-[var(--surface)] p-4 md:p-6">
          <p className="text-zinc-300">
            برای دیدن مواد لازم و مراحل آماده‌سازی، دستور پخت دلخواهتان را باز کنید.
          </p>
        </div>
      </div>
    </section>
  );
}
