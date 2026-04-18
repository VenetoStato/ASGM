#!/usr/bin/env python3
"""Test OPENAI_API_KEY from Hermes .env against OpenAI API (no secret printed)."""
from __future__ import annotations

import os
import sys
import urllib.error
import urllib.request

ENV_PATH = os.environ.get("HERMES_ENV", "/root/.hermes/.env")


def load_openai_key(path: str) -> str | None:
    if not os.path.isfile(path):
        print(f"RESULT: NO_ENV_FILE {path}")
        return None
    key: str | None = None
    with open(path, encoding="utf-8", errors="replace") as f:
        for raw in f:
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith("OPENAI_API_KEY="):
                v = line.split("=", 1)[1].strip()
                if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
                    v = v[1:-1]
                key = v
    if not key:
        print("RESULT: KEY_MISSING_OR_EMPTY")
        return None
    return key


def main() -> int:
    key = load_openai_key(ENV_PATH)
    if not key:
        return 2
    req = urllib.request.Request(
        "https://api.openai.com/v1/models",
        headers={"Authorization": f"Bearer {key}"},
        method="GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            code = resp.getcode()
    except urllib.error.HTTPError as e:
        code = e.code
        body = e.read(500).decode("utf-8", errors="replace")
        print(f"HTTP={code}")
        print("RESULT: FAIL")
        if body:
            print(body)
        return 1
    except OSError as e:
        print(f"RESULT: NETWORK_ERROR {e}")
        return 1
    print(f"HTTP={code}")
    if code == 200:
        print("RESULT: OK (chiave accettata da api.openai.com)")
        return 0
    print("RESULT: FAIL")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
