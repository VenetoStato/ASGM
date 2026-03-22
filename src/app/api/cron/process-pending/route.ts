import { NextResponse } from "next/server";
import { bearerTokenMatches } from "@/lib/auth-token";
import { DraftStatus } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Cron Vercel: pubblica bozze in attesa con autoPublish=true.
 * Header: Authorization: Bearer CRON_SECRET
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET non configurato" },
      { status: 500 },
    );
  }
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!bearerTokenMatches(secret, token)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const prisma = getPrisma();
    const now = new Date();

    const drafts = await prisma.contentDraft.updateMany({
      where: {
        status: DraftStatus.PENDING,
        autoPublish: true,
      },
      data: {
        status: DraftStatus.PUBLISHED,
        publishedAt: now,
      },
    });

    return NextResponse.json({
      ok: true,
      publishedDrafts: drafts.count,
      at: now.toISOString(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Errore database" }, { status: 500 });
  }
}
