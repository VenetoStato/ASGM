import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { bearerTokenMatches } from "@/lib/auth-token";
import { importSpeciesFromWikipediaItTitle } from "@/lib/species-import";

export const runtime = "nodejs";

type QueueFile = { candidates?: string[] };

const MAX_ATTEMPTS = 5;

/**
 * Cron settimanale: importa al massimo 1 nuova scheda dalla coda Wikipedia (italiano).
 * Header: Authorization: Bearer CRON_SECRET
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Non configurato" }, { status: 500 });
  }
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!bearerTokenMatches(secret, token)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  let candidates: string[] = [];
  try {
    const raw = readFileSync(
      join(process.cwd(), "data", "species-queue.json"),
      "utf8",
    );
    const parsed = JSON.parse(raw) as QueueFile;
    candidates = Array.isArray(parsed.candidates) ? parsed.candidates : [];
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Coda specie non leggibile" },
      { status: 500 },
    );
  }

  const tried: string[] = [];
  let imported: string | null = null;
  let lastReason: string | null = null;
  let attempts = 0;

  for (const title of candidates) {
    if (attempts >= MAX_ATTEMPTS) break;
    attempts += 1;
    tried.push(title);
    const r = await importSpeciesFromWikipediaItTitle(title);
    if (r.ok) {
      imported = r.speciesId;
      break;
    }
    lastReason = r.reason;
  }

  if (imported) {
    revalidatePath("/");
    revalidatePath("/funghi");
  }

  return NextResponse.json({
    ok: true,
    importedId: imported,
    attempts,
    triedTitles: tried,
    lastReason,
    at: new Date().toISOString(),
  });
}
