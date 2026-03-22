# Finestra dedicata: QR WhatsApp per account OpenClaw "secondario"
Set-Location $PSScriptRoot\..
Write-Host "Collega WhatsApp (account secondario) — inquadra il QR." -ForegroundColor Cyan
npx openclaw@latest channels login --channel whatsapp --account secondario
