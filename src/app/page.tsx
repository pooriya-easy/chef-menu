"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Hero from "../components/Hero";
import PersonalizedSuggestions from "../components/PersonalizedSuggestions";
import RandomFoodSuggestion from "../components/RandomFoodSuggestion";
import TestimonialsSection from "../components/TestimonialsSection";
import Footer from "../components/Footer";

const links = [
  { id: "home", label: "خانه", icon: "" },
  { id: "smart-menu-link", label: "منوی هوشمند", icon: "" },
  { id: "calorie-scanner", label: "کالری اسکنر", icon: "" },
  { id: "random-food-section", label: "غذای تصادفی", icon: "" },
];

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const syncHash = () => {
      const id = window.location.hash.slice(1);
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

  return (
    <>
      <a href="#main" className="skip-link">رفتن به محتوای اصلی</a>
      <header className="site-header" dir="rtl">
        <div className="nav-container">
          <Link className="brand" href="/" aria-label="Chef Menu — صفحه اصلی" onClick={() => { setActive("home"); setMenuOpen(false); }}>
            <span className="brand-mark">
              {/* کلاه آشپزی سفید بدون قاب مربعی */}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-white" aria-hidden="true">
                <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 10.18 0A4 4 0 0 1 18 13.87V21H6Z" />
                <line x1="6" y1="17" x2="18" y2="17" />
                <line x1="10" y1="9" x2="10" y2="14" />
                <line x1="14" y1="9" x2="14" y2="14" />
              </svg>
            </span>
            <span className="brand-name" dir="ltr">Chef Menu</span>
          </Link>
          <nav id="main-navigation" className={`navigation ${menuOpen ? "is-open" : ""}`} aria-label="منوی اصلی">
            {links.map((link) => {
              let href = `#${link.id}`;
              if (link.id === "smart-menu-link") href = "/smart-menu";
              if (link.id === "calorie-scanner") href = "/calorie-scanner";

              return (
                <Link 
                  key={link.id} 
                  href={href} 
                  className={`nav-link ${active === link.id ? "active" : ""}`} 
                  onClick={() => { 
                    if (link.id !== "smart-menu-link" && link.id !== "calorie-scanner") setActive(link.id); 
                    setMenuOpen(false); 
                  }}
                >
                  <span className="nav-icon" aria-hidden="true">{link.icon}</span>
                  <span>{link.label}</span>
                  {(link.id === "smart-menu-link" || link.id === "calorie-scanner") && <span className="new-badge">جدید</span>}
                </Link>
              );
            })}
          </nav>
          <div className="nav-actions">
            <Link href="/login" className="profile-button" aria-label="ورود / حساب کاربری">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
              </svg>
              <span>ورود / حساب کاربری</span>
            </Link>
            <button className="menu-toggle" aria-label={menuOpen ? "بستن منو" : "باز کردن منو"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d={menuOpen ? "m6 6 12 12M6 18 18 6" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* ۱. بخش هیرو (تصویر بشقاب غذا) */}
        <div id="home"><Hero /></div>
        
        {/* ۲. بخش پیشنهادهای شخصی‌سازی‌شده */}
        <section className="w-full py-8 bg-zinc-950">
          <PersonalizedSuggestions />
        </section>
        
        {/* ۳. بخش غذای تصادفی */}
        <div id="random-food-section">
          <RandomFoodSuggestion />
        </div>

        {/* ۴. کارت طراح و سازنده سایت - اصلاح رنگ پس‌زمینه برای یکدستی کامل */}
        <section className="w-full py-12 px-6 bg-zinc-950 flex justify-center" dir="rtl">
          <div className="relative w-full max-w-6xl bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl hover:border-amber-500/40 transition">
            
            {/* برچسب گوشه بالا سمت راست */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
              <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs md:text-sm font-bold tracking-wide">
                طراح و سازنده سایت ✦
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 mt-2 md:mt-0">
              {/* آواتار / عکس سازنده */}
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-2 border-amber-500/40 bg-zinc-950 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                <div className="text-amber-400 text-4xl font-mono">
                  👨‍🍳
                </div>
              </div>

              {/* اطلاعات شخصی */}
              <div className="text-center md:text-right flex-1">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                  پوریا <span className="text-amber-500 text-lg md:text-xl font-normal">(توسعه‌دهنده فرانت‌اند)</span>
                </h3>
                <p className="text-amber-400/80 text-xs md:text-sm font-medium mt-1">
                  دانش‌آموخته دوره کارآموزی وایب‌کدینگ
                </p>
                <p className="text-zinc-400 text-sm md:text-base mt-3 leading-relaxed">
                  طراحی و پیاده‌سازی پروژه «Chef Menu» با Next.js، Tailwind CSS و TypeScript؛ از ایده‌پردازی و طراحی منوی هوشمند تا محاسبه‌گر مواد اولیه و اسکنر کالری.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ۵. تجربه کاربران */}
        <TestimonialsSection />
      </main>

      <Footer />
    </>
  );
}
