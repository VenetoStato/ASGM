import { createHash } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "asgm_admin";

export function adminCookieValue(): string | null {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) return null;
  return createHash("sha256").update(`asgm-admin:${p}`).digest("hex");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const v = adminCookieValue();
  if (!v) return false;
  const c = (await cookies()).get(COOKIE)?.value;
  return c === v;
}

export async function setAdminSession(): Promise<void> {
  const v = adminCookieValue();
  if (!v) return;
  (await cookies()).set(COOKIE, v, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
