import Link from "next/link";
import styles from "./Hero.module.css";

function FoodIllustration() {
  return (
    <svg viewBox="0 0 480 480" className={styles.food} role="img" aria-label="بشقاب مرغ گریل‌شده با برنج، گوجه و سبزیجات تازه">
      <defs>
        <radialGradient id="plate"><stop stopColor="#fff" /><stop offset=".8" stopColor="#fffdf9" /><stop offset="1" stopColor="#e9e1d5" /></radialGradient>
        <linearGradient id="chicken" x2="1" y2="1"><stop stopColor="#ffc36b" /><stop offset=".5" stopColor="#e89539" /><stop offset="1" stopColor="#b95b22" /></linearGradient>
        <filter id="plate-shadow" x="-25%" y="-25%" width="150%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#6c4621" floodOpacity=".15" /></filter>
      </defs>
      <circle cx="240" cy="240" r="211" fill="#f9eddd" />
      <g filter="url(#plate-shadow)">
        <circle cx="240" cy="232" r="186" fill="url(#plate)" />
        <circle cx="240" cy="232" r="156" fill="#f7f1e7" stroke="#e8dfd1" />
      </g>
      <g fill="#6c8b46" stroke="#4c713a" strokeWidth="2">
        <path d="M123 239c-58-39-36-90 7-68-4-60 49-62 57-14 39-39 70-9 40 31-27 36-59 51-104 51Z" />
        <path d="M278 271c41-38 93-24 72 18 53-1 54 44 10 51 25 37-9 61-37 35-36-33-43-64-45-104Z" />
      </g>
      <g stroke="#a8be7a" strokeWidth="2" fill="none"><path d="m117 184 57 48m-27-70 27 70 30-48m112 100 25 68m-34-38 28 9 18-24" /></g>
      <path d="M152 229c-25 12-45 69-16 98 27 30 96 28 121 1 23-26 8-81-22-99-22-13-59-14-83 0Z" fill="#fff9df" />
      <g stroke="#e3cf98" strokeWidth="3" strokeLinecap="round">
        {Array.from({ length: 35 }, (_, i) => <path key={i} d={`m${149 + (i % 7) * 14 + (Math.floor(i / 7) % 2) * 5} ${246 + Math.floor(i / 7) * 17} 5 -4`} />)}
      </g>
      <g transform="rotate(-32 267 204)">
        <path d="M216 127c26-17 70-8 87 20 14 23 24 93-1 122-16 21-69 20-89-3-20-25-24-118 3-139Z" fill="url(#chicken)" stroke="#c67a31" strokeWidth="3" />
        <g stroke="#8c481f" strokeWidth="7" strokeLinecap="round" opacity=".75"><path d="M213 158h77m-80 26h89m-88 27h91m-87 27h84m-72 25h56" /></g>
        <path d="M221 138c17-7 40-3 53 6" fill="none" stroke="#ffda90" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g fill="#ed6345" stroke="#c94330" strokeWidth="2">
        <circle cx="134" cy="207" r="23" /><circle cx="335" cy="251" r="24" /><circle cx="293" cy="341" r="19" />
      </g>
      <g stroke="#ffbd8f" strokeWidth="3" fill="none"><path d="m124 195 19 22m-19-2 18-18m182 43 22 23m-24-1 24-20m-61 89 16 20m-17-2 19-17" /></g>
      <g transform="translate(170 135) rotate(-20)"><path d="M-34 0a34 34 0 0 1 68 0Z" fill="#ffe18a" stroke="#efbe43" strokeWidth="5" /><path d="M-24-3h48M0-4v-22m-4 23-15-16M4-3l15-16" stroke="#fff9d4" strokeWidth="3" /></g>
      <g fill="#466c39"><ellipse cx="242" cy="281" rx="9" ry="19" transform="rotate(40 242 281)" /><ellipse cx="260" cy="281" rx="9" ry="19" transform="rotate(-40 260 281)" /><ellipse cx="250" cy="260" rx="8" ry="16" /></g>
      <g fill="#7f592f"><circle cx="193" cy="321" r="2" /><circle cx="175" cy="262" r="2" /><circle cx="222" cy="306" r="2" /><circle cx="274" cy="180" r="2" /></g>
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="home" className={styles.hero} dir="rtl" aria-labelledby="hero-title">
      <div className={styles.content}>
        <div className={styles.badge}>
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 15a5 5 0 0 1-2-9 5 5 0 0 1 9-2 5 5 0 0 1 5 9v7H7Z" /><path d="M7 16h12" /></svg>
          دستیار هوشمند آشپزی شما
        </div>
        <h1 id="hero-title" className={styles.title}>آشپزی هوشمند،<br /> سریع و به اندازه؛<br /> با <span>سرآشپز من</span></h1>
        <p className={styles.description}>مواد اولیه را دقیق برای هر تعداد مهمان محاسبه کن، ارزش غذایی غذایت را با یک عکس بسنج و هر روز ایده‌های جذاب آشپزی بگیر.</p>
        <div className={styles.actions}>
          <Link href="/smart-menu" className={styles.primary}>شروع ماجراجویی آشپزی <span aria-hidden="true">←</span></Link>
          <a href="#scanner" className={styles.secondary}>اسکن هوشمند غذا</a>
        </div>
      </div>
      <div className={styles.visual}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>یک بشقاب خوشمزه، یک انتخاب هوشمند</span>
          <FoodIllustration />
          <span className={styles.cardCaption}>تازه، خوش‌طعم و به اندازه‌ی شما</span>
        </div>
        <div className={`${styles.floatingBadge} ${styles.calories}`}><span className={styles.badgeIcon} aria-hidden="true">✦</span><span>کالری: <strong>۴۵۰ کیلوکالری</strong></span></div>
        <div className={`${styles.floatingBadge} ${styles.time}`}><svg className={styles.badgeIcon} width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></svg><span>زمان پخت: <strong>۳۰ دقیقه</strong></span></div>
      </div>
    </section>
  );
}
