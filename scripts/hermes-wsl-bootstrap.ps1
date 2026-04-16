# Esegue hermes/wsl-bootstrap.sh in WSL (richiede distro Ubuntu o simile).
# Uso: powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hermes-wsl-bootstrap.ps1
# Se la tua distro ha altro nome: -Distro "Ubuntu-24.04"

param(
  [string]$Distro = "Ubuntu"
)

$ErrorActionPreference = "Stop"
$repo = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

$raw = wsl -l -q 2>$null
$installed = if ($raw) {
  @($raw -split "`r?`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ })
} else { @() }
if ($installed -notcontains $Distro) {
  Write-Host "Nessuna distro WSL named '$Distro'. Hermes richiede Ubuntu (o simile), non solo docker-desktop." -ForegroundColor Red
  Write-Host "Installa: wsl --install -d Ubuntu" -ForegroundColor Yellow
  Write-Host "Poi riavvia il PC se richiesto, apri Ubuntu dal menu Start, e rilancia questo script." -ForegroundColor Yellow
  Write-Host "Distro attuali:" -ForegroundColor Yellow
  wsl -l -v
  exit 1
}

$check = wsl -d $Distro -e true 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "Impossibile avviare WSL -d $Distro" -ForegroundColor Red
  wsl -l -v
  exit 1
}

$unixPath = (wsl wslpath -a $repo).Trim()
wsl -d $Distro --cd $unixPath -e bash ./hermes/wsl-bootstrap.sh
