import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Chef Menu | شف منو",
  description: "شف منو، دستیار خوش‌سلیقه‌ی آشپزخانه‌ی شما",
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>;
}
