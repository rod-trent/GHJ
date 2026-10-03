<#
  CodeQL demo, three acts, all local (works offline once the CLI is installed).
    Act 1 - Default security suite: finds XSS + path traversal, MISSES the SQL injection.
    Act 2 - Add one line of models-as-data YAML: the same standard queries now find both SQLi variants.
    Act 3 - Our own QL query (taint tracking) to show what's under the hood.
  Usage: ./run-codeql-demo.ps1 [-CodeQL C:\Code\tools\codeql\codeql.exe] [-SkipBuild]
#>
param(
  [string]$CodeQL = 'C:\Code\tools\codeql\codeql.exe',
  [switch]$SkipBuild
)
$ErrorActionPreference = 'Stop'
$app   = Resolve-Path (Join-Path $PSScriptRoot '..\octo-notes-demo')
$db    = Join-Path $env:TEMP 'octo-notes-codeql-db'
$suite = 'codeql/javascript-queries:codeql-suites/javascript-security-extended.qls'
$ext   = Join-Path $app '.github\codeql\extensions'

function Show-Results($csv) {
  Import-Csv $csv -Header Name,Desc,Severity,Message,Path,StartLine,StartCol,EndLine,EndCol |
    Where-Object Severity -ne 'warning' |
    Format-Table @{n='Finding';e={$_.Name}}, @{n='File';e={$_.Path}}, @{n='Line';e={$_.StartLine}} -AutoSize
}

if (-not $SkipBuild) {
  Write-Host "`n=== Build the CodeQL database (code -> queryable data) ===" -ForegroundColor Cyan
  & $CodeQL database create $db --language=javascript-typescript --source-root=$app --overwrite -q
}

Write-Host "`n=== ACT 1: GitHub's security-extended suite, out of the box ===" -ForegroundColor Yellow
& $CodeQL database analyze $db $suite --format=csv --output="$env:TEMP\act1.csv" -q --rerun
Show-Results "$env:TEMP\act1.csv"
Read-Host "Press Enter for Act 2"

Write-Host "`n=== ACT 2: Same queries + one line of YAML modeling node:sqlite ===" -ForegroundColor Green
Get-Content (Join-Path $ext 'node-sqlite-models\models\node-sqlite.model.yml') | Select-Object -Last 5
& $CodeQL database analyze $db $suite --additional-packs=$ext --model-packs=octo-notes/node-sqlite-models --format=csv --output="$env:TEMP\act2.csv" -q --rerun
Show-Results "$env:TEMP\act2.csv"
Read-Host "Press Enter for Act 3"

Write-Host "`n=== ACT 3: Our own taint-tracking query ===" -ForegroundColor Magenta
Push-Location (Join-Path $PSScriptRoot 'queries')
& $CodeQL pack install -q 2>&1 | Out-Null
& $CodeQL database analyze $db 2-SqliteInjection.ql --format=csv --output="$env:TEMP\act3.csv" -q --rerun
Pop-Location
Show-Results "$env:TEMP\act3.csv"
