# Latenza e contesto (OpenClaw + Ollama)

## Come funziona bene (senza “tutto il repo nel prompt”)

- **Giusto:** pochi `.md` di bootstrap + messaggi utente + risultati tool quando servono (`read` / `rg` / `exec`).
- **Sbagliato:** pretendere di avere l’intero sorgente nel contesto statico. Il modello resta piccolo; i tool fanno da “indice e lettura mirata”.

L’agente deve seguire la strategia in **`WORKSPACE.md`** (cicli `rg` → `read` → edit).

## Velocizzare le risposte (in ordine pratico)

### 1. Modello più piccolo come primario (maggior impatto)

Su `~/.openclaw/openclaw.json`, in `agents.defaults.model`:

- **`ollama/qwen2.5-coder:7b`** — di solito **più veloce** su PC consumer.
- **`ollama/qwen2.5-coder:14b`** — più qualità, **più lento**.

Per chat WhatsApp spesso conviene **7b primario** e **14b nei fallback** (o solo 7b se la GPU/CPU regge male il 14b).

Dopo la modifica, riavvia il gateway (o attendi reload se supportato).

### 2. Tenere Ollama “caldo”

Il primo messaggio dopo inattività può essere lento perché il modello viene caricato in RAM/VRAM. Da terminale, per test:

```powershell
ollama run qwen2.5-coder:7b "ping"
```

In uso normale, il gateway tiene vivo il flusso; se spegni spesso il PC, il primo turno sarà più lungo.

### 3. Conversazioni lunghe

Più cronologia = più token = più lento. Usa **`/compact`** in chat (documentazione OpenClaw) quando la sessione è diventata enorme, oppure **`/new`** per ripartire pulito.

### 4. Meno giri di tool quando possibile

Una sola `rg` ben scelta batte cinque letture sequenziali. Raggruppa le ricerche quando ha senso.

### 5. Bootstrap

File di bootstrap troppo lunghi rallentano **ogni** avvio sessione. Se non servono, non gonfiare `AGENTS.md`; i limiti sono in `agents.defaults.bootstrapMaxChars` / `bootstrapTotalMaxChars` in `openclaw.json`.

## Riferimenti

- [Agent workspace](https://docs.openclaw.ai/concepts/agent-workspace) — bootstrap vs tool.
- [Session management](https://docs.openclaw.ai/concepts/session) — `/compact`, scope DM.
