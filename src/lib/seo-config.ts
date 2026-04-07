import type { Metadata } from "next";
import { FACEBOOK_PAGE_URL } from "@/lib/public-site";
import { absoluteUrl, getMetadataBase } from "@/lib/site-url";

export const SITE_NAME = "Gruppo Micologico Culturale Sandonatese";
export const SITE_NAME_SHORT = "GMC Sandonatese";
export const DEFAULT_DESCRIPTION =
  "Gruppo micologico a San Donà di Piave (Veneto): annunci, calendario attività, pubblicazioni e schede funghi divulgative. Seguici anche su Facebook.";

export const SEO_KEYWORDS = [
  "gruppo micologico",
  "micologia",
  "funghi",
  "San Donà di Piave",
  "Sandonatese",
  "Veneto",
  "Bassa padovana",
  "schede funghi",
  "eventi micologici",
] as const;

/** Metadata per sottopagine (usa il template del layout). */
export function pageMetadata(opts: {
  title: string;
  description?: string;
  path: string;
  /** URL assoluto o path relativo per og:image */
  ogImage?: string | null;
  noindex?: boolean;
}): Metadata {
  const description = opts.description ?? DEFAULT_DESCRIPTION;
  const base = getMetadataBase();
  const canonicalPath = opts.path.startsWith("/") ? opts.path : `/${opts.path}`;
  const canonical = new URL(canonicalPath, `${base.origin}/`).toString();

  const ogImageUrl =
    opts.ogImage == null || opts.ogImage === ""
      ? undefined
      : opts.ogImage.startsWith("http")
        ? opts.ogImage
        : absoluteUrl(
            opts.ogImage.startsWith("/") ? opts.ogImage : `/${opts.ogImage}`,
          );

  const md: Metadata = {
    title: opts.title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "it_IT",
      siteName: SITE_NAME,
      title: opts.title,
      description,
      url: canonical,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, alt: opts.title }] } : {}),
    },
    twitter: {
      card: ogImageUrl ? "summary_large_image" : "summary",
      title: opts.title,
      description,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  };

  if (opts.noindex) {
    md.robots = { index: false, follow: false };
  }

  return md;
}

export function organizationJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: SITE_NAME_SHORT,
    url: baseUrl,
    sameAs: [FACEBOOK_PAGE_URL],
    areaServed: {
      "@type": "City",
      name: "San Donà di Piave",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Veneto",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Donà di Piave",
      addressRegion: "VE",
      addressCountry: "IT",
    },
  };
}

export function websiteJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: SITE_NAME_SHORT,
    url: baseUrl,
    inLanguage: "it-IT",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: baseUrl,
    },
  };
}

/** Meta description per scheda fungo (max ~160 caratteri). */
export function speciesMetaDescription(s: {
  scientificName?: string | null;
  edibility?: string | null;
  habitat?: string | null;
  notes?: string | null;
}): string {
  const parts = [
    s.scientificName,
    s.edibility,
    s.habitat,
    s.notes?.replace(/\s+/g, " ").trim().slice(0, 100),
  ];
  const t = parts.filter(Boolean).join(". ").replace(/\s+/g, " ").trim();
  if (!t) return `${SITE_NAME_SHORT}: scheda divulgativa sui funghi.`;
  if (t.length <= 160) return t;
  return `${t.slice(0, 157).trim()}…`;
}

export function speciesWebPageJsonLd(opts: {
  url: string;
  name: string;
  description: string;
  image?: string | null;
}) {
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.name,
    description: opts.description,
    url: opts.url,
  };
  if (opts.image) {
    base.primaryImageOfPage = {
      "@type": "ImageObject",
      url: opts.image,
    };
  }
  return base;
}
