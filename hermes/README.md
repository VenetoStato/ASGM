# Hermes + Telegram (solo tu) + Ollama su Windows

Hermes **non gira su Windows nativo**: va installato in **WSL2 (Ubuntu)**. Il bot Telegram resta raggiungibile da Internet; **solo gli user ID in `TELEGRAM_ALLOWED_USERS`** possono usarlo (documentazione: messaggi “unauthorized” per gli altri).

## 1. Prerequisiti

- **Ubuntu su WSL2** (non basta `docker-desktop` come unica distro):  
  `wsl --install -d Ubuntu`
- **Ollama su Windows** in ascolto anche verso WSL: variabile utente `OLLAMA_HOST=0.0.0.0`, poi riavvio Ollama. Modello consigliato: `gemma4:e4b-it-q4_K_M` (`npm run ollama:pull-gemma4` dalla root ASGM).

## 2. Bot Telegram

1. @BotFather → `/newbot` → salva il **token**.
2. Il tuo **user ID numerico** (non `@username`): @userinfobot o @get_id_bot.

## 3. Installazione Hermes (una tantum, dentro WSL)

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
source ~/.bashrc
```

## 4. Config automatica da questo repo

Da **Windows**, nella cartella ASGM:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hermes-wsl-bootstrap.ps1
```

Oppure da **WSL**, dalla root del repo:

```bash
bash hermes/wsl-bootstrap.sh
```

Poi modifica **`~/.hermes/.env`** in WSL: incolla token e **un solo** `TELEGRAM_ALLOWED_USERS=<tuo_id>`.

## 5. Avvio gateway

Dentro WSL:

```bash
hermes gateway
```

Test: messaggio in Telegram al bot. Se non risponde, controlla log in `~/.hermes/logs/` e che `curl http://<host-windows>:11434/v1/models` da WSL funzioni.

## Riferimenti

- [Telegram | Hermes](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram/)
- [Installazione Hermes](https://hermes-agent.nousresearch.com/docs/getting-started/installation)
