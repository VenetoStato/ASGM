/** Logo ufficiale GMC (file in /public). */
export const SITE_LOGO_PUBLIC_PATH = "/logo-gmc-sandonatese.png";

/**
 * Logo in header: `SITE_LOGO_URL` se impostato, altrimenti il PNG ufficiale nel sito.
 */
export async function getSiteLogoUrl(): Promise<string> {
  const envUrl = process.env.SITE_LOGO_URL?.trim();
  if (envUrl) return envUrl;
  return SITE_LOGO_PUBLIC_PATH;
}
