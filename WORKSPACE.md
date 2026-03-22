# Workspace OpenClaw (dove sono “tutti i file”)

Questa directory è la **radice** usata da OpenClaw (`agents.defaults.workspace` e `repoRoot` in `~/.openclaw/openclaw.json`).

## Cosa significa in pratica

- **Non** esiste una cartella separata di “solo file condivisi” con il resto bloccato: per i tool (`read`, `write`, `exec`, …) il **workspace è l’intera alberatura sotto questa cartella** (salvo sandbox attiva altrove; qui è `off`).
- All’**avvio sessione** OpenClaw **inietta nel prompt** solo alcuni file di bootstrap (`AGENTS.md`, `SOUL.md`, …), con limiti di caratteri. È normale: **non** sono tutti i sorgenti in quel blocco. Per il resto del codice l’agente deve usare i **tool** e cercare (`rg`, `read`).
- **`.env`** e file in `.gitignore` sono comunque **sul disco** qui dentro: si leggono con `read` o comandi, anche se non sono su GitHub.

## Dove cercare nel progetto

- App Next.js: `src/`
- DB Prisma: `prisma/`
- Script: `scripts/`
- Doc hub / OpenClaw: `docs/`, `openclaw/`

Per un elenco rapido da terminale: `Get-ChildItem -Recurse -File -Name | Select-Object -First 200` (o `rg --files`).

## Strategia “ciclica” / on-demand (consigliata)

L’agente **non** deve mettere tutto il codice nel contesto del modello. Il flusso ottimale è:

1. **`rg`** (o ricerca mirata) per capire *dove* intervenire.
2. **`read`** solo sui file (e spesso solo sulle righe rilevanti) necessari.
3. Eventuale secondo `rg` più specifico, poi modifica.

È il modo corretto di usare OpenClaw: **contesto minimo nel prompt**, **lavoro sui file via tool**. Per tempi di risposta più bassi vedi **`openclaw/PERFORMANCE.md`**.
