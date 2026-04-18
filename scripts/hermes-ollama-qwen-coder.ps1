# Qwen2.5-Coder su Ollama (Windows) — forte su codice e riparazione, adatto ad agent tipo Hermes.
# Hermes in WSL: stesso base_url verso host Windows :11434 e context_length >= 65536.
#
# VRAM indicativa: 7B ~4.7GB pesi; 14B ~9GB (meglio su GPU 12GB+ con margine KV)

param(
  [string]$Tag = "qwen2.5-coder:7b",
  [switch]$SkipPull
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== Qwen2.5-Coder (Ollama) per Hermes / WSL2 ===" -ForegroundColor Cyan
Write-Host "Tag: $Tag" -ForegroundColor Gray
Write-Host ""

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  Write-Host "ERRORE: ollama non nel PATH." -ForegroundColor Red
  exit 1
}

if (-not $SkipPull) {
  Write-Host "Download $Tag ..." -ForegroundColor Cyan
  ollama pull $Tag
}

Write-Host ""
Write-Host "--- In ~/.hermes/config.yaml (WSL) sezione model ---" -ForegroundColor Green
@"
model:
  default: $Tag
  provider: custom
  base_url: http://HOST_WINDOWS:11434/v1
  context_length: 65536
"@ | Write-Host

Write-Host ""
Write-Host "Sostituisci HOST_WINDOWS con l'IP dell'host da WSL: ip route | awk '/default/{print `$3}'" -ForegroundColor Gray
Write-Host "Poi riavvia: hermes gateway (o nohup ...)" -ForegroundColor Gray
Write-Host ""
