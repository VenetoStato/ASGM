#!/usr/bin/env bash
# Avvio gateway Hermes su WSL.
#
# Consigliato (si riavvia da solo dopo crash / restart da Telegram):
#   sudo hermes gateway install --system --force --run-as-user root
#   sudo systemctl enable --now hermes-gateway
#   sudo systemctl status hermes-gateway
#
# Fallback manuale (se non usi systemd):
#   setsid -f bash -c 'exec /root/.local/bin/hermes gateway run >> ~/.hermes/logs/gateway.log 2>&1'

set -euo pipefail

HERMES_BIN="${HERMES_BIN:-/root/.local/bin/hermes}"
LOG_DIR="${HERMES_HOME:-$HOME/.hermes}/logs"
mkdir -p "$LOG_DIR"

if command -v systemctl >/dev/null 2>&1 && systemctl is-system-running >/dev/null 2>&1; then
  if [[ -f /etc/systemd/system/hermes-gateway.service ]] || [[ -f /lib/systemd/system/hermes-gateway.service ]]; then
    systemctl start hermes-gateway || true
    sleep 2
    if systemctl is-active --quiet hermes-gateway; then
      echo "OK — servizio systemd hermes-gateway attivo"
      systemctl status hermes-gateway --no-pager -l | head -12
      exit 0
    fi
  fi
fi

if ! command -v setsid >/dev/null 2>&1; then
  echo "Né systemd né setsid: usa tmux new -d -s hermes '$HERMES_BIN gateway run'"
  exit 1
fi

pkill -f "$HERMES_BIN gateway run" 2>/dev/null || true
sleep 1
setsid -f bash -c "exec $HERMES_BIN gateway run >> \"$LOG_DIR/gateway.log\" 2>&1"
sleep 3
if "$HERMES_BIN" gateway status; then
  echo "OK — log: $LOG_DIR/gateway.log"
else
  echo "Avvio non confermato; controlla tail -50 \"$LOG_DIR/agent.log\""
  exit 1
fi
