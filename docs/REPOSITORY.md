# Organizzazione repository e rinomina cartella

## Nome consigliato

Il progetto npm si chiama già **`asgm`**. La cartella locale può coincidere per chiarezza:

- **Suggerito:** `asgm` o `ASGM` (stesso nome del repo GitHub `VenetoStato/ASGM`).

Cartella progetto consigliata: **`C:\Users\Utente\OpenClawOrchestrator`** (nome breve: orchestrazione hub OpenClaw + repo ASGM).

## Come rinominare la cartella (Windows)

1. Chiudi **Cursor** su questa cartella, **terminale** e **gateway OpenClaw** (ho già fermato i processi `node` openclaw/next se erano attivi).
2. Rinomina **`OpenClawWebsiteFunghi+`** in **`OpenClawOrchestrator`** (Esplora file o PowerShell):
   ```powershell
   Rename-Item -LiteralPath "C:\Users\Utente\OpenClawWebsiteFunghi+" -NewName "OpenClawOrchestrator"
   ```
3. **`openclaw.json`** è già impostato su `C:\Users\Utente\OpenClawOrchestrator` (workspace + repoRoot). Se rinomini diversamente, aggiorna quei due campi.
4. Riapri in Cursor **`C:\Users\Utente\OpenClawOrchestrator`** e rilancia `npm run openclaw:start`.

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
