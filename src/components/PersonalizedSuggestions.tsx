"use client";

import { useState } from "react";
import Image from "next/image";
import { useFoods } from "../lib/foodStore";
import FoodRecipeDialog from "./FoodRecipeDialog";

export default function PersonalizedSuggestions() {
  const foods = useFoods();
  const [selectedDiet, setSelectedDiet] = useState<string>("همه");
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);

  const diets = [
    { id: "همه", label: "همه غذاها" },
    { id: "سریع", label: "کمتر از ۳۰ دقیقه" },
    { id: "رژیمی", label: "کم‌کالری" },
    { id: "ایرانی", label: "سنتی و اصیل" },
  ];

  // فیلتر هوشمند بر اساس نوع انتخاب
  const filteredFoods = foods.filter((item) => {
    if (selectedDiet === "سریع") {
      const time = parseInt(item.cookingTime || "60", 10);
      return !isNaN(time) && time <= 30;
    }
    if (selectedDiet === "رژیمی") {
      const cal = parseInt(item.calories || "999", 10);
      return !isNaN(cal) && cal <= 400;
    }
    if (selectedDiet === "ایرانی") {
      return item.category === "غذای اصلی";
    }
    return true;
  }).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" dir="rtl">
      {/* تیتر بخش پیشنهاد شخصی */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-zinc-800 gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            پیشنهاد سرآشپز
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3">
            پیشنهادهای شخصی‌سازی‌شده برای شما
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            بر اساس سبک زندگی و علایق غذایی امروزتان انتخاب کنید.
          </p>
        </div>

        {/* فیلترها */}
        <div className="flex flex-wrap gap-2">
          {diets.map((diet) => (
            <button
              key={diet.id}
              onClick={() => setSelectedDiet(diet.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDiet === diet.id
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white"
              }`}
            >
              {diet.label}
            </button>
          ))}
        </div>
      </div>

      {/* کارت‌های پیشنهاد غذا */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredFoods.map((food) => (
          <div
            key={food.id}
            onClick={() => setSelectedFoodId(food.id)}
            className="group bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] w-full bg-zinc-950 overflow-hidden">
                {food.image ? (
                  <Image
                    src={food.image}
                    alt={food.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🍲
                  </div>
                )}
                <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-amber-400 border border-amber-400/30 text-xs px-2.5 py-1 rounded-lg">
                  {food.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition mb-3">
                  {food.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <span className="text-amber-500">🔥</span> {food.calories} کالری
                  </span>
                  <span className="flex items-center gap-1">
                    <span>⏱</span> {food.cookingTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 font-bold text-xs transition duration-300"
              >
                مشاهده دستور پخت
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* دیالوگ دستور پخت */}
      {selectedFoodId && (
        <FoodRecipeDialog
          foodId={selectedFoodId}
          onClose={() => setSelectedFoodId(null)}
        />
      )}
    </div>
  );
}
