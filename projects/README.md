# Hub progetti (OpenClaw + codice)

Questa repository è il **punto unico** da cui, sul PC, OpenClaw può lavorare su **più progetti**: tutto ciò che sta **sotto la radice** del workspace configurato in `openclaw.json` (`agents.defaults.workspace`) è visibile agli strumenti (`read`, `write`, `exec`, …).

## Layout attuale

| Percorso | Contenuto |
|----------|-----------|
| **Radice del repo** | Applicazione **ASGM** (Next.js, Prisma, API ingest). |
| **`gpittonWeb/`** | Altro progetto annidato (in `.gitignore` del parent: non è tracciato da *questo* Git, ma resta sul disco per i tool). |
| **`openclaw/`**, **`docs/`** | Documentazione hub, account WhatsApp, convenzioni. |

## Aggiungere un altro progetto

1. Metti il codice in una **sottocartella** sotto la stessa radice (es. `projects/nome-progetto/`) **oppure** aggiungi un repo annidato e gestiscilo con `.gitignore` se non deve finire in questo remote.
2. Tieni **un solo** `workspace` OpenClaw sulla radice per avere un unico albero accessibile; sottocartelle incluse.
3. **Repo pubblica:** nessun segreto in chiaro (solo `.env.example`, mai `.env`).

Vedi anche [`docs/REPOSITORY.md`](../docs/REPOSITORY.md) e [`docs/HUB.md`](../docs/HUB.md).
