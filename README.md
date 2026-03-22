# ASGM — sito micologia (Next.js + Vercel + OpenClaw)

Sito per il gruppo micologico: **eventi**, **schede funghi**, API per **ingest** da OpenClaw (WhatsApp).

**Struttura hub:** `projects/` (più progetti sotto un workspace), `openclaw/` (doc gateway), `openclaw/accounts/` (WhatsApp multi-account + policy), `docs/HUB.md`, `docs/REPOSITORY.md`, `SITE.md`.

**Sicurezza (repo pubblica):** mai commitare `.env`, token, password o cartella `.openclaw/` — sono in `.gitignore`. Solo `.env.example` con placeholder.

## Repository GitHub

Nel repo locale è già configurato:

```bash
git remote -v
# origin  https://github.com/VenetoStato/ASGM.git
```

Per pubblicare (da account con permesso su `VenetoStato/ASGM`):

```bash
git push -u origin main
```

Se vedi **403**, accedi a GitHub con l’utente corretto (`gh auth login`) o usa SSH / un Personal Access Token con scope `repo`.

## Requisiti

- Node.js 20+
- Account [Vercel](https://vercel.com) (piano Hobby gratuito)
- Database Postgres gratuito: [Supabase](https://supabase.com) o [Neon](https://neon.tech)

## Setup locale

```bash
npm install
cp .env.example .env
# Modifica .env con DATABASE_URL reale
npx prisma migrate deploy
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Variabili d’ambiente (Vercel)

Nel progetto Vercel → **Settings → Environment Variables**, aggiungi:

| Nome | Cosa mettere |
|------|----------------|
| `DATABASE_URL` | **Postgres in cloud** (Neon, Supabase, …). **Non** usare `prisma+postgres://localhost:...`: su Vercel non esiste il tuo PC. Crea DB gratuito, copia `postgresql://...?sslmode=require`, poi `npx prisma migrate deploy` su quel DB. |
| `INGEST_SECRET` | Stringa lunga casuale; **identica** al `.env` locale e usata da OpenClaw per `Bearer` su `/api/ingest`. |
| `CRON_SECRET` | Altra stringa casuale; **identica** al `.env` per il cron su `/api/cron/process-pending`. |
| `ADMIN_PASSWORD` | Password per l’area `/organizzatori` (annunci e date dal browser). |

Dopo il primo deploy, esegui le migrazioni sul DB cloud (da PC con `DATABASE_URL` puntato al DB):

```bash
npx prisma migrate deploy
```

Oppure usa SQL Editor nel dashboard Supabase/Neon incollando il contenuto di `prisma/migrations/*/migration.sql`.

## Deploy Vercel

1. Collega il repo `VenetoStato/ASGM` (branch `main`).
2. **Framework Preset**: Next.js (rileva automaticamente).
3. **Build Command**: `npm run build` (default).
4. Imposta le env sopra, poi **Redeploy**.

**Cron**: `vercel.json` pianifica ogni giorno alle 06:00 UTC il path `/api/cron/process-pending`. Su Vercel, imposta `CRON_SECRET`; le invocazioni cron includono l’header `Authorization` coerente con la [documentazione Vercel Cron](https://vercel.com/docs/cron-jobs).

## API

### `POST /api/ingest`

Header: `Authorization: Bearer <INGEST_SECRET>`  
Body JSON (uno dei tipi):

**Evento**

```json
{
  "type": "event",
  "title": "Uscita nel bosco",
  "startsAt": "2026-04-01T09:00:00.000Z",
  "location": "Monte X",
  "description": "Dettagli...",
  "publish": true,
  "sourceMessageId": "wa-msg-id-opzionale"
}
```

**Bozza / news**

```json
{
  "type": "draft",
  "title": "Avviso",
  "body": "Testo...",
  "idempotencyKey": "chiave-unica-opzionale",
  "autoPublish": true
}
```

**Annuncio** (home `/` sezione annunci; anche da `/organizzatori`)

```json
{
  "type": "announcement",
  "title": "Avviso gruppo",
  "body": "Testo completo...",
  "images": ["https://esempio.it/foto.jpg"],
  "publish": true,
  "sourceMessageId": "wa-msg-id-opzionale"
}
```

**Specie**

```json
{
  "type": "species",
  "name": "Porcino",
  "scientificName": "Boletus edulis",
  "edibility": "Commestibile",
  "notes": "..."
}
```

### `GET /api/health`

Stato servizio (senza auth).

## OpenClaw (macchina sempre accesa)

1. Installa e avvia il gateway: `openclaw gateway`.
2. Collega WhatsApp: `openclaw channels login --channel whatsapp`.
3. Configura allowlist gruppo / admin in `openclaw.json`.
4. In uno skill o automazione, chiama `POST https://<tuo-progetto>.vercel.app/api/ingest` con il bearer `INGEST_SECRET`.

Il gateway **non** gira su Vercel: resta sul PC/NAS di casa.

## Licenza

Privato / gruppo — adatta come preferisci.
