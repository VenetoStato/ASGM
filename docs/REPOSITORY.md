# Organizzazione repository e rinomina cartella

## Nome consigliato

Il progetto npm si chiama già **`asgm`**. La cartella locale può coincidere per chiarezza:

- **Suggerito:** `asgm` o `ASGM` (stesso nome del repo GitHub `VenetoStato/ASGM`).

Il nome attuale `OpenClawWebsiteFunghi+` è storico; rinominare è solo organizzativo.

## Come rinominare la cartella (Windows)

1. Chiudi **Cursor**, **terminale** e **gateway OpenClaw** (finestra `openclaw gateway`).
2. Rinomina la cartella in Esplora file (es. `C:\Users\Utente\asgm`).
3. Aggiorna **`C:\Users\Utente\.openclaw\openclaw.json`**:
   - `agents.defaults.workspace`
   - `agents.defaults.repoRoot`  
   con il nuovo path assoluto.
4. Riapri il progetto in Cursor dalla nuova cartella e rilancia `npm run openclaw:start`.

Il **remote Git** (`origin`) non cambia rinominando la cartella.

## Struttura utile

| Percorso | Ruolo |
|----------|--------|
| `/` | App Next.js ASGM |
| [`openclaw/`](../openclaw/) | Documentazione e note OpenClaw legate a questo repo |
| [`openclaw/accounts/`](../openclaw/accounts/) | Note per **più account WhatsApp** (gateway) |
| [`docs/`](.) | Questa guida e altre note di progetto |
| [`SITE.md`](../SITE.md) | Dove si trova l’URL pubblico (`ASGM_BASE_URL`) |
| [`HUB.md`](HUB.md) | Hub multi-progetto + regole per repo pubblica |
| [`../openclaw/accounts/WHATSAPP.md`](../openclaw/accounts/WHATSAPP.md) | Due account WhatsApp, solo tu in allowlist |
