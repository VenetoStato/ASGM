# Libera VRAM: ferma tutti i modelli Ollama ancora caricati su GPU/RAM.
# Usa prima di avviare un gioco pesante (o dopo sessioni Hermes/OpenClaw).
# Richiede: ollama serve in esecuzione.

param(
  [switch]$ConfigureIdleUnload,
  [string]$IdleKeepAlive = "2m"
)

$ErrorActionPreference = "Stop"
$base = "http://127.0.0.1:11434"

try {
  $ps = Invoke-RestMethod -Uri "$base/api/ps" -Method Get -TimeoutSec 5
} catch {
  Write-Host "Ollama non risponde su $base. Avvia Ollama (tray) o: ollama serve" -ForegroundColor Red
  exit 1
}

$n = @($ps.models)
if ($n.Count -eq 0) {
  Write-Host "Nessun modello caricato (VRAM gia libera lato Ollama)." -ForegroundColor Green
} else {
  foreach ($m in $n) {
    $name = $m.name
    if ($name) {
      Write-Host "Stop: $name" -ForegroundColor Yellow
      & ollama stop $name 2>&1 | Out-Null
    }
  }
  Write-Host "Fatto. Verifica con: ollama ps" -ForegroundColor Green
}

if ($ConfigureIdleUnload) {
  [Environment]::SetEnvironmentVariable("OLLAMA_KEEP_ALIVE", $IdleKeepAlive, "User")
  Write-Host ""
  Write-Host "Impostato OLLAMA_KEEP_ALIVE=$IdleKeepAlive (ambiente utente)." -ForegroundColor Cyan
  Write-Host "Riavvia Ollama dal tray (Esci poi riapri) o riavvia il PC." -ForegroundColor Yellow
}
