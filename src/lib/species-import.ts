import { getPrisma } from "@/lib/prisma";

const UA =
  "ASGM/1.0 (Gruppo micologico Sandonatese; +https://github.com/VenetoStato/ASGM)";

type WikiSummary = {
  type?: string;
  title: string;
  extract?: string;
  content_urls?: { desktop?: { page?: string } };
  thumbnail?: { source?: string };
  wikibase_item?: string;
};

const DISCLAIMER =
  "\n\n—\nScheda compilata automaticamente da contenuti liberi (Wikipedia). Non sostituisce guide sul campo, corsi o pareri professionali. Verificare sempre commestibilità e normative locali.";

export type ImportResult =
  | { ok: true; speciesId: string }
  | { ok: false; reason: string };

/**
 * Importa una specie dalla voce italiana Wikipedia (titolo voce, es. "Boletus edulis").
 */
export async function importSpeciesFromWikipediaItTitle(
  title: string,
): Promise<ImportResult> {
  const trimmed = title.trim();
  if (!trimmed) return { ok: false, reason: "empty_title" };

  const slug = trimmed.replace(/ /g, "_");
  const url = `https://it.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) return { ok: false, reason: `wiki_http_${res.status}` };
  const data = (await res.json()) as WikiSummary;
  if (data.type === "disambiguation") {
    return { ok: false, reason: "disambiguation" };
  }
  const extract = data.extract?.trim();
  if (!extract) return { ok: false, reason: "no_extract" };

  const wikiTitle = data.title.replace(/_/g, " ");
  const pageUrl = data.content_urls?.desktop?.page;
  if (!pageUrl) return { ok: false, reason: "no_page_url" };

  const wikidataId = data.wikibase_item?.trim() || null;
  const thumb = data.thumbnail?.source;

  const prisma = getPrisma();

  const existing = await prisma.species.findFirst({
    where: {
      OR: [
        ...(wikidataId ? [{ wikidataId }] : []),
        { wikipediaTitle: data.title },
        { name: wikiTitle },
      ],
    },
  });
  if (existing) return { ok: false, reason: "duplicate" };

  const row = await prisma.species.create({
    data: {
      name: wikiTitle,
      scientificName: wikiTitle,
      notes: extract + DISCLAIMER,
      sourceName: "Wikipedia (italiano)",
      sourceUrl: pageUrl,
      wikipediaTitle: data.title,
      wikidataId,
      imageUrl: thumb ?? null,
      imageAttribution: thumb
        ? "Immagine: anteprima Wikipedia / Wikimedia (vedi voce per licenza)"
        : null,
      autoImported: true,
      lastSyncedAt: new Date(),
    },
  });

  return { ok: true, speciesId: row.id };
}
