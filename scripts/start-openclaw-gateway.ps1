# Avvio gateway OpenClaw + Ollama (Windows)
# Uso: .\scripts\start-openclaw-gateway.ps1
# Oppure: npm run openclaw:start

$ErrorActionPreference = "Stop"
$projRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

$env:OLLAMA_API_KEY = "ollama-local"
# OpenClaw registra Ollama solo se questa variabile (o models.providers.ollama.apiKey) è impostata — non è un login web.

Write-Host ""
Write-Host "=== OpenClaw gateway ===" -ForegroundColor Cyan
Write-Host "Progetto: $projRoot"
Write-Host ""

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  Write-Host "ERRORE: ollama non nel PATH. Installa da https://ollama.com/download" -ForegroundColor Red
  exit 1
}

$ollamaProc = Get-Process ollama -ErrorAction SilentlyContinue
if (-not $ollamaProc) {
  Write-Host "Avvio Ollama (serve)..." -ForegroundColor Yellow
  Start-Process -FilePath "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe" -ArgumentList "serve" -WindowStyle Hidden
  Start-Sleep -Seconds 2
}

Write-Host "Collegare la chat dal TELEFONO (WhatsApp):" -ForegroundColor Green
Write-Host "  1) Apri WhatsApp sullo STESSO account collegato al PC (sessione OpenClaw)."
Write-Host "  2) Opzione A - Messaggi a te stesso: tasto Nuova chat -> 'Messaggio a te stesso' (o cerca il tuo numero)."
Write-Host "  3) Opzione B - Altra chat: apri una chat DIRETTA con un contatto (NON gruppo; i gruppi sono disattivati in config)."
Write-Host "  4) Scrivi un messaggio di prova, es: Ciao OpenClaw"
Write-Host "  5) Se compare richiesta PAIRING: sul PC esegui:"
Write-Host "       npx openclaw@latest pairing list whatsapp"
Write-Host "       npx openclaw@latest pairing approve whatsapp <CODICE>"
Write-Host ""
Write-Host "Gateway in ascolto (Ctrl+C per uscire)..." -ForegroundColor Cyan
Write-Host ""

Set-Location $projRoot
npx openclaw@latest gateway
