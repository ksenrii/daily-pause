param(
  [string]$BlogRoot = "D:\blog\hexo-blog"
)

$ErrorActionPreference = "Stop"

function Update-OrAppendTheme($configPath) {
  $text = Get-Content -LiteralPath $configPath -Raw -Encoding UTF8

  if ($text -match "(?m)^theme:\s*.+$") {
    $text = $text -replace "(?m)^theme:\s*.+$", "theme: varaint"
  } else {
    $text += "`r`ntheme: varaint`r`n"
  }

  if ($text -notmatch "daily-pause/\*\*") {
    if ($text -match "(?m)^skip_render:\s*$") {
      $text = $text -replace "(?m)^skip_render:\s*$", "skip_render:`r`n  - daily-pause/**"
    } else {
      $text += "`r`nskip_render:`r`n  - daily-pause/**`r`n"
    }
  }

  Set-Content -LiteralPath $configPath -Value $text -Encoding UTF8
}

function Update-HexoHighlightSettings($configPath) {
  $text = Get-Content -LiteralPath $configPath -Raw -Encoding UTF8

  $text = [regex]::Replace($text, "(?m)^(\s*)enable:\s*true\s*$", {
    param($match)
    $before = $text.Substring(0, $match.Index)
    $lastHighlight = $before.LastIndexOf("highlight:")
    $lastPrism = $before.LastIndexOf("prismjs:")
    $nextTopLevel = $before.LastIndexOf("`n#")

    if ($lastHighlight -gt $nextTopLevel -or $lastPrism -gt $nextTopLevel) {
      return "$($match.Groups[1].Value)enable: false"
    }

    return $match.Value
  })

  Set-Content -LiteralPath $configPath -Value $text -Encoding UTF8
}

function Write-VaraintConfig($blogRoot) {
  $configPath = Join-Path $blogRoot "_config.varaint.yml"

  if (-not (Test-Path -LiteralPath $configPath)) {
    $configText = @'
count:
  enable: false

comments: {}

sidebar:
  enable: true
  menus:
    -
      name: Daily Pause
      link: /daily-pause/
      target: _self
    -
      name: GitHub
      link: https://github.com/ksenrii
      target: _blank

social:
  -
    name: GitHub
    link: https://github.com/ksenrii
'@

    Set-Content -LiteralPath $configPath -Value $configText -Encoding UTF8
    return
  }

  $text = Get-Content -LiteralPath $configPath -Raw -Encoding UTF8
  if ($text -match "daily-pause") {
    return
  }

  if ($text -match "(?m)^(\s*)menus:\s*$") {
    $indent = $Matches[1]
    $dailyPauseMenu = @"
$indent  -
$indent    name: Daily Pause
$indent    link: /daily-pause/
$indent    target: _self
"@
    $text = $text -replace "(?m)^(\s*)menus:\s*$", "`${0}`r`n$dailyPauseMenu"
  } else {
    $text += @'

sidebar:
  enable: true
  menus:
    -
      name: Daily Pause
      link: /daily-pause/
      target: _self
'@
  }

  Set-Content -LiteralPath $configPath -Value $text -Encoding UTF8
}

function Write-MathJaxInjector($blogRoot) {
  $scriptsDir = Join-Path $blogRoot "scripts"
  New-Item -ItemType Directory -Force -Path $scriptsDir | Out-Null

  $mathJaxScript = @'
"use strict";

hexo.extend.injector.register("head_end", function () {
  return `
<script>
window.MathJax = {
  tex: {
    inlineMath: [["$", "$"], ["\\\\(", "\\\\)"]],
    displayMath: [["$$", "$$"], ["\\\\[", "\\\\]"]],
    processEscapes: true,
    processEnvironments: true,
    tags: "ams"
  },
  options: {
    skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"]
  },
  chtml: {
    scale: 1,
    matchFontHeight: false
  }
};
</script>
<style>
.post-body mjx-container,
.article-entry mjx-container,
article mjx-container {
  max-width: 100%;
}
.post-body mjx-container[display="true"],
.article-entry mjx-container[display="true"],
article mjx-container[display="true"] {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.45rem 0;
}
.post-body mjx-container svg,
.article-entry mjx-container svg,
article mjx-container svg {
  max-width: none;
}
</style>`;
});

hexo.extend.injector.register("body_end", function () {
  return '<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>';
});
'@

  Set-Content -LiteralPath (Join-Path $scriptsDir "mathjax.js") -Value $mathJaxScript -Encoding UTF8
}

