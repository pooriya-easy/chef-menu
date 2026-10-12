"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./NutritionScanner.module.css";

const sampleNutrition = [
  { label: "کالری", value: "۵۲۰", unit: "کیلوکالری", percent: 65 },
  { label: "پروتئین", value: "۲۸", unit: "گرم", percent: 56 },
  { label: "کربوهیدرات", value: "۴۵", unit: "گرم", percent: 45 },
  { label: "چربی", value: "۱۴", unit: "گرم", percent: 28 },
];
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const formatNumber = new Intl.NumberFormat("fa-IR");

export default function NutritionScanner({ standalone = false }: { standalone?: boolean }) {
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const Heading = standalone ? "h1" : "h2";

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview.url); };
  }, [preview]);

  function selectFile(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    setShowResults(false);
    setPreview(null);
    const file = files[0];
    if (files.length !== 1) {
      setError("لطفاً هر بار فقط یک تصویر انتخاب کن.");
    } else if (!allowedTypes.includes(file.type)) {
      setError("لطفاً یک تصویر JPG، PNG یا WebP انتخاب کن.");
    } else if (!file.size || file.size > 10 * 1024 * 1024) {
      setError("تصویر باید غیرخالی و حداکثر ۱۰ مگابایت باشد.");
    } else {
      setPreview({ url: URL.createObjectURL(file), name: file.name });
    }
  }

  function reset() {
    setPreview(null);
    setShowResults(false);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <section id="scanner" className={styles.section} dir="rtl">
      <div className={styles.panel}>
        <div className={`${styles.body} ${showResults ? styles.withResults : ""}`}>
          <div className={`${styles.dropzone} ${dragging ? styles.dragging : ""}`}
            onDragEnter={(event) => { event.preventDefault(); dragDepth.current += 1; setDragging(true); }}
            onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; }}
            onDragLeave={(event) => { event.preventDefault(); dragDepth.current = Math.max(0, dragDepth.current - 1); if (!dragDepth.current) setDragging(false); }}
            onDrop={(event) => { event.preventDefault(); dragDepth.current = 0; setDragging(false); selectFile(event.dataTransfer.files); }}>
            {preview ? (
              <figure className={styles.preview}>
                {/* Local blob preview: no server image optimization or upload is needed. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={preview.url} src={preview.url} alt="پیش‌نمایش عکس غذای انتخاب‌شده" width={440} height={240}
                  onLoad={() => setShowResults(true)}
                  onError={() => { setPreview(null); setShowResults(false); setError("این تصویر قابل نمایش نیست؛ لطفاً عکس دیگری انتخاب کن."); }} />
                <figcaption>{preview.name}</figcaption>
              </figure>
            ) : (
              <>
                <span className={styles.camera} aria-hidden="true"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m8 5 2-2h4l2 2h5v15H3V5h5Z" /><circle cx="12" cy="12" r="4" /></svg></span>
              </>
            )}
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden aria-label="انتخاب عکس غذا"
              onChange={(event) => { selectFile(event.target.files); event.target.value = ""; }} />
            <div className={styles.actions}>
              <button type="button" className={styles.primary} onClick={() => inputRef.current?.click()}>{preview ? "انتخاب تصویر دیگر" : "انتخاب تصویر"}</button>
              <button type="button" className={styles.secondary} onClick={() => { reset(); setShowResults(true); }}>تست با نتیجه نمونه</button>
            </div>
            {error && <p className={styles.error} role="alert">{error}</p>}
          </div>
          {showResults && (
            <div className={styles.results} aria-labelledby="nutrition-results-title">
              <div className={styles.resultsHeading}><h3 id="nutrition-results-title">ارزش غذایی نمونه</h3><span className={styles.demoLabel}>نمایشی</span></div>
              <div className={styles.metrics}>
                {sampleNutrition.map((item) => (
                  <div key={item.label} className={styles.metric}>
                    <div className={styles.metricLabel}><span>{item.label}</span><span><strong>{item.value}</strong> {item.unit}</span></div>
                    <div className={styles.bar} role="progressbar" aria-label={`${item.label} — درصد نمایشی`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.percent} aria-valuetext={`${formatNumber.format(item.percent)} درصد نمایشی`}><span style={{ width: `${item.percent}%` }} /></div>
                    <span className={styles.percent}>{formatNumber.format(item.percent)}٪</span>
                  </div>
                ))}
              </div>
              <p className={styles.hint}>درصد نوارها صرفاً نمایشی است و سهم نیاز روزانه را نشان نمی‌دهد.</p>
              <button type="button" className={styles.clear} onClick={reset}>پاک کردن نتیجه و تصویر</button>
            </div>
          )}
        </div>
        <p className={styles.srOnly} role="status">{showResults ? "نتایج نمونه آماده است: ۵۲۰ کیلوکالری، ۲۸ گرم پروتئین، ۴۵ گرم کربوهیدرات و ۱۴ گرم چربی." : ""}</p>
        {standalone && <a href="#home" className={styles.back}>بازگشت به خانه ←</a>}
      </div>
    </section>
  );
}
