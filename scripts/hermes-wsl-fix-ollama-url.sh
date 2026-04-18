#!/usr/bin/env bash
# Aggiorna base_url Ollama in ~/.hermes/config.yaml (WSL -> host Windows).
set -eu
H="$(ip -4 route show default | tr -s ' ' | cut -d ' ' -f3)"
CFG="${HOME}/.hermes/config.yaml"
if [[ ! -f "$CFG" ]]; then
  echo "Manca $CFG" >&2
  exit 1
fi
sed -i "s|base_url: http://[^[:space:]]*|base_url: http://${H}:11434/v1|" "$CFG"
grep base_url "$CFG"
