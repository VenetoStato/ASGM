# Deploy su Vercel — checklist

## Impostazioni progetto

- **Framework Preset:** Next.js (rileva automaticamente).
- **Root directory:** radice del repo (dove c’è `package.json`).
- **Node.js:** 20.x (consigliato; allinea a `engines` se presente).

## Variabili d’ambiente (Settings → Environment Variables)

Impostale per **Production** (e **Preview** se vuoi DB di test).

| Nome | Obbligatorio | Note |
|------|--------------|------|
| `DATABASE_URL` | **Sì** | Postgres (Neon, Supabase, …) con `?sslmode=require`. Usato a build e runtime. |
| `CRON_SECRET` | **Sì** per i cron | Stringa lunga casuale. Vercel invia `Authorization: Bearer <CRON_SECRET>` alle route cron. |
| `ADMIN_PASSWORD` | **Sì** per `/organizzatori` | Password area riservata. |
| `INGEST_SECRET` | **Sì** se usi `POST /api/ingest` | Bearer token per ingest (es. automazioni). |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | No | Token **di pagina** Meta: post in home + foto profilo header. |
| `FACEBOOK_PAGE_SLUG` | No | Default: `micologia.sandonatese`. |
| `SITE_LOGO_URL` | No | Se vuoi un logo fisso al posto della foto Pagina. |
| `NEXT_PUBLIC_SITE_URL` | **Consigliato** | URL pubblico canonico del sito (es. `https://www.tuodominio.it`), senza slash finale. Usato per Open Graph, canonical, sitemap e JSON-LD. Su Vercel, se omesso, si usa `VERCEL_URL` (ok per preview; in produzione con dominio proprio imposta questa variabile). |

Opzionale: `ASGM_BASE_URL` per script locali (non richiesta dal runtime Next su Vercel).

## Build

Lo script `npm run build` esegue:

1. `prisma migrate deploy` — applica le migrazioni sul DB di produzione  
2. `prisma generate` — genera il client  
3. `next build`

Serve quindi che **`DATABASE_URL` sia disponibile anche in fase di build** (su Vercel: abilita la variabile per “Production” e includi nei build di produzione).

## Cron (tab `vercel.json`)

Dopo il deploy, in **Settings → Cron Jobs** verifica che risultino attivi:

- `/api/cron/process-pending` — giornaliero  
- `/api/cron/species-weekly` — settimanale  
- `/api/cron/species-sync-daily` — giornaliero  

Senza `CRON_SECRET` le chiamate ricevono 401.

## Dopo il primo collegamento repo

1. Aggiungi tutte le variabili sopra.  
2. **Redeploy** (o push su `main`).  
3. Controlla i log di build: deve comparire `migrate deploy` senza errori.  
4. Apri `/api/health` e la home.
