# Rinomina la cartella progetto in OpenClawOrchestrator.
# Esegui SOLO con Cursor chiuso su questa cartella, altrimenti "in uso".
# Da PowerShell:
#   powershell -ExecutionPolicy Bypass -File .\scripts\rename-to-openclaw-orchestrator.ps1

$ErrorActionPreference = "Stop"
$parent = "C:\Users\Utente"
$oldName = "OpenClawWebsiteFunghi+"
$newName = "OpenClawOrchestrator"
$oldPath = Join-Path $parent $oldName
$newPath = Join-Path $parent $newName

if (-not (Test-Path -LiteralPath $oldPath)) {
  Write-Host "Cartella non trovata: $oldPath" -ForegroundColor Red
  exit 1
}
if (Test-Path -LiteralPath $newPath) {
  Write-Host "Esiste gia: $newPath" -ForegroundColor Red
  exit 1
}

Rename-Item -LiteralPath $oldPath -NewName $newName
Write-Host "OK: $newPath" -ForegroundColor Green
Write-Host "Riapri Cursor su quella cartella e avvia: npm run openclaw:start"
