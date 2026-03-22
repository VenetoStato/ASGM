#!/usr/bin/env node
/**
 * Test manuale dell'API ingest (stessi valori di INGEST_SECRET su Vercel).
 * Uso:
 *   ASGM_BASE_URL=https://xxx.vercel.app node scripts/post-asgm-ingest.mjs
 * Carica .env se installi dotenv, oppure esporta le variabili in shell.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const envPath = join(__dirname, "..", ".env");
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) {
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
        v = v.slice(1, -1);
      process.env[m[1]] = v;
    }
  }
} catch {
  // nessun .env
}

const base = process.env.ASGM_BASE_URL?.replace(/\/$/, "");
const secret = process.env.INGEST_SECRET;
if (!base || !secret) {
  console.error("Imposta ASGM_BASE_URL e INGEST_SECRET (es. nel file .env).");
  process.exit(1);
}

const body = {
  type: "event",
  title: "Prova ingest da script",
  startsAt: new Date().toISOString(),
  location: "Test",
  description: "Se vedi questo su /eventi, ingest e DB funzionano.",
  publish: true,
};

const res = await fetch(`${base}/api/ingest`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${secret}`,
  },
  body: JSON.stringify(body),
});

const text = await res.text();
console.log(res.status, text);
