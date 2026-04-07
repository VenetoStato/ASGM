/**
 * URL canonico del sito (SEO, Open Graph, sitemap).
 * In produzione impostare `NEXT_PUBLIC_SITE_URL` (es. https://www.tuodominio.it).
 * Su Vercel, se assente, si usa `VERCEL_URL`.
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
  return new URL("http://localhost:3000");
}

export function absoluteUrl(path: string): string {
  const base = getMetadataBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  return new URL(p, `${base.origin}/`).toString();
}
