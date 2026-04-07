import { NextResponse } from "next/server";
import { bearerTokenMatches } from "@/lib/auth-token";
import {
  AnnouncementStatus,
  DraftStatus,
  EventStatus,
} from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import { ingestBodySchema } from "@/lib/ingest-schema";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
}

export async function POST(req: Request) {
  const secret = process.env.INGEST_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Servizio non configurato" },
      { status: 500 },
    );
  }
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!bearerTokenMatches(secret, token)) {
    return unauthorized();
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = ingestBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload non valido", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const prisma = getPrisma();

    if (data.type === "draft") {
      if (data.idempotencyKey) {
        const existing = await prisma.contentDraft.findUnique({
          where: { idempotencyKey: data.idempotencyKey },
        });
        if (existing) {
          return NextResponse.json({
            ok: true,
            duplicate: true,
            id: existing.id,
            type: "draft",
          });
        }
      }
      const row = await prisma.contentDraft.create({
        data: {
          title: data.title,
          body: data.body,
          idempotencyKey: data.idempotencyKey,
          autoPublish: data.autoPublish ?? false,
          status: DraftStatus.PENDING,
        },
      });
      return NextResponse.json({ ok: true, id: row.id, type: "draft" });
    }

    if (data.type === "announcement") {
      if (data.sourceMessageId) {
        const existing = await prisma.announcement.findUnique({
          where: { sourceMessageId: data.sourceMessageId },
        });
        if (existing) {
          return NextResponse.json({
            ok: true,
            duplicate: true,
            id: existing.id,
            type: "announcement",
          });
        }
      }
      const publish = data.publish ?? true;
      const imgs = data.images ?? [];
      const row = await prisma.announcement.create({
        data: {
          title: data.title,
          body: data.body,
          images: imgs,
          status: publish
            ? AnnouncementStatus.PUBLISHED
            : AnnouncementStatus.DRAFT,
          publishedAt: publish ? new Date() : null,
          sourceMessageId: data.sourceMessageId,
        },
      });
      return NextResponse.json({ ok: true, id: row.id, type: "announcement" });
    }

    if (data.type === "event") {
      if (data.sourceMessageId) {
        const existing = await prisma.event.findUnique({
          where: { sourceMessageId: data.sourceMessageId },
        });
        if (existing) {
          return NextResponse.json({
            ok: true,
            duplicate: true,
            id: existing.id,
            type: "event",
          });
        }
      }
      const publish = data.publish ?? false;
      const row = await prisma.event.create({
        data: {
          title: data.title,
          startsAt: new Date(data.startsAt),
          endsAt: data.endsAt ? new Date(data.endsAt) : null,
          location: data.location,
          description: data.description,
          sourceMessageId: data.sourceMessageId,
          status: publish ? EventStatus.PUBLISHED : EventStatus.DRAFT,
          publishedAt: publish ? new Date() : null,
        },
      });
      return NextResponse.json({ ok: true, id: row.id, type: "event" });
    }

    const row = await prisma.species.create({
      data: {
        name: data.name,
        scientificName: data.scientificName,
        synonyms: data.synonyms,
        habitat: data.habitat,
        edibility: data.edibility,
        notes: data.notes,
        source: data.source,
      },
    });
    return NextResponse.json({ ok: true, id: row.id, type: "species" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Errore nel salvataggio" },
      { status: 500 },
    );
  }
}
