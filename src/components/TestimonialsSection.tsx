"use client";

interface Testimonial {
  name: string;
  role: string;
  initial: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: "مریم",
    role: "کاربر",
    initial: "م",
    rating: 5,
    text: "ماشین‌حساب مواد اولیه دقیق بود و برای مهمونی خیلی کمکم کرد. UI هم خیلی مرتب و خوش‌رنگه.",
  },
  {
    name: "پوریا",
    role: "کاربر",
    initial: "پ",
    rating: 5,
    text: "پیشنهادهای شخصی‌سازی‌شده باعث شد سریع‌تر غذاهای مورد علاقه‌م رو پیدا کنم. عالیه.",
  },
  {
    name: "سارا",
    role: "کاربر",
    initial: "س",
    rating: 5,
    text: "بخش ارزش غذایی خیلی کاربردیه. اگر عکس غذا رو هم تحلیل کنه، فوق‌العاده‌تر می‌شه.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full py-12 px-6 bg-zinc-950 flex justify-center" dir="rtl">
      {/* کادر اصلی بزرگ با گوشه‌های گرد و زیبا */}
      <div className="w-full max-w-6xl bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="text-right mb-8">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            تجربه کاربران
          </h3>
          <p className="text-zinc-400 text-sm md:text-base mt-2">
            چند نظر واقعی (فعلاً نمونه) درباره دقت ماشین‌حساب و کاربردی بودن بخش‌ها.
          </p>
        </div>

        {/* سه کادر نظرات با گوشه‌های گرد نرم */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700 transition shadow-lg"
            >
              {/* بخش بالا: امتیاز ستاره‌ها و پروفایل کاربر */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-500" aria-label={`${item.rating} از ۵ ستاره`}>
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white">{item.name}</div>
                    <div className="text-xs text-zinc-400">{item.role}</div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-200 shrink-0">
                    {item.initial}
                  </div>
                </div>
              </div>

              {/* متن نظر */}
              <p className="text-zinc-300 text-sm leading-relaxed text-right">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
