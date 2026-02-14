import type { Metadata } from "next";
import { Sarabun, Caveat } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";

const sarabun = Sarabun({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin", "thai"],
  variable: "--font-sarabun",
});

const caveat = Caveat({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-caveat",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Happy Valentine's Day - จดหมายความรัก",
  description: "สร้างจดหมายความรักสุดพิเศษสำหรับคนที่คุณรัก",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${sarabun.variable} ${caveat.variable}`} style={{ fontFamily: 'var(--font-sarabun)' }}>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
