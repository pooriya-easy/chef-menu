import React from 'react';

type Testimonial = {
  name: string;
  role: string;
  text: string;
  rating: number; // 1..5
};

const DATA: Testimonial[] = [
  {
    name: 'مریم',
    role: 'کاربر',
    text: 'ماشین‌حساب مواد اولیه دقیق بود و برای مهمونی خیلی کمکم کرد. UI هم خیلی مرتب و خوش‌رنگه.',
    rating: 5,
  },
  {
    name: 'پوریا',
    role: 'کاربر',
    text: 'پیشنهادهای شخصی‌سازی‌شده باعث شد سریع‌تر غذاهای مورد علاقم رو پیدا کنم. عالیه.',
    rating: 5,
  },
  {
    name: 'سارا',
    role: 'کاربر',
    text: 'بخش ارزش غذایی خیلی کاربردیه. اگر عکس غذا رو هم تحلیل کنه، فوق‌العاده‌تر می‌شه.',
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  const full = Math.max(0, Math.min(5, count));
  return (
    <div className="flex gap-1" aria-label={`${full} از ۵`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < full ? 'text-[#FF7A00]' : 'text-zinc-300'}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="w-full py-14 bg-[var(--surface)]" dir="rtl">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            تجربه کاربران
          </h2>
          <p className="text-[var(--muted)]">
            چند نظر واقعی (فعلاً نمونه) درباره دقت ماشین‌حساب و کاربردی بودن بخش‌ها.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {DATA.map((t) => (
            <article
              key={t.name}
              className="rounded-xl border border-zinc-700 bg-background p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold">
                    {t.name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-[var(--muted)]">{t.role}</div>
                  </div>
                </div>
                <Stars count={t.rating} />
              </div>

              <p className="mt-4 text-zinc-300 leading-7">{t.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
