import type { Metadata } from "next";
import Link from "next/link";
import SmartMenu from "../../components/SmartMenu";

export const metadata: Metadata = {
  title: "منوی هوشمند | Chef Menu",
  description: "غذای دلخواهت را در منوی شف منو پیدا کن و مواد اولیه، کالری و زمان پخت آن را ببین.",
};

export default function SmartMenuPage() {
  return (
    <main className="smart-menu-page" dir="rtl">
      <div className="smart-menu-page-header">
        <Link href="/" className="chef-back-link">
          <span aria-hidden="true">→</span> بازگشت به صفحه اصلی
        </Link>
        <span className="brand-name" dir="ltr">Chef Menu</span>
      </div>
      <SmartMenu />
    </main>
  );
}
