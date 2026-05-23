param(
  [string]$BlogRoot = "D:\blog\hexo-blog"
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$DistRoot = Join-Path $ProjectRoot "dist"
$TargetRoot = Join-Path $BlogRoot "source\daily-pause"
$HexoConfig = Join-Path $BlogRoot "_config.yml"

if (-not (Test-Path -LiteralPath $DistRoot)) {
  throw "dist folder not found. Run npm.cmd run build first."
}

if (-not (Test-Path -LiteralPath $HexoConfig)) {
  throw "Hexo config not found: $HexoConfig"
}

$ResolvedBlogRoot = (Resolve-Path -LiteralPath $BlogRoot).Path
$ExpectedTargetPrefix = Join-Path $ResolvedBlogRoot "source\daily-pause"

if (Test-Path -LiteralPath $TargetRoot) {
  $ResolvedTarget = (Resolve-Path -LiteralPath $TargetRoot).Path
  if (-not $ResolvedTarget.StartsWith($ExpectedTargetPrefix)) {
    throw "Refusing to remove unexpected target: $ResolvedTarget"
  }

  Remove-Item -LiteralPath $ResolvedTarget -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $TargetRoot | Out-Null
Copy-Item -Path (Join-Path $DistRoot "*") -Destination $TargetRoot -Recurse -Force

$HexoText = Get-Content -LiteralPath $HexoConfig -Raw -Encoding UTF8
if ($HexoText -notmatch "daily-pause/\*\*") {
  if ($HexoText -match "(?m)^skip_render:\s*$") {
    $HexoText = $HexoText -replace "(?m)^skip_render:\s*$", "skip_render:`r`n  - daily-pause/**"
  } else {
    $HexoText += "`r`nskip_render:`r`n  - daily-pause/**`r`n"
  }

  Set-Content -LiteralPath $HexoConfig -Value $HexoText -Encoding UTF8
}

Write-Host "Daily Pause has been copied to: $TargetRoot"
Write-Host "Visit locally after hexo generate/server: /daily-pause/"
