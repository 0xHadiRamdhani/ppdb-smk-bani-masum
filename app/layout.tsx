import type { Metadata } from "next";
import { Bangers, Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "PPDB SMK Bani Masum",
  description: "Penerimaan Peserta Didik Baru SMK Bani Masum",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${workSans.variable} ${bangers.variable}`}>
      <body>{children}</body>
    </html>
  );
}
