#Requires -RunAsAdministrator
# Riavvio servizi MSI RGB dopo freeze / regressioni Mystic Light.
$ErrorActionPreference = "Stop"
Write-Host "Arresto processi MSI Center / Mystic Light (UI)..." -ForegroundColor Cyan
$names = @(
  "MSI.CentralServer", "MSI.TerminalServer", "MSI.ToastServer", "MSI.NotifyServer",
  "DCv2"
)
foreach ($n in $names) {
  Get-Process -Name $n -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
}
Start-Sleep -Seconds 2

Write-Host "Riavvio servizi Mystic Light / MSI Center / Case..." -ForegroundColor Cyan
Restart-Service -Name Mystic_Light_Service, MSI_Center_Service, MSI_Case_Service -Force

Get-Service Mystic_Light_Service, MSI_Center_Service, MSI_Case_Service |
  Format-Table Name, Status, StartType -AutoSize

Write-Host "Fatto. Apri MSI Center e riprova Mystic Light." -ForegroundColor Green
