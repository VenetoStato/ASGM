# Guida rapida per chi gestisce il sito

## Variabili su Vercel

- `DATABASE_URL` — Postgres (Neon, Supabase, …).
- `CRON_SECRET` — stesso valore per i cron: `/api/cron/process-pending` e `/api/cron/species-weekly`.
- `ADMIN_PASSWORD` — accesso `/organizzatori`.
- `FACEBOOK_PAGE_ACCESS_TOKEN` — token **di pagina** Meta (per anteprima post e foto profilo in header). Senza token restano il plugin Facebook e i link manuali.
- `FACEBOOK_PAGE_SLUG` — default `micologia.sandonatese` se omesso.
- `SITE_LOGO_URL` — (opzionale) URL immagine logo se non si vuole usare la foto profilo della Pagina.

## Migrazioni database

Dopo ogni deploy con nuove migrazioni Prisma:

```bash
npx prisma migrate deploy
```

## Schede funghi automatiche

- Lista candidati: `data/species-queue.json` (titoli come in Wikipedia italiano, es. `"Boletus edulis"`).
- Ogni lunedio (circa 07:30 UTC) Vercel chiama `/api/cron/species-weekly` con header  
  `Authorization: Bearer <CRON_SECRET>`.
- Al massimo **una** nuova scheda per esecuzione, fino a **5 tentativi** sulla coda. Voci già presenti (stesso nome / Wikidata) vengono saltate.

## Facebook

- La sezione in home ha tre livelli: post via API (se token), plugin ufficiale, pulsante “Apri su Facebook” se il plugin è bloccato dal browser.
