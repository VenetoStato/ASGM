#!/usr/bin/env bash
set -euo pipefail
ENV_FILE="${HERMES_ENV:-/root/.hermes/.env}"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "RESULT: NO_ENV_FILE $ENV_FILE"
  exit 2
fi
set -a
# shellcheck source=/dev/null
source "$ENV_FILE"
set +a
if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "RESULT: KEY_MISSING_OR_EMPTY"
  exit 2
fi
code=$(curl -sS -o /tmp/oai_models.json -w "%{http_code}" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models)
echo "HTTP=$code"
if [[ "$code" == "200" ]]; then
  echo "RESULT: OK (chiave accettata da api.openai.com)"
  exit 0
fi
echo "RESULT: FAIL"
head -c 500 /tmp/oai_models.json 2>/dev/null || true
echo
exit 1
