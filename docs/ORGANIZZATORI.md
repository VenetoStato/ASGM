# Guida rapida per chi gestisce il sito

Checklist completa deploy: **[VERCEL.md](./VERCEL.md)**.

## Variabili su Vercel

- `DATABASE_URL` — Postgres (Neon, Supabase, …).
- `CRON_SECRET` — stesso valore per tutti i cron (vedi sotto).
- `ADMIN_PASSWORD` — accesso `/organizzatori`.
- `FACEBOOK_PAGE_ACCESS_TOKEN` — token **di pagina** Meta (per anteprima post e foto profilo in header). Senza token restano il plugin Facebook e i link manuali.
- `FACEBOOK_PAGE_SLUG` — default `micologia.sandonatese` se omesso.
- `SITE_LOGO_URL` — (opzionale) URL immagine logo se non si vuole usare la foto profilo della Pagina.

## Migrazioni database

Dopo ogni deploy con nuove migrazioni Prisma:

```bash
npx prisma migrate deploy
```

## Schede funghi: fonti e aggiornamento continuo

Le schede **importate automaticamente** usano solo **fonti istituzionali documentate**:

1. **Wikipedia in italiano** — testo descrittivo (API REST ufficiale), con link alla voce.
2. **GBIF Backbone** — [Global Biodiversity Information Facility](https://www.gbif.org/) — verifica del nome scientifico e link alla scheda tassonomica (API pubblica `species/match`).

Non sono sostituti di guide micologiche sul campo o pareri medici: in ogni scheda c’è un disclaimer.

### Cron automatici (tutti con `Authorization: Bearer CRON_SECRET`)

| Percorso | Quando | Cosa fa |
|----------|--------|---------|
| `/api/cron/species-weekly` | Lunedì ~07:30 UTC | Aggiunge **al massimo 1 nuova** scheda dalla coda `data/species-queue.json` (titoli come in Wikipedia IT), fino a 5 tentativi. |
| `/api/cron/species-sync-daily` | Ogni giorno ~05:15 UTC | **Rilegge Wikipedia** per le schede auto-importate non aggiornate da ~20 ore (batch fino a 18), aggiorna testo/link e completa GBIF se prima mancava. |

La coda `data/species-queue.json` contiene i **candidati** (nomi di specie = titoli voce). Puoi aggiungere voci attendibili in coda; il sistema non inventa nomi.

## Facebook

- La sezione in home ha tre livelli: post via API (se token), plugin ufficiale, pulsante “Apri su Facebook” se il plugin è bloccato dal browser.
