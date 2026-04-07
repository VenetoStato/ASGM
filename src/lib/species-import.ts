import { getPrisma } from "@/lib/prisma";

/** User-Agent esplicito (best practice API Wikimedia / GBIF). */
const UA =
  "ASGM/1.0 (Gruppo micologico culturale Sandonatese; +https://github.com/VenetoStato/ASGM)";

type WikiSummary = {
  type?: string;
  title: string;
  extract?: string;
  content_urls?: { desktop?: { page?: string } };
  thumbnail?: { source?: string };
  wikibase_item?: string;
};

type GbifMatch = {
  matchType?: string;
  confidence?: string;
  usageKey?: number;
  scientificName?: string;
};

const DISCLAIMER =
  "\n\n—\nFonti automatiche: testo da Wikipedia in italiano (aggiornato periodicamente) e, quando disponibile, verifica del nome scientifico sul GBIF Backbone (Global Biodiversity Information Facility). Non sostituisce guide sul campo, corsi o pareri professionali. Verificare sempre commestibilità e normative locali.";

function wikiSlugFromTitle(title: string) {
  return title.trim().replace(/ /g, "_");
}

async function fetchWikipediaItSummary(
  titleForSlug: string,
): Promise<
  | { ok: true; data: WikiSummary; pageUrl: string; extract: string }
  | { ok: false; reason: string }
> {
  const slug = wikiSlugFromTitle(titleForSlug);
  const url = `https://it.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) return { ok: false, reason: `wiki_http_${res.status}` };
  const data = (await res.json()) as WikiSummary;
  if (data.type === "disambiguation") {
    return { ok: false, reason: "disambiguation" };
  }
  const extract = data.extract?.trim();
  if (!extract) return { ok: false, reason: "no_extract" };
  const pageUrl = data.content_urls?.desktop?.page;
  if (!pageUrl) return { ok: false, reason: "no_page_url" };
  return { ok: true, data, pageUrl, extract };
}

/**
 * GBIF Species Match — backbone tassonomico di riferimento mondiale (API pubblica).
 * Accettiamo solo corrispondenze sufficientemente solide.
 */
export async function matchGbifTaxonKey(
  scientificName: string,
): Promise<{ key: string; canonical?: string } | null> {
  const name = scientificName.trim();
  if (!name || name.length < 3) return null;
  try {
    const u = new URL("https://api.gbif.org/v1/species/match");
    u.searchParams.set("name", name);
    u.searchParams.set("verbose", "false");
    const res = await fetch(u.toString(), {
      headers: { Accept: "application/json", "User-Agent": UA },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const j = (await res.json()) as GbifMatch;
    if (j.matchType === "NONE" || j.usageKey == null) return null;
    return {
      key: String(j.usageKey),
      canonical: j.scientificName,
    };
  } catch {
    return null;
  }
}

function buildSpeciesNotes(
  extract: string,
  gbifKey: string | null,
  gbifCanonical?: string | null,
) {
  let block = extract;
  if (gbifKey) {
    const line = gbifCanonical
      ? `\n\nNome accettato (GBIF Backbone): ${gbifCanonical}\nScheda GBIF: https://www.gbif.org/species/${gbifKey}`
      : `\n\nScheda tassonomica GBIF: https://www.gbif.org/species/${gbifKey}`;
    block += line;
  }
  return block + DISCLAIMER;
}

export type ImportResult =
  | { ok: true; speciesId: string }
  | { ok: false; reason: string };

/**
 * Nuova scheda: Wikipedia IT + match GBIF sul nome (solitamente binomiale come titolo voce).
 */
export async function importSpeciesFromWikipediaItTitle(
  title: string,
): Promise<ImportResult> {
  const trimmed = title.trim();
  if (!trimmed) return { ok: false, reason: "empty_title" };

  const wiki = await fetchWikipediaItSummary(trimmed);
  if (!wiki.ok) return { ok: false, reason: wiki.reason };

  const { data, pageUrl, extract } = wiki;
  const wikiTitle = data.title.replace(/_/g, " ");
  const wikidataId = data.wikibase_item?.trim() || null;
  const thumb = data.thumbnail?.source;

  const gbif = await matchGbifTaxonKey(wikiTitle);
  const gbifKey = gbif?.key ?? null;

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
      scientificName: gbif?.canonical ?? wikiTitle,
      notes: buildSpeciesNotes(extract, gbifKey, gbif?.canonical),
      sourceName: "Wikipedia (IT) + GBIF (verifica tassonomica)",
      sourceUrl: pageUrl,
      wikipediaTitle: data.title,
      wikidataId,
      gbifTaxonKey: gbifKey,
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

export type RefreshBatchResult = {
  updatedIds: string[];
  skipped: number;
  errors: string[];
};

/**
 * Rilegge Wikipedia per le schede auto-importate più “vecchie” (ultimo sync).
 * Gira in batch dal cron giornaliero per tenere i testi allineati alla voce.
 */
export async function refreshStaleAutoImportedSpecies(
  max = 18,
): Promise<RefreshBatchResult> {
  const prisma = getPrisma();
  const cutoff = new Date(Date.now() - 20 * 60 * 60 * 1000); // 20 ore

  const rows = await prisma.species.findMany({
    where: {
      autoImported: true,
      wikipediaTitle: { not: null },
      OR: [{ lastSyncedAt: { lt: cutoff } }, { lastSyncedAt: null }],
    },
    orderBy: [{ lastSyncedAt: "asc" }],
    take: max,
  });

  const updatedIds: string[] = [];
  const errors: string[] = [];

  for (const row of rows) {
    if (!row.wikipediaTitle) {
      continue;
    }
    try {
      const wiki = await fetchWikipediaItSummary(
        row.wikipediaTitle.replace(/_/g, " "),
      );
      if (!wiki.ok) {
        errors.push(`${row.id}:${wiki.reason}`);
        continue;
      }
      const { data, pageUrl, extract } = wiki;
      const thumb = data.thumbnail?.source;

      let gbifKey = row.gbifTaxonKey;
      let canonical: string | null = row.scientificName;
      if (!gbifKey) {
        const wikiTitle = data.title.replace(/_/g, " ");
        const gbif = await matchGbifTaxonKey(wikiTitle);
        if (gbif) {
          gbifKey = gbif.key;
          canonical = gbif.canonical ?? canonical;
        }
      }

      await prisma.species.update({
        where: { id: row.id },
        data: {
          notes: buildSpeciesNotes(extract, gbifKey, canonical),
          sourceUrl: pageUrl,
          wikidataId: data.wikibase_item?.trim() || row.wikidataId,
          scientificName: canonical ?? row.scientificName,
          gbifTaxonKey: gbifKey,
          imageUrl: thumb ?? row.imageUrl,
          imageAttribution: thumb
            ? "Immagine: anteprima Wikipedia / Wikimedia (vedi voce per licenza)"
            : row.imageAttribution,
          lastSyncedAt: new Date(),
          sourceName: "Wikipedia (IT) + GBIF (verifica tassonomica)",
        },
      });
      updatedIds.push(row.id);
    } catch (e) {
      errors.push(`${row.id}:exception`);
      console.error(e);
    }
  }

  return {
    updatedIds,
    skipped: rows.length - updatedIds.length,
    errors,
  };
}
