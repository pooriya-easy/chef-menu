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
    // فعلاً فقط mock:
    alert('ثبت شد! (فعلاً نمونه)');
    setEmail('');
  }

  return (
    <footer className="w-full bg-zinc-950 text-zinc-200" dir="rtl">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                {/* لوگوی ساده (کلاه آشپز) به صورت SVG */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M7 10c-2.2 0-4-1.8-4-4 0-2 1.5-3.7 3.4-4 1-.7 2.2-1 3.6-1 2 0 3.8.7 5.1 2 2 .1 3.9 1.8 3.9 4 0 2.2-1.8 4-4 4H7Z"
                    stroke="white"
                    strokeOpacity="0.9"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 10v8c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-8"
                    stroke="#FF7A00"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 14h6"
                    stroke="white"
                    strokeOpacity="0.7"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
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
              <li><a className="hover:text-white" href="#hero">شروع</a></li>
              <li><a className="hover:text-white" href="#features">امکانات</a></li>
              <li><a className="hover:text-white" href="#calculator">ماشین‌حساب</a></li>
              <li><a className="hover:text-white" href="#scanner">اسکن ارزش غذایی</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white">شبکه‌های اجتماعی</h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              <li><a className="hover:text-white" href="#">اینستاگرام</a></li>
              <li><a className="hover:text-white" href="#">تلگرام</a></li>
              <li><a className="hover:text-white" href="#">یوتیوب</a></li>
              <li><a className="hover:text-white" href="#">ایکس (توییتر)</a></li>
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
                className="w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#FF7A00]/70"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#FF7A00] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                ثبت
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="text-xs text-zinc-500">
            © {year} Chef Menu — تمامی حقوق محفوظ است.
          </div>
          <div className="text-xs text-zinc-500">
            ساخته‌شده با Next.js • RTL • Tailwind
          </div>
        </div>
      </div>
    </footer>
  );
}
