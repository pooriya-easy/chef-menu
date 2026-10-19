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
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffffff"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 13.87A4 4 0 0 1 7.41 6.5 5.11 5.11 0 0 1 12 3a5.25 5.25 0 0 1 5.1 3.5A4 4 0 0 1 18 13.87V21H6Z" />
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
        <div id="home"><Hero /></div>
        
        <section className="w-full py-8 bg-zinc-950">
          <PersonalizedSuggestions />
        </section>
        
        <div id="random-food-section">
          <RandomFoodSuggestion />
        </div>

        {/* کارت طراح و سازنده سایت با عکس شخصی و راه‌های ارتباطی */}
        <section className="w-full py-12 px-6 bg-zinc-950 flex justify-center" dir="rtl">
          <div className="relative w-full max-w-6xl bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl hover:border-amber-500/40 transition">
            
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
              <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs md:text-sm font-bold tracking-wide">
                طراح و سازنده سایت ✦
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10 mt-6 md:mt-2">
              {/* عکس شفاف و باکیفیت */}
              <div className="relative w-44 h-52 md:w-52 md:h-60 rounded-2xl border-2 border-amber-500/40 bg-zinc-950 overflow-hidden shrink-0 shadow-2xl">
                <Image 
                  src="/pouria.webp" 
                  alt="پوریا مولوی - طراح و توسعه‌دهنده" 
                  fill 
                  priority
                  quality={100}
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 176px, 208px"
                />
              </div>

              <div className="text-center md:text-right flex-1">
                {/* نام با فونت نرم و گرد دقیقاً مشابه تصویر نمونه، یکدست سفید */}
                <h3 
                  className="text-2xl md:text-3xl font-normal text-white tracking-wide"
                  style={{ fontFamily: "'Vazirmatn RD', 'Vazirmatn', system-ui, sans-serif" }}
                >
                  پوریا مولوی
                </h3>
                <p className="text-amber-400/80 text-xs md:text-sm font-medium mt-1">
                  دانش‌آموخته دوره کارآموزی وایب‌کدینگ
                </p>
                <p className="text-zinc-400 text-sm md:text-base mt-4 leading-relaxed max-w-3xl">
                  طراحی و پیاده‌سازی پروژه «Chef Menu» ، علاقه مند به آشپزی ، برنامه نویسی و راید .
                </p>

                {/* خط جداکننده و عنوان راه‌های ارتباطی */}
                <div className="w-full h-px bg-zinc-800 my-6"></div>
                <h4 className="text-sm font-medium text-zinc-300 mb-4 text-right">راه‌های ارتباطی</h4>

                {/* سه کادر راه‌های ارتباطی (بدون آیدی روی ظاهر کادر) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* تلگرام */}
                  <a 
                    href="https://t.me/Pooriya_Eas" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 hover:border-[#24A1DE] transition group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#24A1DE]/10 flex items-center justify-center text-[#24A1DE] shrink-0 group-hover:bg-[#24A1DE] group-hover:text-white transition">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.73-.53.36-1.01.54-1.44.53-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.25.38-.51 1.05-.78 4.11-1.79 6.85-2.97 8.22-3.55 3.91-1.66 4.72-1.95 5.25-1.96.12 0 .39.03.56.17.14.12.18.28.2.4-.01.07.01.23-.03.35z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-white">تلگرام</span>
                  </a>

                  {/* بله */}
                  <a 
                    href="https://ble.ir/pooriya_e" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 hover:border-[#00ACEE] transition group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#00ACEE]/10 flex items-center justify-center text-[#00ACEE] shrink-0 group-hover:bg-[#00ACEE] group-hover:text-white transition">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-white">بله</span>
                  </a>

                  {/* اینستاگرام */}
                  <a 
                    href="https://instagram.com/pooriya_od" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 hover:border-[#E1306C] transition group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#E1306C]/10 flex items-center justify-center text-[#E1306C] shrink-0 group-hover:bg-[#E1306C] group-hover:text-white transition">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-white">اینستاگرام</span>
                  </a>
                </div>

              </div>
            </div>

          </div>
        </section>

        <TestimonialsSection />
      </main>

      <Footer />
    </>
  );
}
