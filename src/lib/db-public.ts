import {
  AnnouncementStatus,
  DraftStatus,
  EventStatus,
} from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import { mergeSiteCopy, type SiteCopyResolved } from "@/lib/site-copy";

/** Testi homepage (hero + blocchi informativi), con fallback ai default. */
export async function getSiteCopy(): Promise<SiteCopyResolved> {
  try {
    const prisma = getPrisma();
    const row = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    return mergeSiteCopy(row);
  } catch {
    return mergeSiteCopy(null);
  }
}

export async function listPublishedEvents() {
  try {
    const prisma = getPrisma();
    return await prisma.event.findMany({
      where: { status: EventStatus.PUBLISHED },
      orderBy: { startsAt: "asc" },
    });
  } catch {
    return null;
  }
}

/** Prossime attività (max 6) */
export async function listUpcomingEvents(limit = 6) {
  try {
    const prisma = getPrisma();
    const now = new Date();
    return await prisma.event.findMany({
      where: {
        status: EventStatus.PUBLISHED,
        startsAt: { gte: now },
      },
      orderBy: { startsAt: "asc" },
      take: limit,
    });
  } catch {
    return null;
  }
}

export async function listPublishedAnnouncements(limit = 12) {
  try {
    const prisma = getPrisma();
    return await prisma.announcement.findMany({
      where: { status: AnnouncementStatus.PUBLISHED },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
  } catch {
    return null;
  }
}

export async function listPublishedNews() {
  try {
    const prisma = getPrisma();
    return await prisma.contentDraft.findMany({
      where: { status: DraftStatus.PUBLISHED },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    return null;
  }
}

export async function listSpecies() {
  try {
    const prisma = getPrisma();
    return await prisma.species.findMany({
      orderBy: { name: "asc" },
    });
  } catch {
    return null;
  }
}

export async function getSpeciesById(id: string) {
  try {
    const prisma = getPrisma();
    const species = await prisma.species.findUnique({ where: { id } });
    return { ok: true as const, species };
  } catch {
    return { ok: false as const };
  }
}
