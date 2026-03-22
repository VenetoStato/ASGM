# Più account WhatsApp (OpenClaw)

**Policy (solo tu, niente spam clienti):** leggi [`WHATSAPP.md`](WHATSAPP.md).

OpenClaw supporta **un solo gateway** sul PC, ma **più account WhatsApp** collegati come **account** distinti nel canale.

## Quando serve

- Un numero per **te** (personale / bot) e un altro per **un’organizzazione** o un secondo telefono.
- Ogni account ha credenziali separate sotto `~/.openclaw/credentials/whatsapp/<accountId>/`.

## Passi tipici (sintesi)

1. In **`openclaw.json`**, sotto `channels.whatsapp.accounts`, aggiungi un id (es. `"org"`) oltre a `"default"`, con le stesse chiavi che usi per `default` (`enabled`, `dmPolicy`, `allowFrom`, …).
2. Associa il secondo numero con:
   ```bash
   npx openclaw@latest channels login --account org
   ```
   (QR / dispositivi collegati come da doc OpenClaw.)
3. Riavvia il gateway.

## Routing verso “non il mio account”

Chi scrive da **quale** numero decide **quale account WhatsApp** riceve il messaggio; la policy (`allowFrom`, pairing, ecc.) è **per account**. Per legare messaggi a **agenti/workspace diversi** si usano **bindings** (vedi documentazione OpenClaw *multi-agent* / routing).

Questa cartella serve solo da **promemoria**; la verità operativa è sempre `openclaw.json` + comandi `openclaw channels …`.
