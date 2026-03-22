# OpenClaw su questo PC

Il **gateway OpenClaw** deve girare qui (Windows), sempre acceso quando vuoi WhatsApp → sito.

- **Cartella [`accounts/`](accounts/)** — secondo account WhatsApp + policy: vedi [`accounts/WHATSAPP.md`](accounts/WHATSAPP.md) (solo il tuo numero in allowlist; niente messaggi automatici ai clienti).
- **URL del sito** — vedi [`SITE.md`](../SITE.md) nella radice del repo (variabile `ASGM_BASE_URL` in `.env`).
- **Rinomina repo / struttura** — [`docs/REPOSITORY.md`](../docs/REPOSITORY.md).
- **Workspace (tutta la repo, non “solo file condivisi”)** — [`WORKSPACE.md`](../WORKSPACE.md). In chat puoi inviare **`/context list`** o **`/context detail`** per vedere cosa è iniettato nel prompt (documentazione OpenClaw).
- **Risposta più veloce / contesto snello** — [`PERFORMANCE.md`](PERFORMANCE.md) (modello 7b vs 14b, `/compact`, meno giri di tool).

## Config attuale su questo PC (`~/.openclaw/openclaw.json`)

- Plugin **WhatsApp** in `plugins.allow` (solo plugin fidato).
- **`groupPolicy: "disabled"`** — nessun messaggio dai **gruppi** entra nel gateway (evita rumore e rischi sul gruppo). Per abilitare **un** gruppo in futuro: passa a `allowlist` e configura `groups` + `groupAllowFrom` come in [docs WhatsApp](https://docs.openclaw.ai/channels/whatsapp).
- **`dmPolicy`** — in questa installazione può essere **`allowlist`** (solo numeri in `allowFrom`) invece di `pairing` globale; verifica il file `openclaw.json` se qualcosa non risponde.
- **`selfChatMode: true`** — utile se scrivi dal **telefono** nella chat **“Messaggi a te stesso”** (stesso numero collegato a OpenClaw).
- **`configWrites: false`** (canale WhatsApp) — il canale non riscrive la config da solo.
- **`commands.restart: false`** — niente restart gateway da comandi chat (meno rischio).
- Dopo il login QR, OpenClaw vede solo ciò che le policy permettono (qui: **solo DM dopo pairing**, **gruppi spenti**).

## Come “parli” con OpenClaw

1. **Gateway acceso** (`npm run openclaw:start` consigliato — imposta `OLLAMA_API_KEY` per Ollama).
2. **WhatsApp** — messaggi in **chat diretta** o **“Messaggi a te stesso”** sul telefono (non dai gruppi). **Prima volta:** se compare il pairing, sul PC esegui `npx openclaw@latest pairing list whatsapp` e `pairing approve whatsapp <CODICE>`.
3. L’agente risponde in **quella chat** (secondo modello e skill). Il **Canvas** nel browser (`127.0.0.1:18789/...`) è solo test UI, non è il canale principale.
4. **Sito** — solo se configurhi uno skill che fa `POST /api/ingest` (vedi sotto).

## 1. Installazione (una tantum)

```powershell
npm install -g openclaw
```

Oppure senza installazione globale:

```powershell
npx openclaw@latest onboard
```

Segui la procedura guidata. Per il canale WhatsApp:

```powershell
npx openclaw@latest channels add --channel whatsapp
npx openclaw@latest channels login --channel whatsapp
```

Scannerizza il QR con WhatsApp sul telefono.

## Token gateway vs Cursor vs sito

- **`gateway.auth.token`** in `~/.openclaw/openclaw.json` — serve ai **client** che parlano col gateway OpenClaw (es. Canvas, tool locali). **Non** è il token di Cursor, **non** è `INGEST_SECRET`, **non** si scambiano tra loro.
- **Cursor** (editor) ha **le sue** chiavi API: **non** alimentano OpenClaw né il sito ASGM.
- **`INGEST_SECRET`** — solo per `POST /api/ingest` sul sito (Vercel + `.env`).
- **`ADMIN_PASSWORD`** — solo login admin sul sito (`/admin/login`).

## 2. Avvio gateway

Dal terminale (lascia la finestra aperta):

```powershell
npx openclaw@latest gateway
```

Oppure usa lo script nel `package.json` del progetto sito: `npm run openclaw:gateway`.

## 3. Collegamento al sito ASGM

L’API del sito è `POST /api/ingest` con:

- Header: `Authorization: Bearer <INGEST_SECRET>` (stesso valore del file `.env` e di Vercel)
- Body JSON: vedi `README.md` nella root del repo (tipi `event`, `draft`, `species`, `announcement`)

Esempio annuncio (titolo, testo, URL immagini opzionali):

```json
{
  "type": "announcement",
  "title": "Uscita domenica",
  "body": "Ritrovo ore 9 in piazza.",
  "images": ["https://example.com/foto1.jpg"],
  "publish": true
}
```

**Nota WhatsApp:** non esiste un collegamento “automatico” al gruppo per mostrare le ultime foto o i post come su un feed social. WhatsApp non espone un’API pubblica per quello. Le opzioni pratiche sono: (1) incollare link a immagini già pubblicate altrove negli annunci; (2) far sì che OpenClaw, quando riceve un messaggio o un comando, chiami `POST /api/ingest` con il testo (e opzionalmente URL immagine) che costruisci tu nello skill. **Modificare il sito “da WhatsApp”** significa proprio questo: automazione OpenClaw → HTTP verso il tuo dominio con `INGEST_SECRET`, non un plugin che edita il sito senza server.

Devi configurare un **skill / automazione** OpenClaw che, quando arriva un messaggio (es. in **DM** con la policy attuale), costruisce il JSON e chiama l’URL pubblico:

`https://<tuo-progetto>.vercel.app/api/ingest`

Riferimento ufficiale canale WhatsApp: [docs.openclaw.ai/channels/whatsapp](https://docs.openclaw.ai/channels/whatsapp)

## 4. Test senza WhatsApp

Dal repo ASGM (con `.env` compilato):

```powershell
$env:ASGM_BASE_URL="https://tuoprogetto.vercel.app"
node scripts/post-asgm-ingest.mjs
```

Poi controlla `/eventi` sul sito.
