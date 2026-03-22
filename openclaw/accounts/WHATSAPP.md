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
