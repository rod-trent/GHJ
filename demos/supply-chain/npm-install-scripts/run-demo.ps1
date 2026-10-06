<#
  Supply chain demo: the same `npm install`, two different npm versions.
    Act 1 - npm 11: the dependency's postinstall script runs automatically.
    Act 2 - npm 12: install scripts are blocked by default (allowScripts).
  Usage:  ./run-demo.ps1            (run both acts)
          ./run-demo.ps1 -Prep      (pre-cache npm versions for offline use)
#>
param([switch]$Prep)

$ErrorActionPreference = 'Stop'
$here   = $PSScriptRoot
$app    = Join-Path $here 'victim-app'
$Npm11  = 'npm@11.11.0'
$Npm12  = 'npm@12.1.0'

function Invoke-Npm($version, [string[]]$npmArgs) {
  # npm writes warnings/notices to stderr. Windows PowerShell 5.1 turns redirected stderr into
  # terminating errors under ErrorActionPreference=Stop, so relax it for the native call.
  $prev = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    # Filter Node-engine noise so the audience sees only what matters.
    & npx -y --prefer-offline $version @npmArgs 2>&1 |
      ForEach-Object { "$_" } |
      Where-Object { $_ -notmatch 'EBADENGINE|does not support Node|^npm warn EBADENGINE|^\s*(package|required|current):|^\s*}$' }
  }
  finally { $ErrorActionPreference = $prev }
}

function Reset-App {
  Remove-Item -Recurse -Force (Join-Path $app 'node_modules'), (Join-Path $app 'package-lock.json') -ErrorAction SilentlyContinue
  # Remove any allowScripts decisions from a previous run
  $pkg = Get-Content (Join-Path $app 'package.json') -Raw | ConvertFrom-Json
  if ($pkg.PSObject.Properties.Name -contains 'allowScripts') {
    $pkg.PSObject.Properties.Remove('allowScripts')
    $pkg | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $app 'package.json')
  }
}

# Build the "malicious" tarball the victim app depends on
Push-Location (Join-Path $here 'evil-pkg')
$ErrorActionPreference = 'Continue'   # npm pack prints notices on stderr (see Invoke-Npm)
npm pack --pack-destination (Join-Path $app 'vendor') *> $null
$packExit = $LASTEXITCODE
$ErrorActionPreference = 'Stop'
Pop-Location
if ($packExit -ne 0) { throw "npm pack failed (exit $packExit)" }

if ($Prep) {
  Invoke-Npm $Npm11 @('--version') | Out-Null
  Invoke-Npm $Npm12 @('--version') | Out-Null
  Write-Host "Cached $Npm11 and $Npm12 for offline use." -ForegroundColor Green
  return
}

$env:NPM_TOKEN = 'npm_FAKE_DEMO_TOKEN_1234567890'   # fake, for the demo only
Push-Location $app
try {
  Reset-App
  Write-Host "`n=== ACT 1: npm 11 - npm install ===" -ForegroundColor Yellow
  Invoke-Npm $Npm11 @('install', '--foreground-scripts', '--no-audit', '--no-fund')
  Read-Host "`nPress Enter for Act 2"

  Reset-App
  Write-Host "`n=== ACT 2: npm 12 - npm install (same project, same dependency) ===" -ForegroundColor Green
  Invoke-Npm $Npm12 @('install', '--foreground-scripts', '--no-audit', '--no-fund')
  Write-Host "`n=== Review what was blocked ===" -ForegroundColor Green
  Invoke-Npm $Npm12 @('install-scripts', 'ls')
}
finally {
  Pop-Location
  Remove-Item Env:NPM_TOKEN -ErrorAction SilentlyContinue
}
