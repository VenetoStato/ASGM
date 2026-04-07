import type { Metadata } from "next";
import { Inter, Titillium_Web } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteLogoUrl } from "@/lib/site-logo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const titillium = Titillium_Web({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-titillium",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Gruppo Micologico Culturale Sandonatese | San Donà di Piave",
  description:
    "Gruppo micologico a San Donà di Piave: annunci, calendario, pubblicazioni e schede funghi.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#022c22",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logoUrl = await getSiteLogoUrl();
  return (
    <html
      lang="it"
      className={`${inter.variable} ${titillium.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--surface-paper)] font-sans text-stone-900">
        <SiteHeader logoUrl={logoUrl} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
