# Hub OpenClaw — una repo, più progetti

## Idea

- **Un clone** sul PC = **un workspace** per OpenClaw (gateway locale).
- Dentro puoi avere **più cartelle** (ASGM in radice, altri progetti in sottocartelle o repo annidati ignorati).
- **Cursor / chat qui** = modifichi file e documentazione; **WhatsApp** = parli con l’agente dal telefono secondo le policy configurate.

## Cosa non va mai in Git (repo pubblica)

- File **`.env`** (segreti, URL con token, DB).
- Cartella **`.openclaw/`** (config gateway, token, credenziali canali) — in **`.gitignore`**.
- Chiavi API, password, stringhe di connessione database.

Usa sempre **`.env.example`** con nomi variabile e valori fittizi.

## Dove si trova cosa

| Bisogno | File / cartella |
|---------|-------------------|
| URL sito (nome variabile) | [`SITE.md`](../SITE.md), `.env.example` |
| Due account WhatsApp | [`openclaw/accounts/WHATSAPP.md`](../openclaw/accounts/WHATSAPP.md) |
| Layout cartelle | [`projects/README.md`](../projects/README.md) |
