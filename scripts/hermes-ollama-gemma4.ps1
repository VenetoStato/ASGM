# Gemma 4 veloce su RTX 5070 (Blackwell) + bridge Ollama per Hermes in WSL2.
# Hermes non gira su Windows nativo: da WSL punta all'host Windows sulla porta 11434.
# Doc: https://hermes-agent.nousresearch.com/docs/integrations/providers/
#
# VRAM (Gemma 4 E4B, tag e4b-it-q4_K_M): ~9.6 GB pesi su disco; in GPU tipicamente ~9–11 GB
# con contesto moderato, piu KV se alzi molto il contesto. Su 12 GB resta poco margine per il gioco:
# prima di giocare esegui: npm run ollama:free-vram  (o -ConfigureIdleUnload una tantum).

param(
  [switch]$SkipPull,
  [switch]$AllowWslListen
)

$ErrorActionPreference = "Stop"

# Windows/Linux: i tag *-nvfp4 / mxfp8 ufficiali su Ollama possono essere solo macOS (errore 412).
# RTX 5070 ~12GB VRAM: meglio E4B Q4 (~9.6GB) che E2B Q4 (~7.2GB) — piu capacita, resta in VRAM.
# Tier 26B/31B in Q4 sono ~17–20GB+: su 12GB non sono "veloci" (offload CPU / OOM).
$GemmaTag = "gemma4:e4b-it-q4_K_M"
$GemmaTagFastLight = "gemma4:e2b-it-q4_K_M"

Write-Host ""
Write-Host "=== Gemma 4 (Ollama) + prep Hermes / WSL2 ===" -ForegroundColor Cyan
Write-Host "Modello (consigliato 12GB): $GemmaTag" -ForegroundColor Gray
Write-Host "Alternativa piu leggera: $GemmaTagFastLight" -ForegroundColor DarkGray
Write-Host ""

if ($AllowWslListen) {
  $cur = [Environment]::GetEnvironmentVariable("OLLAMA_HOST", "User")
  if ($cur -ne "0.0.0.0") {
    [Environment]::SetEnvironmentVariable("OLLAMA_HOST", "0.0.0.0", "User")
    Write-Host "Impostato variabile utente OLLAMA_HOST=0.0.0.0 (WSL2 puo contattare Windows)." -ForegroundColor Yellow
    Write-Host "Riavvia Ollama (tray / servizio) o il PC, poi in WSL: curl http://`$(ip route | awk '/default/ {print `$3}'):11434/v1/models" -ForegroundColor Yellow
  } else {
    Write-Host "OLLAMA_HOST utente gia 0.0.0.0." -ForegroundColor Green
  }
}

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  Write-Host "ERRORE: ollama non nel PATH. Riapri il terminale dopo l'installazione." -ForegroundColor Red
  exit 1
}

Write-Host "Ollama:" (ollama --version) -ForegroundColor Gray

if (-not $SkipPull) {
  Write-Host "Download $GemmaTag (puo richiedere diversi minuti)..." -ForegroundColor Cyan
  ollama pull $GemmaTag
}

Write-Host ""
Write-Host "--- Hermes (WSL2): incolla in ~/.hermes/config.yaml (sezione model) ---" -ForegroundColor Green
@"

model:
  default: $GemmaTag
  provider: custom
  base_url: http://HOST_WINDOWS:11434/v1
  context_length: 65536

"@ | Write-Host

Write-Host "Sostituisci HOST_WINDOWS con l'IP dell'host Windows visto da WSL, ad esempio:" -ForegroundColor Gray
Write-Host '  export W=$(ip route show default | awk ''{print $3}'')' -ForegroundColor White
Write-Host '  echo "http://${W}:11434/v1"' -ForegroundColor White
Write-Host ""
Write-Host "Oppure: hermes model -> Custom endpoint -> URL sopra -> modello $GemmaTag" -ForegroundColor Gray
Write-Host "Test GPU (Windows): ollama run $GemmaTag `"rispondi solo OK`"" -ForegroundColor Gray
Write-Host ""