function Ensure-VaraintTheme($blogRoot) {
  $themesDir = Join-Path $blogRoot "themes"
  $themeDir = Join-Path $themesDir "varaint"

  if (Test-Path -LiteralPath $themeDir) {
    Write-Host "Theme already exists: $themeDir"
    return
  }

  New-Item -ItemType Directory -Force -Path $themesDir | Out-Null

  $candidateRepos = @(
    @{
      Git = "https://github.com/akarineren/hexo-theme-varaint.git"
      Zip = @(
        "https://codeload.github.com/akarineren/hexo-theme-varaint/zip/refs/heads/main",
        "https://codeload.github.com/akarineren/hexo-theme-varaint/zip/refs/heads/master"
      )
    },
    @{
      Git = "https://github.com/yumexupanic/hexo-theme-varaint.git"
      Zip = @(
        "https://codeload.github.com/yumexupanic/hexo-theme-varaint/zip/refs/heads/main",
        "https://codeload.github.com/yumexupanic/hexo-theme-varaint/zip/refs/heads/master"
      )
    }
  )

  foreach ($candidate in $candidateRepos) {
    try {
      $repo = $candidate.Git
      Write-Host "Trying: $repo"
      git clone --depth 1 $repo $themeDir
      if (Test-Path -LiteralPath $themeDir) {
        Write-Host "Theme installed from $repo"
        return
      }
    } catch {
      if (Test-Path -LiteralPath $themeDir) {
        Remove-Item -LiteralPath $themeDir -Recurse -Force
      }
      Write-Warning "Failed: $repo"
    }

    foreach ($zipUrl in $candidate.Zip) {
      $zipPath = Join-Path ([System.IO.Path]::GetTempPath()) ("hexo-theme-varaint-" + [Guid]::NewGuid().ToString("N") + ".zip")
      $extractRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("hexo-theme-varaint-" + [Guid]::NewGuid().ToString("N"))

      try {
        Write-Host "Trying zip: $zipUrl"
        Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath
        Expand-Archive -LiteralPath $zipPath -DestinationPath $extractRoot -Force

        $expandedDir = Get-ChildItem -LiteralPath $extractRoot -Directory | Select-Object -First 1
        if (-not $expandedDir) {
          throw "Downloaded zip did not contain a theme directory."
        }

        Move-Item -LiteralPath $expandedDir.FullName -Destination $themeDir
        Write-Host "Theme installed from $zipUrl"
        return
      } catch {
        if (Test-Path -LiteralPath $themeDir) {
          Remove-Item -LiteralPath $themeDir -Recurse -Force
        }
        Write-Warning "Failed: $zipUrl"
      } finally {
        if (Test-Path -LiteralPath $zipPath) {
          Remove-Item -LiteralPath $zipPath -Force
        }
        if (Test-Path -LiteralPath $extractRoot) {
          Remove-Item -LiteralPath $extractRoot -Recurse -Force
        }
      }
    }
  }

  throw "Could not clone hexo-theme-varaint. Check the repository URL or network access."
}

$blogRootResolved = (Resolve-Path -LiteralPath $BlogRoot).Path
$hexoConfig = Join-Path $blogRootResolved "_config.yml"

if (-not (Test-Path -LiteralPath $hexoConfig)) {
  throw "Hexo _config.yml not found under $blogRootResolved"
}

Ensure-VaraintTheme $blogRootResolved
Update-OrAppendTheme $hexoConfig
Update-HexoHighlightSettings $hexoConfig
Write-VaraintConfig $blogRootResolved
Write-MathJaxInjector $blogRootResolved

Write-Host ""
Write-Host "Done."
Write-Host "Theme: varaint"
Write-Host "Theme config: _config.varaint.yml"
Write-Host "MathJax injector: scripts/mathjax.js"
Write-Host ""
Write-Host "Next commands:"
Write-Host "  cd `"$blogRootResolved`""
Write-Host "  npm run clean"
Write-Host "  npm run build"
Write-Host "  npm run server"
