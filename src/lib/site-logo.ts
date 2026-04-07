/**
 * Logo sito: priorità SITE_LOGO_URL, altrimenti foto profilo Pagina Facebook (Graph, redirect=0).
 */
export async function getSiteLogoUrl(): Promise<string | null> {
  const envUrl = process.env.SITE_LOGO_URL?.trim();
  if (envUrl) return envUrl;
  return fetchFacebookPagePictureUrl();
}

async function fetchFacebookPagePictureUrl(): Promise<string | null> {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  const slug =
    process.env.FACEBOOK_PAGE_SLUG?.trim() || "micologia.sandonatese";
  if (!token) return null;
  try {
    const u = new URL(
      `https://graph.facebook.com/v21.0/${encodeURIComponent(slug)}/picture`,
    );
    u.searchParams.set("redirect", "0");
    u.searchParams.set("type", "large");
    u.searchParams.set("access_token", token);
    const res = await fetch(u.toString(), { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const j: { data?: { url?: string } } = await res.json();
    const pic = j.data?.url;
    return typeof pic === "string" ? pic : null;
  } catch {
    return null;
  }
}
