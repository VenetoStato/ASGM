import { timingSafeEqual } from "node:crypto";

/** Confronto a tempo costante per Bearer token / segreti (riduce leakage per timing). */
export function bearerTokenMatches(
  secret: string,
  token: string | null | undefined,
): boolean {
  if (!token) return false;
  const a = Buffer.from(secret, "utf8");
  const b = Buffer.from(token, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
