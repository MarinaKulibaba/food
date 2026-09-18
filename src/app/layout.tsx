import type { Metadata } from "next";
import { Darumadrop_One, Inter } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fridge = Darumadrop_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fridge",
});

export const metadata: Metadata = {
  title: "What's in my Fridge?",
  description:
    "Turn leftover ingredients into delicious meals with AI recipe suggestions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${fridge.variable}`}>{children}</body>
    </html>
  );
}
