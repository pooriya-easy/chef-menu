'use client';

import React, { useEffect, useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setYear(new Date().getFullYear()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert('ثبت شد! (فعلاً نمونه)');
    setEmail('');
  }

  return (
    <footer className="w-full bg-zinc-950 text-zinc-200 border-t border-zinc-800/60" dir="rtl">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#09090B] border border-zinc-800 flex items-center justify-center shadow-inner">
                {/* لوگوی کلاه آشپزی با دو خط عمودی صاف در وسط */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500" aria-hidden="true">
                  <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 10.18 0A4 4 0 0 1 18 13.87V21H6Z" />
                  <line x1="6" y1="17" x2="18" y2="17" />
                  <line x1="10" y1="9" x2="10" y2="14" />
                  <line x1="14" y1="9" x2="14" y2="14" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold text-white">Chef Menu</div>
                <div className="text-xs text-zinc-400">منوی هوشمند آشپزی</div>
              </div>
            </div>

            <p className="mt-4 text-sm text-zinc-400 leading-7">
              انتخاب غذا، محاسبه مواد اولیه، بررسی ارزش غذایی و پیشنهادهای شخصی‌سازی‌شده — همه در یک جا.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white">لینک‌های سریع</h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              <li><a className="hover:text-white transition" href="#hero">شروع</a></li>
              <li><a className="hover:text-white transition" href="/smart-menu">منوی هوشمند</a></li>
              <li><a className="hover:text-white transition" href="/calorie-scanner">کالری اسکنر</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white">شبکه‌های اجتماعی</h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              <li><a className="hover:text-white transition" href="#">اینستاگرام</a></li>
              <li><a className="hover:text-white transition" href="#">تلگرام</a></li>
              <li><a className="hover:text-white transition" href="#">یوتیوب</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white">خبرنامه</h4>
            <p className="mt-3 text-sm text-zinc-400 leading-7">
              ایمیلت رو وارد کن تا دستورهای جدید و آپدیت‌ها رو بگیری.
            </p>

            <form onSubmit={onSubmit} className="mt-4 flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="email@example.com"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-amber-500/70"
              />
              <button
                type="submit"
                className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition"
              >
                ثبت
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800/60 pt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="text-xs text-zinc-500">
            © {year || 2026} Chef Menu — تمامی حقوق محفوظ است.
          </div>
          <div className="text-xs text-zinc-500">
            ساخته‌شده با Next.js • RTL • Tailwind
          </div>
        </div>
      </div>
    </footer>
  );
}
