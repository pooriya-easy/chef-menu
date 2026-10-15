import Link from 'next/link';

export default function CalorieScannerPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full bg-[#121214] border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center">
        
        {/* آیکون یا ایموجی جذاب */}
        <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">
          📸
        </div>

        {/* عنوان */}
        <h1 className="text-3xl font-bold mb-4 text-orange-500">
          کالری اسکنر هوشمند
        </h1>

        {/* توضیحات */}
        <p className="text-zinc-300 text-base leading-relaxed mb-8">
          به کمک این قابلیت پیشرفته، قادرید تنها با آپلود یا اسکن عکس غذای خود، میزان دقیق کالری، پروتئین، کربوهیدرات و مواد مغذی آن را در کسری از ثانیه استخراج کنید و برنامه رژیم غذایی خود را هوشمندانه‌تر مدیریت نمایید.
        </p>

        {/* پیام اعلام آمادگی در آینده با سبقه پروژه */}
        <div className="bg-zinc-900/80 border border-orange-500/30 rounded-xl p-5 mb-8">
          <p className="text-orange-400 font-medium text-sm sm:text-base">
            🚀 به زودی در نسخه‌های بعدی «شف منو»؛ این بخش در حال توسعه نهایی است و در آینده‌ای نزدیک با قابلیت‌های هوش مصنوعی فعال خواهد شد.
          </p>
        </div>

        {/* دکمه بازگشت به خانه */}
        <Link
          href="/"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20"
        >
          بازگشت به صفحه اصلی
        </Link>

      </div>
    </main>
  );
}
