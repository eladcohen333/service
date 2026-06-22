import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "אלעד כהן | יועץ קריירה GenAI & DevOps",
  description: "יועץ קריירה ומנטור לכניסה לשוק העבודה בתחומי GenAI, RAG, ו-DevOps",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="bg-gray-950 text-gray-100 antialiased" style={{ fontFamily: "var(--font-heebo), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
