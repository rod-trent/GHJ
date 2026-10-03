param([string]$Pptx, [string]$OutDir)
$ErrorActionPreference='Stop'
$Pptx=(Resolve-Path $Pptx).Path
New-Item -ItemType Directory -Force $OutDir | Out-Null
$OutDir=(Resolve-Path $OutDir).Path
$pp=New-Object -ComObject PowerPoint.Application
$d=$pp.Presentations.Open($Pptx,$true,$false,$false)
$i=1
foreach($sl in $d.Slides){ $n='{0:D2}' -f $i; $sl.Export((Join-Path $OutDir "slide-$n.png"),"PNG",1280,720); $i++ }
$d.Close(); $pp.Quit()
Write-Host "exported $($i-1) slides to $OutDir"
