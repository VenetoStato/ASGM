# TOOLS.md - Local Notes

- **Intera repo = workspace:** vedi **`WORKSPACE.md`** in radice (non è solo una “cartella condivisa”; i tool operano su tutto il tree sotto la radice OpenClaw). Strategia on-demand e latenza: **`openclaw/PERFORMANCE.md`**.

## Workspace (OpenClaw)

- L’elenco completo **cosa può fare l’agente** (tool, limiti, WhatsApp, git) è in **AGENTS.md** (in cima: *REGOLE OBBLIGATORIE*), inclusa la checklist **`rg` / PowerShell** per *«trova file / cerca nel repo»*. Qui solo note operative.
- **URL del sito:** vedi **`SITE.md`** in radice; valore in **`.env`** → `ASGM_BASE_URL` (file `.env` leggibile con i tool anche se non è in git).
- **Cartella di lavoro dell’agente:** `C:\Users\Utente\OpenClawOrchestrator` (progetto ASGM). Gli strumenti `read` / `write` / `edit` / `apply_patch` e `exec` agiscono **qui** (sandbox disattivata sul gateway locale).
- **Altra cartella `gpittonWeb\`:** se esiste, è **dentro** la radice sopra (sottocartella; ignorata dal git del parent ma **accessibile** ai tool come il resto del workspace). Non è un “secondo workspace” su un altro disco: è la stessa alberatura.
- **Repo davvero su un altro path sul PC:** allora serve cambiare `agents.defaults.workspace` in `openclaw.json` oppure usare solo quanto consentito dalla policy; non inventare accessi.
- **Git / push:** le modifiche ai file le puoi fare da qui; **`git push`** funziona solo se sul PC sono già configurati **credenziali Git** (SSH, Git Credential Manager, `gh auth`, ecc.). Se `git push` fallisce, è un problema di autenticazione sul terminale, non di OpenClaw.
- Se da WhatsApp chiedi comandi shell sensibili e il runtime chiede conferma, valuta i comandi `/elevated` documentati in OpenClaw (solo se serve).

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
