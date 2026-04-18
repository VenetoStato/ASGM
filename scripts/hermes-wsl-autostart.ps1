# Dopo il login Windows: avvia la distro WSL (systemd) e tiene su hermes-gateway.
# Telegram non "sveglia" il PC: senza questo, WSL puo' restare fermo e il bot non risponde.
#
# Uso (una tantum, come utente Windows) — consigliato: collegamento in Avvio:
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hermes-wsl-autostart.ps1 -Register
#
# Alternativa (Utilita' di pianificazione; puo' richiedere permessi in piu'):
#   ... -Register -UseScheduledTask
#
# Test manuale:
#   .\scripts\hermes-wsl-autostart.ps1
#
# Rimuovi l'avvio automatico:
#   .\scripts\hermes-wsl-autostart.ps1 -Unregister

param(
  [string]$Distro = "Ubuntu-24.04",
  [switch]$Register,
  [switch]$Unregister,
  [switch]$UseScheduledTask
)

$ErrorActionPreference = "Stop"
$taskName = "Hermes Wsl Gateway"
$startupLnkName = "Hermes Wsl Gateway.lnk"
$scriptPath = $PSCommandPath
if (-not $scriptPath) { $scriptPath = (Join-Path $PSScriptRoot "hermes-wsl-autostart.ps1") }

function Test-Distro {
  $raw = wsl -l -q 2>$null
  $installed = if ($raw) {
    @($raw -split "`r?`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ })
  } else { @() }
  if ($installed -notcontains $Distro) {
    Write-Host "Distro WSL '$Distro' non trovata. Installate:" -ForegroundColor Red
    wsl -l -v
    exit 1
  }
}

if ($Unregister) {
  $removed = $false
  $startupDir = [Environment]::GetFolderPath("Startup")
  $lnk = Join-Path $startupDir $startupLnkName
  if (Test-Path $lnk) {
    Remove-Item -LiteralPath $lnk -Force
    Write-Host "Rimosso collegamento Avvio: $lnk"
    $removed = $true
  }
  $existing = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
  if ($existing) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Host "Rimosso task pianificato: $taskName"
    $removed = $true
  }
  if (-not $removed) {
    Write-Host "Nessun avvio automatico Hermes da rimuovere."
  }
  exit 0
}

if ($Register) {
  Test-Distro
  $abs = (Resolve-Path $scriptPath).Path
  $arg = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$abs`" -Distro `"$Distro`""

  if ($UseScheduledTask) {
    $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $arg
    $trigger = New-ScheduledTaskTrigger -AtLogOn
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Hours 0)
    $principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force `
      -Description "Avvia WSL $Distro cosi systemd puo' eseguire hermes-gateway."
    Write-Host "Registrato task Windows: $taskName (al login)." -ForegroundColor Green
  } else {
    $startupDir = [Environment]::GetFolderPath("Startup")
    $lnk = Join-Path $startupDir $startupLnkName
    $w = New-Object -ComObject WScript.Shell
    $s = $w.CreateShortcut($lnk)
    $s.TargetPath = "powershell.exe"
    $s.Arguments = $arg
    $s.WorkingDirectory = (Split-Path -Parent $abs)
    $s.WindowStyle = 7
    $s.Description = "Avvia WSL $Distro e hermes-gateway dopo il login."
    $s.Save()
    Write-Host "Creato collegamento in Avvio: $lnk" -ForegroundColor Green
  }
  Write-Host "Al prossimo riavvio / login il bot sara' pronto senza aprire Telegram o Ubuntu a mano."
  exit 0
}

# --- Esecuzione normale (chiamata dal task o a mano) ---
Test-Distro

$deadline = (Get-Date).AddMinutes(2)
$ok = $false
while ((Get-Date) -lt $deadline) {
  $out = wsl -d $Distro -u root -- systemctl start hermes-gateway 2>&1
  $st = (wsl -d $Distro -u root -- systemctl is-active hermes-gateway 2>&1 | Out-String).Trim()
  if ($st -eq "active") {
    $ok = $true
    break
  }
  Start-Sleep -Seconds 2
}

if (-not $ok) {
  Write-Host "hermes-gateway non risulta active dopo i tentativi. Ultimo stato: $st" -ForegroundColor Red
  if ($out) { Write-Host $out }
  exit 1
}

exit 0
