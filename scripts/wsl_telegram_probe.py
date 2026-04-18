#!/usr/bin/env python3
"""Call Telegram getMe + getWebhookInfo using token from Hermes .env (no token printed)."""
from __future__ import annotations

import json
import os
import sys
import urllib.request

ENV_PATH = os.environ.get("HERMES_ENV", "/root/.hermes/.env")


def load_token(path: str) -> str | None:
    if not os.path.isfile(path):
        print(f"RESULT: NO_ENV_FILE {path}")
        return None
    for raw in open(path, encoding="utf-8", errors="replace"):
        line = raw.strip()
        if line.startswith("TELEGRAM_BOT_TOKEN="):
            v = line.split("=", 1)[1].strip()
            if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
                v = v[1:-1]
            return v or None
    print("RESULT: TELEGRAM_BOT_TOKEN_MISSING")
    return None


def main() -> int:
    tok = load_token(ENV_PATH)
    if not tok:
        return 2
    base = f"https://api.telegram.org/bot{tok}/"
    for ep in ("getMe", "getWebhookInfo"):
        req = urllib.request.Request(base + ep, method="GET")
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = json.load(resp)
        except OSError as e:
            print(f"{ep}: ERROR {e}")
            return 1
        print(f"{ep}:", json.dumps(data, indent=2)[:2000])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
