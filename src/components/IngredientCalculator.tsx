"use client";

import { useState } from "react";

interface IngredientCalculatorProps {
  standalone?: boolean;
}

export default function IngredientCalculator({ standalone = false }: IngredientCalculatorProps) {
  const [servings, setServings] = useState(2);

  return (
    <section id="calculator" className={`w-full py-10 px-4 bg-black text-white ${standalone ? "min-h-screen" : ""}`}>
      <div className="max-w-2xl mx-auto border border-zinc-800 rounded-2xl p-6 bg-zinc-950/70">
        <h2 className="text-xl font-bold mb-4 text-center text-amber-500">ماشین‌حساب هوشمند مواد اولیه</h2>
        
        {/* بخش تنظیم تعداد نفرات */}
        <div className="flex items-center justify-center gap-4 my-6">
          <button
            onClick={() => setServings((prev) => Math.max(1, prev - 1))}
            className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900 text-xl font-bold hover:border-amber-500 transition-colors"
          >
            -
          </button>
          <span className="text-lg font-semibold px-4">
            تعداد نفرات: <span className="text-amber-400">{servings}</span> نفر
          </span>
          <button
            onClick={() => setServings((prev) => prev + 1)}
            className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900 text-xl font-bold hover:border-amber-500 transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </section>
  );
}
