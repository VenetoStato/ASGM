# Hub AI locale (cartella condivisa)

Setup e note centrali per Ollama / modelli sul PC:

**`C:\Users\Utente\local-ai\README.md`**

Lì trovi: modelli consigliati, comandi, come passare a **Qwen2.5-Coder 14B** quando il download è completato.

OpenClaw è configurato con:

- `OLLAMA_API_KEY` (utente Windows) = `ollama-local`
- `agents.defaults.workspace` / `repoRoot` = questa cartella progetto
- Modello primario: `ollama/qwen2.5-coder:7b` (sempre disponibile), fallback verso `14b` quando presente in `ollama list`

Riavvia il terminale (o il PC) dopo il primo set della variabile d’ambiente, poi:

`npx openclaw@latest models list`

## Come “parli” al modello (test)

1. **Solo Ollama (senza OpenClaw)** — verifica che il modello risponda:
   ```powershell
   ollama run qwen2.5-coder:7b "Dimmi OK se mi senti"
   ```
   Con **14b** (dopo `ollama pull`): `ollama run qwen2.5-coder:14b "..."`.

2. **OpenClaw + agente** — avvia il gateway:
   ```powershell
   npm run openclaw:gateway
   ```
   Poi **canale** (es. **WhatsApp**): messaggio in **chat diretta** all’account collegato (DM), dopo eventuale **pairing**. L’agente usa il modello configurato (`7b` primario per latenza; **`14b`** nei fallback se serve più qualità).

3. **Modelli disponibili per OpenClaw:**
   ```powershell
   $env:OLLAMA_API_KEY="ollama-local"
   npx openclaw@latest models list
   ```

**Git push:** le modifiche al sito sono state committate e inviate su `origin/main` (Vercel farà deploy se il progetto è collegato).
