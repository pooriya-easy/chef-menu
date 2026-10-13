"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Hero from "../components/Hero";
import SmartSearch from "../components/SmartSearch";
import PersonalizedSuggestions from "../components/PersonalizedSuggestions";
import RandomFoodSuggestion from "../components/RandomFoodSuggestion";
import TestimonialsSection from "../components/TestimonialsSection";
import Footer from "../components/Footer";

const links = [
  { id: "home", label: "خانه", icon: "" },
  { id: "smart-menu-link", label: "منوی هوشمند", icon: "" },
  { id: "calorie-scanner", label: " کالری اسکنر ", icon: "" },
  { id: "random-food-section", label: "غذای تصادفی", icon: "" },
];

function Hat({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 15a5 5 0 0 1-2-9 5 5 0 0 1 9-2 5 5 0 0 1 5 9v7H7Z" />
      <path d="M7 16h12M11 9v3m4-3v3" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const menuButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const syncHash = () => {
      const id = window.location.hash.slice(1);
      // اصلاح: حذف ریدایرکت خودکار به صفحه دیگر و مدیریت وضعیت فعال
      if (id) {
        setActive(links.some((link) => link.id === id) ? id : "home");
      } else {
        setActive("home");
      }
      setMenuOpen(false);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const id = window.location.hash.slice(1);
      if (id) {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [active]);

  return (
    <>
      <a href="#main" className="skip-link">رفتن به محتوای اصلی</a>
      <header className="site-header" dir="rtl" onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); }
      }}>
        <div className="nav-container">
          <a className="brand" href="#home" aria-label="Chef Menu — صفحه اصلی" onClick={() => { setActive("home"); setMenuOpen(false); }}>
            <span className="brand-mark"><Hat /></span>
            <span className="brand-name" dir="ltr">Chef Menu</span>
          </a>
          <nav id="main-navigation" className={`navigation ${menuOpen ? "is-open" : ""}`} aria-label="منوی اصلی">
            {links.map((link) => (
              <Link 
                key={link.id} 
                href={link.id === "smart-menu-link" ? "/smart-menu" : `#${link.id}`} 
                className={`nav-link ${active === link.id ? "active" : ""}`} 
                aria-current={active === link.id ? "page" : undefined} 
                onClick={() => { 
                  if (link.id !== "smart-menu-link") setActive(link.id); 
                  setMenuOpen(false); 
                }}
              >
                <span className="nav-icon" aria-hidden="true">{link.icon}</span>
                <span>{link.label}</span>
                {link.id === "smart-menu-link" && <span className="new-badge">جدید</span>}
              </Link>
            ))}
            <span className="mobile-note">یک همراه خوش‌سلیقه برای هر روز شما</span>
          </nav>
          <div className="nav-actions">
            <Link href="/login" className="profile-button" aria-label="ورود / حساب کاربری">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
              </svg>
              <span>ورود / حساب کاربری</span>
            </Link>
            <button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? "بستن منو" : "باز کردن منو"} aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d={menuOpen ? "m6 6 12 12M6 18 18 6" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* اصلاح شرط رندر برای اطمینان از نمایش محتوای اصلی در حالت home */}
        {(active === "home" || active === "random-food-section" || active === "smart-menu-link" || active === "calorie-scanner") ? (
          <>
            <div id="home"><Hero /></div>
            <div id="smart-menu-link"><SmartSearch /></div>
            <PersonalizedSuggestions />
            
            <div id="random-food-section">
              <RandomFoodSuggestion />
            </div>

            <section className="py-16 px-4 bg-zinc-950 text-zinc-100">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    امکانات ویژه
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold mt-3 tracking-tight">
                    امکانات ویژه سرآشپز من
                  </h2>
                  <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-xl mx-auto">
                    پنج همراه کاربردی برای انتخاب راحت‌تر، اندازه‌های دقیق‌تر و آشپزی به سلیقه‌ی خودت.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="group relative bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg border border-amber-500/20 group-hover:scale-110 transition-transform">۰۱</div>
                        <span className="text-xs text-zinc-500">منوی هوشمند</span>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-100 mb-2">انتخاب هوشمندانه غذا</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">غذای دلخواهت را انتخاب کن و تعداد نفرات را تنظیم کن؛ یک منوی مناسب برای جمع خودت بچین.</p>
                    </div>
                    <Link href="/smart-menu" className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center text-xs font-medium text-amber-400 group-hover:translate-x-1 transition-transform cursor-pointer">
                      ورود به منوی هوشمند ←
                    </Link>
                  </div>

                  <div className="group relative bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg border border-amber-500/20 group-hover:scale-110 transition-transform">۰۲</div>
                        <span className="text-xs text-zinc-500">ماشین حساب</span>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-100 mb-2">محاسبه مواد اولیه</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">مقدار دقیق مواد اولیه را بر اساس تعداد مهمانان محاسبه کن؛ به اندازه بپز و با خیال راحت پذیرایی کن.</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center text-xs font-medium text-amber-400 group-hover:translate-x-1 transition-transform cursor-pointer">
                      محاسبه دقیق مواد ←
                    </div>
                  </div>

                  <div id="calorie-scanner" className="group relative bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg border border-amber-500/20 group-hover:scale-110 transition-transform">۰۳</div>
                        <span className="text-xs text-zinc-500">اسکنر کالری</span>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-100 mb-2">اسکنر کالری هوشمند</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">عکس غذایت را آپلود کن و برآورد کالری و ارزش غذایی آن را ببین؛ آگاهانه‌تر انتخاب کن.</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center text-xs font-medium text-amber-400 group-hover:translate-x-1 transition-transform cursor-pointer">
                      آپلود عکس غذا ←
                    </div>
                  </div>

                  <div className="group relative bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg border border-amber-500/20 group-hover:scale-110 transition-transform">۰۴</div>
                        <span className="text-xs text-zinc-500">پیشنهاد شخصی</span>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-100 mb-2">پیشنهاد شخصی</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">محتوا و دستورپخت‌های هماهنگ با علایقت پیدا کن و طعم‌های تازه‌ای مطابق سلیقه‌ات کشف کن.</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center text-xs font-medium text-amber-400 group-hover:translate-x-1 transition-transform cursor-pointer">
                      کشف طعم‌های تازه ←
                    </div>
                  </div>

                  <div 
                    onClick={() => { setActive("random-food-section"); window.location.hash = "random-food-section"; }}
                    className="group relative bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between md:col-span-2 lg:col-span-1 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg border border-amber-500/20 group-hover:scale-110 transition-transform">۰۵</div>
                        <span className="text-xs text-zinc-500">غذای تصادفی</span>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-100 mb-2">غذای تصادفی</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">نمی‌دانی امروز چه بپزی؟ یک غذای تصادفی متناسب با سلیقه‌ات انتخاب کن و خوشمزه غافلگیر شو.</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center text-xs font-medium text-amber-400 group-hover:translate-x-1 transition-transform">
                      شانس من چه غذاییه؟ ←
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <TestimonialsSection />
          </>
        ) : (
          <section className="feature-placeholder" id={active} aria-labelledby="feature-title">
            <h1 id="feature-title">{links.find((link) => link.id === active)?.label}</h1>
            <p>این بخش در مرحله‌ی بعدی شف منو آماده می‌شود. به‌زودی با ایده‌های خوشمزه کنار شما هستیم.</p>
            <button onClick={() => setActive("home")} className="profile-button">بازگشت به خانه</button>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
