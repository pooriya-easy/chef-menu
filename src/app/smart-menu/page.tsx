"use client";

import { useState } from "react";
import Link from "next/link";
import { useFoods } from "@/lib/foodStore";
import FoodRecipeDialog from "@/components/FoodRecipeDialog";

export default function SmartMenuPage() {
  const foods = useFoods();
  const [category, setCategory] = useState<string>("همه");
  const [subCategory, setSubCategory] = useState<string>("همه");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);

  // دسته‌بندی‌های اصلی
  const categories = ["همه", "غذای اصلی", "پیش‌غذا", "سالاد", "دسر", "نوشیدنی"];

  // زیرمجموعه‌های دقیقاً مطابق درخواست شما
  const subCategoriesMap: Record<string, string[]> = {
    "غذای اصلی": ["همه", "سنتی", "فست‌فود", "غذای دریایی", "غذای رژیمی"],
    "پیش‌غذا": ["همه", "فینگرفود", "سوپ"],
    "سالاد": ["همه", "مجلسی", "رژیمی"],
    "دسر": ["همه"],
    "نوشیدنی": ["همه", "نوشیدنی‌های سرد", "نوشیدنی‌های گرم"],
  };

  // فیلتر هوشمند آیتم‌ها
  const filteredFoods = foods.filter((food) => {
    if (!food) return false;
    
    const name = (food.name || "").toLowerCase();
    const foodCat = (food.category || "").trim();
    const foodSub = (food.subCategory || "").trim();

    // فیلتر سرچ نام
    const matchesSearch =
      !searchQuery.trim() ||
      name.includes(searchQuery.trim().toLowerCase());

    // تشخیص تعلق غذا به دسته اصلی بر اساس دسته‌بندی یا زیرمجموعه ذخیره‌شده
    const belongsToCategory = () => {
      if (category === "همه") return true;

      // اگر در دیتابیس مستقیم دسته اصلی ذخیره شده بود
      if (foodCat === category) return true;

      // بررسی آیا دسته غذا زیرمجموعه‌ای از دسته اصلی انتخابی است
      if (category === "غذای اصلی") {
        return (
          foodCat === "غذا" ||
          foodCat === "غذای اصلی" ||
          foodCat === "سنتی" ||
          foodCat === "غذای سنتی" ||
          foodCat === "فست‌فود" ||
          foodCat === "فست فود" ||
          foodCat === "غذای دریایی" ||
          foodCat === "غذای رژیمی"
        );
      }
      if (category === "پیش‌غذا") {
        return foodCat === "پیش‌غذا" || foodCat === "فینگرفود" || foodCat === "سوپ";
      }
      if (category === "سالاد") {
        return foodCat === "سالاد" || foodCat.includes("سالاد") || foodCat === "مجلسی" || foodCat === "رژیمی";
      }
      if (category === "دسر") {
        return foodCat === "دسر" || foodCat.includes("دسر");
      }
      if (category === "نوشیدنی") {
        return foodCat === "نوشیدنی" || foodCat.includes("نوشیدنی");
      }

      return false;
    };

    const matchesCategory = belongsToCategory();

    // فیلتر زیرمجموعه (بررسی هر دو فیلد category و subCategory)
    let matchesSubCategory = true;
    if (subCategory !== "همه") {
      const cleanSub = subCategory.replace("غذای ", "").trim();
      matchesSubCategory =
        foodSub === subCategory ||
        foodSub.includes(subCategory) ||
        foodCat === subCategory ||
        foodCat.includes(cleanSub) ||
        name.includes(subCategory);
    }

    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  const currentSubCategories = subCategoriesMap[category] || [];

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 md:p-12 dir-rtl" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* هدر */}
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

        {/* جستجو */}
        <div className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="اسم غذای دلخواهت رو بنویس..."
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl py-3.5 pr-12 pl-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
          />
          <span className="absolute right-4 top-3.5 text-zinc-500">🔍</span>
        </div>

        {/* دکمه‌های دسته‌بندی اصلی */}
        <div className="flex flex-wrap gap-2.5 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                setSubCategory("همه");
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

        {/* دکمه‌های زیرمجموعه */}
        {currentSubCategories.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
            <span className="text-xs text-zinc-500 ml-2">زیرمجموعه:</span>
            {currentSubCategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSubCategory(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  subCategory === sub
                    ? "bg-zinc-800 text-amber-400 border border-amber-500/40"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* تعداد موارد */}
        <div className="text-xs text-zinc-500 mb-6">
          {filteredFoods.length} مورد برای نمایش
        </div>

        {/* لیست کارت‌ها */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredFoods.map((item) => (
            <div
              key={item?.id}
              onClick={() => setSelectedFoodId(String(item?.id))}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-amber-500/40 transition flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {item?.subCategory ? `${item?.category} • ${item?.subCategory}` : (item?.category || "غذا")}
                  </span>
                  <span className="text-amber-500 text-xs">★</span>
                </div>

                <div className="w-20 h-20 mx-auto my-3 rounded-full border border-amber-500/30 bg-black flex items-center justify-center text-amber-400 text-2xl font-mono overflow-hidden">
                  {item?.image ? (
                    <img
                      src={item.image}
                      alt={item?.name || "غذا"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>Ψ</span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-center mt-3 text-white group-hover:text-amber-400 transition">
                  {item?.name}
                </h3>

                <div className="flex justify-center gap-4 text-xs text-zinc-400 mt-3">
                  <span>🔥 {item?.calories ?? 0} کیلوکالری</span>
                  <span>⏱ {item?.prepTime ?? item?.cookingTime ?? 30} دقیقه</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFoodId(String(item?.id));
                  }}
                  className="text-amber-500 group-hover:text-amber-400 text-xs font-semibold flex items-center justify-center gap-1 mx-auto transition"
                >
                  مواد لازم و جزئیات ←
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredFoods.length === 0 && (
          <div className="text-center py-16 text-zinc-500 text-sm">
            هیچ موردی پیدا نشد.
          </div>
        )}
      </div>

      <FoodRecipeDialog
        foodId={selectedFoodId}
        onClose={() => setSelectedFoodId(null)}
      />
    </div>
  );
}
