# WhatsApp: due account, solo il tuo numero, niente spam ai clienti

## Obiettivo

- **Account secondario** (es. numero attività / SIM dedicata) collegato a OpenClaw per **gestire progetti** da automazioni e tool.
- **Comunicazione con l’agente solo dal tuo numero** (stesso numero autorizzato in allowlist): **non** usare OpenClaw per **inviare messaggi automatici** a clienti o liste di contatti.

OpenClaw **non** sostituisce un tool di marketing; per policy e reputazione evitare broadcast non richiesti.

## Config consigliata (sintesi)

Per **ogni** account WhatsApp sotto `channels.whatsapp.accounts.<id>`:

- **`dmPolicy`: `allowlist`**
- **`allowFrom`**: **solo** il tuo numero in formato E.164 (es. `+39…`), lo **stesso** per `default` e per l’account secondario se vuoi che **solo tu** possa parlare con il bot su entrambi i numeri.
- **`groupPolicy`: `disabled`** se non ti servono i gruppi.
- **`selfChatMode`: `true`** se usi “Messaggio a te stesso”.

Così **nessun cliente** riceve messaggi dall’agente finché non è esplicitamente nella policy (e in generale **non** mettere clienti in `allowFrom` se non vuoi che parlino col bot).

## Collegare il secondo account (stesso gateway, due numeri WhatsApp)

L’obiettivo è **due sessioni WhatsApp** (es. personale + SIM attività), **ma** su **entrambe** solo **il tuo numero** in `allowFrom` — così clienti e sconosciuti **non** parlano col bot.

1. **In `~/.openclaw/openclaw.json`**, sotto `channels.whatsapp.accounts`, aggiungi un secondo id (es. `"secondario"`) **copiando le stesse chiavi** di `"default"`: `enabled`, `dmPolicy: "allowlist"`, **`allowFrom` identico** (solo il tuo E.164), `selfChatMode`, `groupPolicy: "disabled"`, `configWrites`, `debounceMs`. Non aggiungere altri numeri se non vuoi che scrivano al bot.
2. **Associazione QR** (dal PC, con gateway **spento** o seguendo la doc se richiede il gateway — in dubbio spegni prima il gateway):
   ```bash
   npx openclaw@latest channels login --channel whatsapp --account secondario
   ```
   Scannerizza il QR con **il secondo telefono / secondo numero** (WhatsApp su quel dispositivo).
3. **Riavvia** il gateway (`npm run openclaw:start` o il comando che usi).
4. **Prova:** dalla chat **solo tu** (allowlist) su quel numero; messaggi da altri numeri devono essere **ignorati** o richiedere pairing se cambi policy — con **`allowlist` stretta** non devono entrare.

Se il comando non accetta `--channel`, usa solo `channels login --account secondario` come da versione installata (`openclaw channels login --help`).

La documentazione ufficiale OpenClaw descrive account multipli e binding; questa nota è **policy + passi** per questo hub.

## Un solo numero WhatsApp: evitare “due account” attivi

Se **non** hai un secondo numero/SIM dedicato, lascia **un solo** account WhatsApp in `channels.whatsapp.accounts` con `enabled: true` (di solito `default`) e imposta **`secondario` → `enabled: false`**.

Due provider attivi con la **stessa** allowlist sullo **stesso** utente possono dare l’impressione che le risposte “saltino” tra contesti o chat. Quando avrai un secondo numero reale, riattiva `secondario`, fai `channels login --account secondario` e riavvia il gateway.

## Separazione ruoli

| Canale | Uso |
|--------|-----|
| **Cursor / IDE** | Edit codice, commit, review |
| **WhatsApp (solo tu)** | Comandi vocali/testuali all’agente sul PC |
| **Clienti** | **Non** automatizzare messaggi outbound tramite OpenClaw senza consenso e product dedicato |

## Modifiche file + PowerShell sul PC (cosa deve esserci)

Il gateway su **Windows** usa **PowerShell** per il tool **`exec`** (preferisce `pwsh`, altrimenti Windows PowerShell 5.1). I file si cambiano con **`read`** / **`write`** / **`edit`**, non solo con messaggi in chat.

### 1. `~/.openclaw/openclaw.json` (già così in questa installazione)

