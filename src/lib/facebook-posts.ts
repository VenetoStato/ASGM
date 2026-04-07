export type FacebookPost = {
  id: string;
  message: string | null;
  created_time: string;
  permalink_url: string;
  full_picture?: string | null;
};

export type FacebookPageMeta = {
  name: string | null;
  pictureUrl: string | null;
};

export async function fetchFacebookPageMeta(): Promise<FacebookPageMeta | null> {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  const pageSlug =
    process.env.FACEBOOK_PAGE_SLUG?.trim() || "micologia.sandonatese";
  if (!token) return null;
  try {
    const fields = "name,picture.type(large)";
    const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(pageSlug)}?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const j: {
      name?: string;
      picture?: { data?: { url?: string } };
    } = await res.json();
    return {
      name: j.name ?? null,
      pictureUrl: j.picture?.data?.url ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Ultimi post della pagina via Meta Graph API (opzionale).
 * Richiede `FACEBOOK_PAGE_ACCESS_TOKEN` (token di pagina) e permessi adeguati su Meta for Developers.
 * Se manca il token, il sito usa solo il plugin Facebook in pagina (sempre aggiornato).
 */
export async function fetchFacebookGraphPosts(): Promise<FacebookPost[] | null> {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  const pageSlug =
    process.env.FACEBOOK_PAGE_SLUG?.trim() || "micologia.sandonatese";
  if (!token) return null;

  try {
    const url = new URL(
      `https://graph.facebook.com/v21.0/${encodeURIComponent(pageSlug)}/posts`,
    );
    url.searchParams.set(
      "fields",
      "message,created_time,permalink_url,full_picture",
    );
    url.searchParams.set("limit", "6");
    url.searchParams.set("access_token", token);

    const res = await fetch(url.toString(), {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    const data: { data?: FacebookPost[] } = await res.json();
    if (!data.data?.length) return null;
    return data.data;
  } catch {
    return null;
  }
}
