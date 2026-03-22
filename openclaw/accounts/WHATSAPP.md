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

## Collegare il secondo account

1. Aggiungi in `~/.openclaw/openclaw.json` un secondo id sotto `channels.whatsapp.accounts` (es. `"lavoro": { … }`).
2. Esegui il login dedicato:
   ```bash
   npx openclaw@latest channels login --account lavoro
   ```
3. Riavvia il gateway.

La documentazione ufficiale OpenClaw descrive account multipli e binding; questa nota è solo **policy** per questo hub.

## Separazione ruoli

| Canale | Uso |
|--------|-----|
| **Cursor / IDE** | Edit codice, commit, review |
| **WhatsApp (solo tu)** | Comandi vocali/testuali all’agente sul PC |
| **Clienti** | **Non** automatizzare messaggi outbound tramite OpenClaw senza consenso e product dedicato |