- `agents.defaults.sandbox.mode`: **`off`** (nessun container che blocca il disco).
- `tools.profile`: **`coding`** (include `read`, `write`, `edit`, `exec`, …).
- `tools.exec` almeno:
  - **`host`**: **`gateway`** (comandi sul PC dove gira OpenClaw, non “sandbox” vuota).
  - **`security`**: **`full`**
  - **`ask`**: **`off`** (niente richieste di approvazione interattiva che su WhatsApp finiscono in deny).

Dopo ogni cambio a questo file: **riavvia il gateway** (`npm run openclaw:start` dalla repo).

### 2. Se una sessione WhatsApp “non esegue” comandi

In chat (messaggio da solo), prova a fissare i default **`exec`** per quella sessione:

```text
/exec host=gateway security=full ask=off
```

Poi ripeti la richiesta (leggi `/exec` senza argomenti per vedere i valori attuali).

### 3a. Modello su WhatsApp (file che non si modificano mai)

Se l’agente **risponde** ma **non usa mai** `read` / `edit` / `exec`, il colpevole tipico è **`qwen2.5-coder:7b`**: spesso **non invoca i tool** (non è un blocco filesystem). In `~/.openclaw/openclaw.json` è impostato **`channels.modelByChannel.whatsapp["+39…"]` → `ollama/qwen2.5-coder:14b`** solo per la chat legata a quel numero, così su **WhatsApp** ha più probabilità di **toccare davvero i file**; altrove puoi restare sul 7b. Dopo il cambio: **riavvia il gateway**.

### 3. Messaggio tipo da incollare (forza uso tool)

```text
Usa i tool: prima read sul file … poi write o edit con le modifiche. Per verificare usa exec con PowerShell nella cartella del repo, es. npx eslint src/.... Non rispondere solo con istruzioni: esegui i tool e riporta l’output.
```

Se il **7b** continua a blaterare senza tool, usa **`/deep`** (passa al 14b) per quel messaggio.

### 3b. Esempio reale: gradiente hero (home)

Il blocco colorato in cima alla home è in **`src/app/page.tsx`**, sulla `<section>` del hero: classi **`bg-gradient-to-br from-… via-… to-…`** (Tailwind).  
Messaggio tipo che riduce ambiguità:

```text
/deep
Apri con il tool read src/app/page.tsx. Cambia solo la className della prima section hero: gradiente marrone (es. from-amber-950 via-stone-800 to-stone-950) e colori testo coerenti in quel blocco. Salva con write o edit. Poi exec: npx eslint src/app/page.tsx
```

**Perché a volte “non succede nulla”:** il **7b** spesso risponde a parole senza chiamare `read`/`edit`. **`/deep`** (14b) + `exec` già configurato su gateway aumentano molto la probabilità che i file vengano toccati davvero. Dopo le modifiche, **commit + push** se vuoi il sito su Vercel aggiornato.

### 4. Aggiorna OpenClaw periodicamente

Da terminale: `npx openclaw@latest --version` e aggiorna spesso (`npm`/`npx` scarica versioni nuove). Fix recenti riguardano il **round-trip tool ↔ Ollama** (es. issue GitHub **openclaw#50713**): tenersi aggiornati riduce risposte vuote dopo i tool.

### 5. Git push

`git` deve funzionare **nel terminale normale** sullo stesso PC (PATH + credenziali). L’agente usa **`exec`** nello stesso ambiente: se `git push` fallisce, l’errore è quasi sempre **autenticazione** (HTTPS/SSH), non “WhatsApp”.

### 6. «Non ho accesso ai file» ma il vero errore è Ollama (log)

Nel file di log (`%TEMP%\openclaw\openclaw-*.log`) può comparire:

`All models failed … Ollama requires authentication to be registered as a provider. Set OLLAMA_API_KEY="ollama-local"`

Significa che il **processo gateway** è partito **senza** `OLLAMA_API_KEY` nell’ambiente: OpenClaw **non registra il provider Ollama**, **nessun modello** risponde bene → risposte generiche / sensazione di “non posso accedere ai file”.

**Fix:** avvia sempre con `npm run openclaw:start` (imposta la variabile), oppure variabile utente Windows `OLLAMA_API_KEY=ollama-local` (lo script ora la imposta al primo avvio se manca). Dopo `setx` o modifica variabili utente, **riapri il terminale** e riavvia il gateway.
