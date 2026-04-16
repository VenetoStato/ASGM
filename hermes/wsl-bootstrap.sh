#!/usr/bin/env bash
# Prepara ~/.hermes per Telegram (allowlist) + Ollama su Windows.
# Esegui da Ubuntu WSL dalla root del repo ASGM:
#   bash hermes/wsl-bootstrap.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HERMES="${HOME}/.hermes"

if ! command -v hermes >/dev/null 2>&1; then
  echo "Hermes non trovato nel PATH."
  echo "Installa nell Ubuntu WSL (richiede Git):"
  echo "  curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash"
  echo "Poi: source ~/.bashrc  oppure  apri un nuovo terminale WSL, e rilancia questo script."
  exit 1
fi

mkdir -p "${HERMES}/logs"

if [[ ! -f "${HERMES}/.env" ]]; then
  cp "${SCRIPT_DIR}/dot-env.example" "${HERMES}/.env"
  chmod 600 "${HERMES}/.env"
  echo "Creato ${HERMES}/.env"
  echo "  -> Inserisci TELEGRAM_BOT_TOKEN (BotFather) e TELEGRAM_ALLOWED_USERS (solo il tuo ID numerico)."
else
  echo "Esiste gia ${HERMES}/.env (non sovrascritto)."
fi

WIN_HOST="$(ip route show default 2>/dev/null | awk '{print $3}' || true)"
if [[ -z "${WIN_HOST}" ]]; then
  echo "Non ho rilevato l IP dell host Windows (ip route). Imposta a mano base_url in config.yaml."
  WIN_HOST="__REPLACE_WINDOWS_HOST__"
fi

if [[ ! -f "${HERMES}/config.yaml" ]]; then
  sed "s/__WINDOWS_HOST__/${WIN_HOST}/g" "${SCRIPT_DIR}/config.minimal.yaml" > "${HERMES}/config.yaml"
  echo "Creato ${HERMES}/config.yaml con Ollama -> http://${WIN_HOST}:11434/v1"
else
  echo "Esiste gia ${HERMES}/config.yaml (non sovrascritto)."
  echo "Se manca il modello Ollama, unisci il contenuto di ${SCRIPT_DIR}/config.minimal.yaml (sostituisci __WINDOWS_HOST__ con ${WIN_HOST})."
fi

echo ""
echo "Verifica Ollama raggiungibile da WSL:"
echo "  curl -sS \"http://${WIN_HOST}:11434/v1/models\" | head -c 400 || echo \"(fallito: avvia Ollama su Windows e imposta OLLAMA_HOST=0.0.0.0 se serve)\""
echo ""
echo "Quando .env e config sono ok:"
echo "  hermes gateway"
echo "Poi apri Telegram e scrivi al tuo bot (solo il tuo user ID e in allowlist)."
