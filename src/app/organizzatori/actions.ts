"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AnnouncementStatus, EventStatus } from "@/generated/prisma/client";
import {
  clearAdminSession,
  isAdminAuthenticated,
  setAdminSession,
} from "@/lib/auth-admin";
import { getPrisma } from "@/lib/prisma";

function safeInternalPath(raw: string): string {
  const t = raw.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return "/organizzatori";
  return t;
}

export async function loginOrganizzatori(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { ok: false as const, error: "Accesso non ancora configurato" };
  }
  if (password !== expected) {
    return { ok: false as const, error: "Password errata" };
  }
  await setAdminSession();
  revalidatePath("/organizzatori");
  revalidatePath("/admin/login");
  return { ok: true as const };
}

export async function logoutOrganizzatori() {
  await clearAdminSession();
  revalidatePath("/organizzatori");
  revalidatePath("/admin/login");
}

export async function loginFormAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const next = safeInternalPath(String(formData.get("next") ?? ""));
  const r = await loginOrganizzatori(password);
  if (!r.ok) {
    redirect(
      `/admin/login?error=${encodeURIComponent(r.error ?? "login")}&next=${encodeURIComponent(next)}`,
    );
  }
  redirect(next);
}

export async function logoutFormAction() {
  await logoutOrganizzatori();
  redirect("/admin/login");
}

export async function createAnnouncementAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect(
      `/admin/login?error=${encodeURIComponent("Sessione scaduta o non autorizzato")}&next=${encodeURIComponent("/organizzatori")}`,
    );
  }
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const imageLines = String(formData.get("images") ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const publish = formData.get("publish") === "on";

  if (!title || !body) {
    redirect(
      `/organizzatori?err=${encodeURIComponent("Titolo e testo obbligatori")}`,
    );
  }

  try {
    const prisma = getPrisma();
    await prisma.announcement.create({
      data: {
        title,
        body,
        images: imageLines,
        status: publish
          ? AnnouncementStatus.PUBLISHED
          : AnnouncementStatus.DRAFT,
        publishedAt: publish ? new Date() : null,
      },
    });
    revalidatePath("/");
    revalidatePath("/annunci");
    redirect("/organizzatori?msg=annuncio-salvato");
  } catch (e) {
    console.error(e);
    redirect(
      `/organizzatori?err=${encodeURIComponent("Errore salvataggio")}`,
    );
  }
}

async function requireOrganizzatore(nextPath: string) {
  if (!(await isAdminAuthenticated())) {
    redirect(
      `/admin/login?error=${encodeURIComponent("Sessione scaduta o non autorizzato")}&next=${encodeURIComponent(nextPath)}`,
    );
  }
}

function strOrNull(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  return s || null;
}

export async function createSpeciesAction(formData: FormData) {
  await requireOrganizzatore("/organizzatori/schede/nuova");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect(
      `/organizzatori/schede/nuova?err=${encodeURIComponent("Nome comune obbligatorio")}`,
    );
  }

  try {
    const prisma = getPrisma();
    const row = await prisma.species.create({
      data: {
        name,
        scientificName: strOrNull(formData.get("scientificName")),
        synonyms: strOrNull(formData.get("synonyms")),
        habitat: strOrNull(formData.get("habitat")),
        edibility: strOrNull(formData.get("edibility")),
        notes: strOrNull(formData.get("notes")),
        imageUrl: strOrNull(formData.get("imageUrl")),
        imageAttribution: strOrNull(formData.get("imageAttribution")),
        sourceName: strOrNull(formData.get("sourceName")),
        sourceUrl: strOrNull(formData.get("sourceUrl")),
        source: strOrNull(formData.get("source")),
        autoImported: false,
        lastSyncedAt: null,
      },
    });
    revalidatePath("/");
    revalidatePath("/funghi");
    redirect(`/organizzatori/schede/${row.id}?msg=salvata`);
  } catch (e) {
    console.error(e);
    redirect(
      `/organizzatori/schede/nuova?err=${encodeURIComponent("Errore salvataggio scheda")}`,
    );
  }
}

