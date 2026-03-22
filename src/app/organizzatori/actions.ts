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
    return { ok: false as const, error: "ADMIN_PASSWORD non configurato" };
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
