"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Hero from "../components/Hero";
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
      <path d="M7 15a5 5 0 0 1-2-9 5 5 0 0 1 9-2 5 5 0 0 1 9-2 5 5 0 0 1 5 9v7H7Z" />
      <path d="M7 16h12M11 9v3m4-3v3" />
    </svg>
  );
}

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
            <span className="brand-mark"><Hat /></span>
            <span className="brand-name" dir="ltr">Chef Menu</span>
          </Link>
          <nav id="main-navigation" className={`navigation ${menuOpen ? "is-open" : ""}`} aria-label="منوی اصلی">
            {links.map((link) => (
              <Link 
                key={link.id} 
                href={link.id === "smart-menu-link" ? "/smart-menu" : `#${link.id}`} 
                className={`nav-link ${active === link.id ? "active" : ""}`} 
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
        
        {/* ۲. بخش پیشنهادهای شخصی‌سازی‌شده دقیقاً همانند تصویر ارسالی */}
        <section className="w-full py-8 bg-zinc-950">
          <PersonalizedSuggestions />
        </section>
        
        {/* ۳. بخش غذای تصادفی */}
        <div id="random-food-section">
          <RandomFoodSuggestion />
        </div>

        {/* ۴. امکانات ویژه */}
        <section className="py-16 px-4 bg-zinc-950 text-zinc-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                امکانات ویژه
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold mt-3 tracking-tight">
                امکانات ویژه سرآشپز من
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group relative bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all">
                <h3 className="text-lg font-bold text-zinc-100 mb-2">انتخاب هوشمندانه غذا</h3>
                <p className="text-zinc-400 text-sm mb-4">غذای دلخواهت را انتخاب کن و تعداد نفرات را تنظیم کن.</p>
                <Link href="/smart-menu" className="text-xs font-medium text-amber-400">ورود به منوی هوشمند ←</Link>
              </div>
              {/* سایر کارت‌ها */}
            </div>
          </div>
        </section>

        <TestimonialsSection />
      </main>

      <Footer />
    </>
  );
}
