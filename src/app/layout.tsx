import type { Metadata } from "next";
import { Inter, Titillium_Web } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  DEFAULT_DESCRIPTION,
  SEO_KEYWORDS,
  SITE_NAME,
  SITE_NAME_SHORT,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo-config";
import { getSiteLogoUrl, SITE_LOGO_PUBLIC_PATH } from "@/lib/site-logo";
import { getMetadataBase } from "@/lib/site-url";
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

const metadataBase = getMetadataBase();
const defaultOgImage = new URL(SITE_LOGO_PUBLIC_PATH, `${metadataBase.origin}/`).href;

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: `${SITE_NAME} | San Donà di Piave`,
    template: `%s | ${SITE_NAME_SHORT}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [...SEO_KEYWORDS],
  authors: [{ name: SITE_NAME, url: metadataBase.href }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | San Donà di Piave`,
    description: DEFAULT_DESCRIPTION,
    url: metadataBase.href,
    images: [
      {
        url: defaultOgImage,
        width: 512,
        height: 512,
        alt: `${SITE_NAME} — logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | San Donà di Piave`,
    description: DEFAULT_DESCRIPTION,
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
  const siteOrigin = getMetadataBase().origin;
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(siteOrigin), websiteJsonLd(siteOrigin)],
  };

  return (
    <html
      lang="it"
      className={`${inter.variable} ${titillium.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--surface-paper)] font-sans text-stone-900">
        <JsonLd data={schemaGraph} />
        <SiteHeader logoUrl={logoUrl} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
