/** Dominio ufficiale (fallback SEO se mancano le variabili d’ambiente). */
export const OFFICIAL_SITE_ORIGIN = "https://gmcsandonatese.com";

/**
 * URL canonico del sito (SEO, Open Graph, sitemap).
 * Priorità: `NEXT_PUBLIC_SITE_URL`, poi `VERCEL_URL` (preview/deploy),
 * in sviluppo `localhost`, in produzione senza Vercel il dominio ufficiale.
 */
export function getMetadataBase(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const normalized = explicit.startsWith("http")
      ? explicit
      : `https://${explicit}`;
    const trimmed = normalized.replace(/\/$/, "");
    return new URL(trimmed);
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return new URL(`https://${vercel.replace(/\/$/, "")}`);
  }
  if (process.env.NODE_ENV === "development") {
    return new URL("http://localhost:3000");
  }
  return new URL(OFFICIAL_SITE_ORIGIN);
}

export function absoluteUrl(path: string): string {
  const base = getMetadataBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  return new URL(p, `${base.origin}/`).toString();
}
