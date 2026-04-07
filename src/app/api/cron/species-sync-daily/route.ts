import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { bearerTokenMatches } from "@/lib/auth-token";
import { refreshStaleAutoImportedSpecies } from "@/lib/species-import";

export const runtime = "nodejs";

/**
 * Cron giornaliero: riallinea testi Wikipedia (e GBIF se mancava) per schede auto-importate.
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

  const r = await refreshStaleAutoImportedSpecies(18);
  if (r.updatedIds.length > 0) {
    revalidatePath("/");
    revalidatePath("/funghi");
  }

  return NextResponse.json({
    ok: true,
    updated: r.updatedIds.length,
    updatedIds: r.updatedIds,
    errors: r.errors,
    at: new Date().toISOString(),
  });
}
