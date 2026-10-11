"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Hero from "../components/Hero";
import SmartSearch from "../components/SmartSearch";
import Features from "../components/Features";
import IngredientCalculator from "../components/IngredientCalculator";
import NutritionScanner from "../components/NutritionScanner";
import PersonalizedSuggestions from "../components/PersonalizedSuggestions";
import RandomFoodSuggestion from "../components/RandomFoodSuggestion";
import TestimonialsSection from "../components/TestimonialsSection";
import Footer from "../components/Footer";

const links = [
  { id: "home", label: "خانه", icon: "⌂" },
  { id: "smart-menu", label: "منوی هوشمند", icon: "✧" },
  { id: "calculator", label: "محاسبه مواد", icon: "▦" },
  { id: "scanner", label: "اسکنر کالری", icon: "▣" },
];

function Hat({ className = "" }: { className?: string }) {
  return <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 15a5 5 0 0 1-2-9 5 5 0 0 1 9-2 5 5 0 0 1 5 9v7H7Z" /><path d="M7 16h12M11 9v3m4-3v3" /></svg>;
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
      if (id === "smart-menu") {
        router.replace("/smart-menu");
        return;
      }
      setActive(links.some((link) => link.id === id) ? id : "home");
      setMenuOpen(false);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [router]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const id = window.location.hash.slice(1);
      if (id) document.getElementById(id)?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [active]);

  return (
    <>
      <a href="#main" className="skip-link">رفتن به محتوای اصلی</a>
      <div className="announcement"><span className="tiny-spark">✦</span> کمی خلاقیت، یک دنیا طعم <span className="announcement-divider" /><span>همراه شما در آشپزخانه</span></div>
      <header className="site-header" dir="rtl" onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); }
      }}>
        <div className="nav-container">
          <a className="brand" href="#home" aria-label="Chef Menu — صفحه اصلی" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark"><Hat /></span>
            <span className="brand-name" dir="ltr">Chef Menu</span>
          </a>
          <nav id="main-navigation" className={`navigation ${menuOpen ? "is-open" : ""}`} aria-label="منوی اصلی">
            {links.map((link) => <Link key={link.id} href={link.id === "smart-menu" ? "/smart-menu" : `#${link.id}`} className={`nav-link ${active === link.id ? "active" : ""}`} aria-current={active === link.id ? "page" : undefined} onClick={() => { if (link.id !== "smart-menu") setActive(link.id); setMenuOpen(false); }}><span className="nav-icon" aria-hidden="true">{link.icon}</span><span>{link.label}</span>{link.id === "smart-menu" && <span className="new-badge">جدید</span>}</Link>)}
            <span className="mobile-note">یک همراه خوش‌سلیقه برای هر روز شما</span>
          </nav>
          <div className="nav-actions">
            <Link 
  href="/login" 
  className="profile-button" 
  aria-label="ورود / حساب کاربری"
>
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
  </svg>
  <span>ورود / حساب کاربری</span>
</Link>

            <button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? "بستن منو" : "باز کردن منو"} aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d={menuOpen ? "m6 6 12 12M6 18 18 6" : "M4 6h16M4 12h16M4 18h16"} /></svg></button>
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        {active === "home" ? (
          <>
            <Hero />
            <SmartSearch />
            <Features />
            <IngredientCalculator />
            <NutritionScanner />
            <PersonalizedSuggestions />
            <RandomFoodSuggestion />
            <TestimonialsSection />
          </>
        ) : active === "calculator" ? (
          <IngredientCalculator standalone />
        ) : active === "scanner" ? (
          <NutritionScanner standalone />
        ) : (
          <section className="feature-placeholder" id={active} aria-labelledby="feature-title">
            <h1 id="feature-title">{links.find((link) => link.id === active)?.label}</h1>
            <p>این بخش در مرحله‌ی بعدی شف منو آماده می‌شود. به‌زودی با ایده‌های خوشمزه کنار شما هستیم.</p>
            <a href="#home" className="profile-button">بازگشت به خانه</a>
          </section>
        )}
      </main>
      <Footer />
      <dialog ref={dialog} className="profile-dialog" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <button className="dialog-close" aria-label="بستن" onClick={() => dialog.current?.close()}>×</button><Hat /><h2>به شف منو خوش آمدید</h2><p>ورود و پروفایل در مرحله‌ی بعدی فعال می‌شود.</p><button className="profile-button" onClick={() => dialog.current?.close()}>متوجه شدم</button>
      </dialog>
    </>
  );
}
