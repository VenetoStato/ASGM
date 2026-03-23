# URL pubblico del sito (riferimento per umani e agenti)

**Deployment Vercel (produzione):** `https://asgm-2acdwhouc-gpittons-projects.vercel.app`

L’indirizzo del sito in **produzione** non è hardcoded nel codice: si configura come variabile d’ambiente (`ASGM_BASE_URL` deve coincidere con l’URL sopra salvo redirect/domini custom).

| Dove | Contenuto |
|------|-------------|
| **`.env`** (locale, non in git) | `ASGM_BASE_URL=https://…` — valore reale usato dagli script (es. `scripts/post-asgm-ingest.mjs`). |
| **`.env.example`** (in git) | Stesso nome variabile, senza segreti; esempio commentato. |
| **`README.md`** | Istruzioni deploy Vercel; menziona variabili in `.env`. |

**Per trovare l’URL (anche da agente OpenClaw):** in ordine — **`SITE.md`** (questo file: tabella sopra), **`read`** su **`.env.example`**, oppure **`.env`** se il tool `read` è consentito. Se `.env` non si legge, **non importa**: usa **`.env.example`** o chiedi all’utente; per il resto del codice continua con `read`/`edit` normalmente.

**«Qual è l’URL del sito dei funghi?»:** risposta = valore documentato ( **`ASGM_BASE_URL`** da `.env.example` o `.env` quando leggibile), non scuse generiche sull’accesso ai file.
