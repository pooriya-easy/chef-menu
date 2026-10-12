"use client";

import { useState } from "react";
import Link from "next/link";

// نمونه دیتای غذاها بر اساس دسته‌بندی‌ها
interface FoodItem {
  id: number;
  title: string;
  category: string;
  subCategory?: string;
  calories: string;
  time: string;
}

const foodItems: FoodItem[] = [
  { id: 1, title: "ماهی قزل‌آلا کبابی", category: "غذای اصلی", subCategory: "غذای دریایی", calories: "۳۲۰ کیلوکالری", time: "۳۵ دقیقه" },
  { id: 2, title: "میگو سوخاری", category: "غذای اصلی", subCategory: "غذای دریایی", calories: "۴۱۰ کیلوکالری", time: "۲۵ دقیقه" },
  { id: 3, title: "قرمه سبزی", category: "غذای اصلی", subCategory: "غذای سنتی", calories: "۵۲۰ کیلوکالری", time: "۹۰ دقیقه" },
  { id: 4, title: "زرشک پلو با مرغ", category: "غذای اصلی", subCategory: "غذای سنتی", calories: "۴۸۰ کیلوکالری", time: "۶۰ دقیقه" },
  { id: 5, title: "پیتزا مخصوص", category: "غذای اصلی", subCategory: "فست‌فود", calories: "۶۵۰ کیلوکالری", time: "۳۰ دقیقه" },
  { id: 6, title: "برگر دست‌ساز", category: "غذای اصلی", subCategory: "فست‌فود", calories: "۵۸۰ کیلوکالری", time: "۲۰ دقیقه" },
  { id: 7, title: "موهیتو طبیعی", category: "نوشیدنی", subCategory: "نوشیدنی سرد", calories: "۱۱۰ کیلوکالری", time: "۱۰ دقیقه" },
  { id: 8, title: "اسموتی توت‌فرنگی", category: "نوشیدنی", subCategory: "نوشیدنی سرد", calories: "۱۸۰ کیلوکالری", time: "۱۰ دقیقه" },
  { id: 9, title: "قهوه اسپرسو", category: "نوشیدنی", subCategory: "نوشیدنی گرم", calories: "۱۰ کیلوکالری", time: "۵ دقیقه" },
  { id: 10, title: "چای ماسالا", category: "نوشیدنی", subCategory: "نوشیدنی گرم", calories: "۱۲۰ کیلوکالری", time: "۱۵ دقیقه" },
  { id: 11, title: "کیک شکلاتی", category: "دسر", calories: "۳۶۰ کیلوکالری", time: "۴۵ دقیقه" },
  { id: 12, title: "پاناکوتا", category: "دسر", calories: "۲۴۰ کیلوکالری", time: "۲۰ دقیقه" },
  { id: 13, title: "سوپ جو", category: "پیش‌غذا", calories: "۱۵۰ کیلوکالری", time: "۴۰ دقیقه" },
  { id: 14, title: "سالاد سزار", category: "سالاد", calories: "۲۲۰ کیلوکالری", time: "۱۵ دقیقه" },
];

export default function SmartMenuPage() {
  const [category, setCategory] = useState<string>("همه");
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // فیلتر کردن آیتم‌ها بر اساس دسته، زیردسته و متن جستجو
  const filteredFoods = foodItems.filter((food) => {
    const matchesSearch = food.title.includes(searchQuery.trim());
    const matchesCategory = category === "همه" || food.category === category;
    const matchesSubCategory = !subCategory || food.subCategory === subCategory;
    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 md:p-12 dir-rtl" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* هدر صفحه */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-amber-500 text-xs font-bold tracking-wider">
              CHEF MENU / با سلیقه خودت انتخاب کن
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-1 text-white flex items-center gap-2">
              <span>✦</span> منوی هوشمند
            </h1>
            <p className="text-zinc-400 text-sm mt-2">
              از یک وعده خوشمزه تا یک نوشیدنی خنک؛ امروز چی میل داری؟
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 text-sm rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 transition"
          >
            بازگشت به خانه ←
          </Link>
        </div>

        {/* سرچ‌بار */}
        <div className="relative mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="اسم غذای دلخواهت رو بنویس..."
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl py-3.5 pr-12 pl-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
          />
          <span className="absolute right-4 top-3.5 text-zinc-500">🔍</span>
        </div>

        {/* ۱. بخش فیلتر اصلی */}
        <div className="flex flex-wrap gap-2.5 mb-4">
          {["همه", "غذای اصلی", "پیش‌غذا", "سالاد", "دسر", "نوشیدنی"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setSubCategory(null);
              }}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                category === cat
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-bold"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ۲. بخش زیردسته‌ها (Sub-Categories) */}
        {(category === "غذای اصلی" || category === "نوشیدنی") && (
          <div className="flex flex-wrap gap-2 mb-6 p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl">
            <span className="text-xs text-zinc-500 flex items-center pl-2">زیردسته:</span>
            
            {/* دکمه "همه این دسته" */}
            <button
              onClick={() => setSubCategory(null)}
              className={`px-3 py-1 rounded-lg text-xs transition ${
                subCategory === null
                  ? "bg-zinc-700 text-white font-semibold"
                  : "bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
            >
              همه
            </button>

            {/* زیردسته‌های غذای اصلی */}
            {category === "غذای اصلی" &&
              ["غذای دریایی", "غذای سنتی", "فست‌فود"].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSubCategory(sub)}
                  className={`px-3 py-1 rounded-lg text-xs transition ${
                    subCategory === sub
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 font-semibold"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {sub}
                </button>
              ))}

            {/* زیردسته‌های نوشیدنی */}
            {category === "نوشیدنی" &&
              ["نوشیدنی سرد", "نوشیدنی گرم"].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSubCategory(sub)}
                  className={`px-3 py-1 rounded-lg text-xs transition ${
                    subCategory === sub
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 font-semibold"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {sub}
                </button>
              ))}
          </div>
        )}

        {/* تعداد غذاهای پیدا شده */}
        <div className="text-xs text-zinc-500 mb-6">
          {filteredFoods.length} مورد برای نمایش
        </div>

        {/* ۳. لیست کارت‌های غذا */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredFoods.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-amber-500/40 transition flex flex-col justify-between"
            >
              <div>
                {/* تگ دسته */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {item.subCategory ? `${item.category} • ${item.subCategory}` : item.category}
                  </span>
                  <span className="text-amber-500 text-xs">★</span>
                </div>

                {/* آیکون بشقاب شبیه طرح عکس */}
                <div className="w-20 h-20 mx-auto my-3 rounded-full border border-amber-500/30 bg-black flex items-center justify-center text-amber-400 text-2xl font-mono">
                  Ψ
                </div>

                {/* عنوان غذا */}
                <h3 className="text-lg font-bold text-center mt-3 text-white">
                  {item.title}
                </h3>

                {/* اطلاعات کالری و زمان */}
                <div className="flex justify-center gap-4 text-xs text-zinc-400 mt-3">
                  <span>🔥 {item.calories}</span>
                  <span>⏱ {item.time}</span>
                </div>
              </div>

              {/* دکمه جزییات */}
              <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
                <button className="text-amber-500 hover:text-amber-400 text-xs font-semibold flex items-center justify-center gap-1 mx-auto transition">
                  مواد لازم و جزئیات ←
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredFoods.length === 0 && (
          <div className="text-center py-16 text-zinc-500 text-sm">
            هیچ موردی مطابق با فیلتر انتخابی شما پیدا نشد.
          </div>
        )}
      </div>
    </div>
  );
}
