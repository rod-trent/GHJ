param([string]$Pptx,[string]$OutPdf)
$ErrorActionPreference='Stop'
$Pptx=(Resolve-Path $Pptx).Path
$pp=New-Object -ComObject PowerPoint.Application
$d=$pp.Presentations.Open($Pptx,$true,$false,$false)
# 2 = ppPrintOutputNotesPages
$d.ExportAsFixedFormat($OutPdf,2,$false,1,2,0,$false,$false,$false,$false,$false)
$d.Close();$pp.Quit()
Write-Host "wrote $OutPdf"
