import Link from "next/link";
import styles from "./Features.module.css";

const features = [
  {
    id: "menu",
    title: "منوی هوشمند",
    description: "غذای دلخواهت را انتخاب کن و تعداد نفرات را تنظیم کن؛ یک منوی مناسب برای جمع خودت بچین.",
    icon: "M8 4h12v17H4V4h4m0-2h8v4H8V2ZM8 11h8M8 16h5",
  },
  {
    id: "ingredients",
    title: "محاسبه مواد اولیه",
    description: "مقدار دقیق مواد اولیه را بر اساس تعداد مهمانان محاسبه کن؛ به اندازه بپز و با خیال راحت پذیرایی کن.",
    icon: "M5 3h14v18H5V3Zm3 3h8v4H8V6Zm0 8h1m6 0h1m-8 4h1m6 0h1",
  },
  {
    id: "calories",
    title: "اسکنر کالری هوشمند",
    description: "عکس غذایت را آپلود کن و برآورد کالری و ارزش غذایی آن را ببین؛ آگاهانه‌تر انتخاب کن.",
    icon: "M8 5l2-2h4l2 2h5v15H3V5h5Zm8 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  },
  {
    id: "personal",
    title: "پیشنهاد شخصی",
    description: "محتوا و دستورپخت‌های هماهنگ با علایقت پیدا کن و طعم‌های تازه‌ای مطابق سلیقه‌ات کشف کن.",
    icon: "M12 21 3.5 12.5A5.5 5.5 0 0 1 12 5.6a5.5 5.5 0 0 1 8.5 6.9L12 21Z",
  },
  {
    id: "random",
    title: "غذای تصادفی",
    description: "نمی‌دانی امروز چه بپزی؟ یک غذای تصادفی متناسب با سلیقه‌ات انتخاب کن و خوشمزه غافلگیر شو.",
    icon: "M3 6h3c5 0 7 12 12 12h3m-4-4 4 4-4 4M3 18h3c2 0 3-2 4-4m4-4c1-2 2-4 4-4h3m-4-4 4 4-4 4",
  },
];

export default function Features() {
  return (
    <section className={styles.section} dir="rtl" aria-labelledby="features-title">
      <div className={styles.heading}>
        <span className={styles.eyebrow}>همراه تو، از انتخاب غذا تا آخرین لقمه</span>
        <h2 id="features-title">امکانات ویژه سرآشپز من</h2>
        <p>پنج همراه کاربردی برای انتخاب راحت‌تر، اندازه‌های دقیق‌تر و آشپزی به سلیقه‌ی خودت.</p>
      </div>
      <ul className={styles.grid}>
        {features.map((feature, index) => (
          <li key={feature.id} className={styles.card}>
            <article className={styles.cardContent} aria-labelledby={`feature-card-${feature.id}`}>
              <div className={styles.cardTop}>
                <span className={styles.icon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={feature.icon} /></svg>
                </span>
                <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0").replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)])}</span>
              </div>
              <h3 id={`feature-card-${feature.id}`}>{feature.title}</h3>
              <p>{feature.description}</p>
              {feature.id === "menu" && <Link href="/smart-menu" className={styles.cardLink} aria-labelledby={`feature-card-${feature.id}`}><span aria-hidden="true">ورود به منوی هوشمند ←</span></Link>}
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
