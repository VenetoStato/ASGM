# URL pubblico del sito (riferimento per umani e agenti)

L’indirizzo del sito in **produzione** non è hardcoded nel codice: si configura come variabile d’ambiente.

| Dove | Contenuto |
|------|-------------|
| **`.env`** (locale, non in git) | `ASGM_BASE_URL=https://…` — valore reale usato dagli script (es. `scripts/post-asgm-ingest.mjs`). |
| **`.env.example`** (in git) | Stesso nome variabile, senza segreti; esempio commentato. |
| **`README.md`** | Istruzioni deploy Vercel; menziona variabili in `.env`. |

**Per trovare l’URL (anche da agente OpenClaw):** usa il tool **`read`** sul file **`.env`** nella radice del workspace e leggi **`ASGM_BASE_URL=...`**. Non dire che non puoi leggere `.env`: il file c’è sul disco anche se non è su GitHub.

**«Qual è l’URL del sito dei funghi?»:** risposta = valore di **`ASGM_BASE_URL`** letto da **`.env`**, non scuse sui permessi.
