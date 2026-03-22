# URL pubblico del sito (riferimento per umani e agenti)

L’indirizzo del sito in **produzione** non è hardcoded nel codice: si configura come variabile d’ambiente.

| Dove | Contenuto |
|------|-------------|
| **`.env`** (locale, non in git) | `ASGM_BASE_URL=https://…` — valore reale usato dagli script (es. `scripts/post-asgm-ingest.mjs`). |
| **`.env.example`** (in git) | Stesso nome variabile, senza segreti; esempio commentato. |
| **`README.md`** | Istruzioni deploy Vercel; menziona variabili in `.env`. |

**Per trovare l’URL:** apri `.env` nel workspace e cerca `ASGM_BASE_URL`, oppure leggi `.env.example` per il nome della variabile.
