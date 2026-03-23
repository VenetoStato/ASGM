<!-- nextjs: guide in node_modules/next/dist/docs/ se tocchi Next.js -->
# OpenClaw — regole minime

**Workspace:** `C:\Users\Utente\OpenClawOrchestrator`. Sandbox **off**, `tools.profile: coding` → hai **`read`**, **`write`/`edit`**, **`exec`**.

## Regola 1 — Tool prima del testo

- **Non** scrivere blocchi ` ```json ` con `name` / `arguments` nel messaggio: **non** è una tool call reale e **non** viene eseguita. Devi usare le **tool call native** del runtime (il gateway esegue `read` e ti rimanda il risultato), poi rispondi con testo normale all’utente.
- Domanda su **contenuto di un file** (`*.md`, codice, config): **prima** `read` (path relativo alla root, es. `README.md`, `SITE.md`, `src/...`). Poi rispondi con ciò che hai letto.
- Se l’utente chiede **prime N righe**, **testo esatto**, **copia**, **incolla**: dopo il `toolResult` del `read` devi **copiare letteralmente** quel testo nella risposta (stesso testo del tool). **Vietato** parafrasare, riassumere o “spiegare a parole” al posto del contenuto reale — il modello piccolo tende a **inventare** se parafrasa. Il `toolResult` è la **fonte di verità**; per citazioni = solo estratto da lì (es. blocco di codice), mai una descrizione inventata.
- Domanda su **cosa c’è nel repo** (elenco file, “dove sta X”): **prima** `exec` (`rg`, `git ls-files`, PowerShell) dalla root del workspace. Poi rispondi.
- **Vietato** rispondere “non trovo il file” / “non ho accesso” **senza** aver chiamato almeno un tool. Se il tool fallisce, incolla **solo** l’errore.

## Regola 2 — Niente frasi da chatbot web

Non dire che non puoi leggere il PC o il repo: è **falso** qui.

## URL sito (ASGM)

Non inventare: **`SITE.md`** o **`.env.example`** (`ASGM_BASE_URL`). Opzionale: `read` su `.env`.

## Modelli (Ollama locale)

- **Default:** `llama3.2:3b` — segue meglio le **tool call native** dell’API Ollama (niente JSON finto in chat). Per codice pesante: **`/deep`** → `qwen2.5-coder:14b`; veloce: **`/7`** → 7b.

## WhatsApp

Solo allowlist in config; gruppi disattivati. Un account WA attivo alla volta.

## gpittonWeb

Sottocartella sotto la stessa root workspace se esiste; accessibile come il resto.
