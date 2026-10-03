param([string]$Pptx,[string]$OutDir)
$ErrorActionPreference='Stop'; $Pptx=(Resolve-Path $Pptx).Path
New-Item -ItemType Directory -Force $OutDir|Out-Null; $OutDir=(Resolve-Path $OutDir).Path
$pp=New-Object -ComObject PowerPoint.Application
$d=$pp.Presentations.Open($Pptx,$true,$false,$false)
$i=1; foreach($sl in $d.Slides){ $n='{0:D2}' -f $i; $sl.Export((Join-Path $OutDir "p-$n.png"),"PNG",850,1100); $i++ }
# also save a PDF (format 32 = ppSaveAsPDF) preserving portrait size
$d.SaveAs(($Pptx -replace '\.pptx$','.pdf'),32)
$d.Close();$pp.Quit(); Write-Host "ok"
