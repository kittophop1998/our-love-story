import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";

const sarabun = Sarabun({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin", "thai"],
  variable: "--font-sarabun",
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
      <body className={sarabun.className}>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