export async function updateSpeciesAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    redirect(`/organizzatori?err=${encodeURIComponent("Scheda non valida")}`);
  }
  await requireOrganizzatore(`/organizzatori/schede/${id}`);

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect(
      `/organizzatori/schede/${id}?err=${encodeURIComponent("Nome obbligatorio")}`,
    );
  }

  try {
    const prisma = getPrisma();
    await prisma.species.update({
      where: { id },
      data: {
        name,
        scientificName: strOrNull(formData.get("scientificName")),
        synonyms: strOrNull(formData.get("synonyms")),
        habitat: strOrNull(formData.get("habitat")),
        edibility: strOrNull(formData.get("edibility")),
        notes: strOrNull(formData.get("notes")),
        imageUrl: strOrNull(formData.get("imageUrl")),
        imageAttribution: strOrNull(formData.get("imageAttribution")),
        sourceName: strOrNull(formData.get("sourceName")),
        sourceUrl: strOrNull(formData.get("sourceUrl")),
        source: strOrNull(formData.get("source")),
        autoImported: false,
        lastSyncedAt: null,
      },
    });
    revalidatePath("/");
    revalidatePath("/funghi");
    revalidatePath(`/funghi/${id}`);
    redirect(`/organizzatori/schede/${id}?msg=salvata`);
  } catch (e) {
    console.error(e);
    redirect(
      `/organizzatori/schede/${id}?err=${encodeURIComponent("Errore aggiornamento")}`,
    );
  }
}

export async function deleteSpeciesAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    redirect(`/organizzatori?err=${encodeURIComponent("Scheda non valida")}`);
  }
  await requireOrganizzatore(`/organizzatori/schede/${id}`);

  try {
    const prisma = getPrisma();
    await prisma.species.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/funghi");
    redirect("/organizzatori?msg=scheda-eliminata");
  } catch (e) {
    console.error(e);
    redirect(
      `/organizzatori/schede/${id}?err=${encodeURIComponent("Impossibile eliminare")}`,
    );
  }
}

export async function saveSiteCopyAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect(
      `/admin/login?error=${encodeURIComponent("Sessione scaduta o non autorizzato")}&next=${encodeURIComponent("/organizzatori")}`,
    );
  }

  const heroTitle = String(formData.get("heroTitle") ?? "").trim();
  const heroSubtitle = String(formData.get("heroSubtitle") ?? "").trim();
  const heroLead = String(formData.get("heroLead") ?? "").trim();
  const chiSiamo = String(formData.get("chiSiamo") ?? "").trim();
  const pubblicazioni = String(formData.get("pubblicazioni") ?? "").trim();
  const calendarioAttivita = String(
    formData.get("calendarioAttivita") ?? "",
  ).trim();
  const sostegno = String(formData.get("sostegno") ?? "").trim();

  try {
    const prisma = getPrisma();
    await prisma.siteSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        heroTitle: heroTitle || null,
        heroSubtitle: heroSubtitle || null,
        heroLead: heroLead || null,
        chiSiamo: chiSiamo || null,
        pubblicazioni: pubblicazioni || null,
        calendarioAttivita: calendarioAttivita || null,
        sostegno: sostegno || null,
      },
      update: {
        heroTitle: heroTitle || null,
        heroSubtitle: heroSubtitle || null,
        heroLead: heroLead || null,
        chiSiamo: chiSiamo || null,
        pubblicazioni: pubblicazioni || null,
        calendarioAttivita: calendarioAttivita || null,
        sostegno: sostegno || null,
      },
    });
    revalidatePath("/");
    redirect("/organizzatori?msg=testi-salvati");
  } catch (e) {
    console.error(e);
    redirect(
      `/organizzatori?err=${encodeURIComponent("Errore salvataggio testi")}`,
    );
  }
}

export async function createEventAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect(
      `/admin/login?error=${encodeURIComponent("Sessione scaduta o non autorizzato")}&next=${encodeURIComponent("/organizzatori")}`,
    );
  }
  const title = String(formData.get("title") ?? "").trim();
  const startsAtRaw = String(formData.get("startsAt") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim() || null;
  const description =
    String(formData.get("description") ?? "").trim() || null;
  const publish = formData.get("publish") === "on";

  if (!title || !startsAtRaw) {
    redirect(
      `/organizzatori?err=${encodeURIComponent("Titolo e data/ora obbligatori")}`,
    );
  }

  const startsAt = new Date(startsAtRaw);
  if (Number.isNaN(startsAt.getTime())) {
    redirect(
      `/organizzatori?err=${encodeURIComponent("Data non valida")}`,
    );
  }

  try {
    const prisma = getPrisma();
    await prisma.event.create({
      data: {
        title,
        startsAt,
        location,
        description,
        status: publish ? EventStatus.PUBLISHED : EventStatus.DRAFT,
        publishedAt: publish ? new Date() : null,
      },
    });
    revalidatePath("/");
    revalidatePath("/eventi");
    redirect("/organizzatori?msg=attivita-salvata");
  } catch (e) {
    console.error(e);
    redirect(
      `/organizzatori?err=${encodeURIComponent("Errore salvataggio")}`,
    );
  }
}
