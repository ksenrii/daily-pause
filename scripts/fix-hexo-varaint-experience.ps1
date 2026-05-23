param(
  [string]$BlogRoot = "D:\blog\hexo-blog"
)

$ErrorActionPreference = "Stop"

function Assert-UnderPath {
  param(
    [string]$Path,
    [string]$Parent
  )

  $resolvedPath = (Resolve-Path -LiteralPath $Path).Path
  $resolvedParent = (Resolve-Path -LiteralPath $Parent).Path

  if (-not $resolvedPath.StartsWith($resolvedParent, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to touch unexpected path: $resolvedPath"
  }

  return $resolvedPath
}

function Set-FileUtf8 {
  param(
    [string]$Path,
    [string]$Value
  )

  Set-Content -LiteralPath $Path -Value $Value -Encoding UTF8
}

$blogRootResolved = (Resolve-Path -LiteralPath $BlogRoot).Path
$themeRoot = Join-Path $blogRootResolved "themes\varaint"
$hexoScripts = Join-Path $blogRootResolved "scripts"

if (-not (Test-Path -LiteralPath $themeRoot)) {
  throw "varaint theme not found: $themeRoot"
}

New-Item -ItemType Directory -Force -Path $hexoScripts | Out-Null

$headerPath = Join-Path $themeRoot "layout\_partial\header.ejs"
$bannerPath = Join-Path $themeRoot "layout\_partial\banner.ejs"
$footerPath = Join-Path $themeRoot "layout\_partial\footer.ejs"
$scriptPath = Join-Path $themeRoot "source\js\script.js"
$bannerDir = Join-Path $themeRoot "source\banner"

Assert-UnderPath $headerPath $themeRoot | Out-Null
Assert-UnderPath $bannerPath $themeRoot | Out-Null
Assert-UnderPath $footerPath $themeRoot | Out-Null
Assert-UnderPath $scriptPath $themeRoot | Out-Null
Assert-UnderPath $bannerDir $themeRoot | Out-Null

$headerContent = @'
<header>
	<%if(theme.search.enable){%>
		<%- partial('search')%>
	<%}%>

	<%if(theme.sidebar.enable){%>
		<%- partial('sidebar')%>
	<%}%>
</header>
'@
Set-FileUtf8 $headerPath $headerContent

$bannerContent = @'
<div class="m-header ">
	<section id="hero1" class="hero">
		<div class="inner">
		</div>
	</section>
	<%if(post.banner){%>
		<figure class="top-image" style='background-image: url(<%=post.banner%>)' data-enable=false></figure>
	<%} else {%>
		<figure class="top-image" style='background-image: url(/banner/4.jpg)' data-enable=false></figure>
	<%}%>
</div>
'@
Set-FileUtf8 $bannerPath $bannerContent

$themeScript = Get-Content -LiteralPath $scriptPath -Raw -Encoding UTF8
$themeScript = [regex]::Replace(
  $themeScript,
  "(\s*)var bannerNode = \$\('\.top-image'\);\s*if\(bannerNode\.data\('enable'\)\)\{\s*var index = parseInt\(\(Math\.random\(\) \* 4\) \+ 1\);\s*bannerNode\.attr\('style','background-image:url\(/banner/'\+index\+'\.jpg\)'\);\s*\}",
  "`$1var bannerNode = $('.top-image');`r`$1if (bannerNode.data('enable') && !bannerNode.attr('style')) {`r`$1    bannerNode.attr('style', 'background-image:url(/banner/4.jpg)');`r`$1}"
)
Set-FileUtf8 $scriptPath $themeScript

foreach ($name in @("1.jpg", "2.jpg", "3.jpg")) {
  $path = Join-Path $bannerDir $name
  if (Test-Path -LiteralPath $path) {
    $resolved = Assert-UnderPath $path $bannerDir
    Remove-Item -LiteralPath $resolved -Force
  }
}

$footerContent = Get-Content -LiteralPath $footerPath -Raw -Encoding UTF8
$footerContent = $footerContent -replace "(?m)^\s*<%- js\('js/google-code-prettify/prettify'\) %>\s*\r?\n", ""
$footerContent = [regex]::Replace(
  $footerContent,
  "\s*<script type='text/javascript'>\s*//.*?prettyPrint\(\);\s*\}\);\s*</script>",
  "",
  [System.Text.RegularExpressions.RegexOptions]::Singleline
)
Set-FileUtf8 $footerPath $footerContent

$enhancementScript = @'
"use strict";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function protectMathInSegment(segment) {
  return segment
    .replace(/\$\$([\s\S]*?)\$\$/g, function (_, tex) {
      return "\n\n<div class=\"math-display\">\\[\n" + escapeHtml(tex.trim()) + "\n\\]</div>\n\n";
    })
    .replace(/\\\[([\s\S]*?)\\\]/g, function (_, tex) {
      return "\n\n<div class=\"math-display\">\\[\n" + escapeHtml(tex.trim()) + "\n\\]</div>\n\n";
    })
    .replace(/(^|[^\$])\$([^\n$]+?)\$([^\$]|$)/g, function (_, before, tex, after) {
      return before + "<span class=\"math-inline\">\\(" + escapeHtml(tex.trim()) + "\\)</span>" + after;
    });
}

function protectMath(content) {
  var fences = [];
  var fencedPattern = /(```[\s\S]*?```|~~~[\s\S]*?~~~)/g;

  content = content.replace(fencedPattern, function (match) {
    var token = "\u0000FENCE" + fences.length + "\u0000";
    fences.push(match);
    return token;
  });

  content = protectMathInSegment(content);

  fences.forEach(function (fence, index) {
    content = content.replace("\u0000FENCE" + index + "\u0000", fence);
  });

  return content;
}

hexo.extend.filter.register("before_post_render", function (data) {
  if (data && typeof data.content === "string") {
    data.content = protectMath(data.content);
  }
  return data;
});

hexo.extend.injector.register("head_end", function () {
  return `
<script>
window.MathJax = {
  tex: {
    inlineMath: [["\\\\(", "\\\\)"]],
    displayMath: [["\\\\[", "\\\\]"]],
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
.post-body .math-display {
  margin: 1.25rem 0;
  overflow-x: auto;
  overflow-y: hidden;
}
.post-body mjx-container {
  max-width: 100%;
}
.post-body mjx-container[display="true"] {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.35rem 0;
}
.post-body mjx-container svg {
  max-width: none;
}

.post-body figure.highlight {
  position: relative;
  margin: 1.6rem 0;
  overflow: hidden;
  border-radius: 8px;
  background: #1f2329;
  box-shadow: 0 12px 34px rgba(17, 24, 39, 0.16);
}
.post-body figure.highlight table {
  display: block;
  width: 100%;
  margin: 0;
  border: 0;
  overflow-x: auto;
  border-collapse: collapse;
  background: #282c34;
}
.post-body figure.highlight tbody,
.post-body figure.highlight tr {
  display: table;
  width: 100%;
}
.post-body figure.highlight td {
  border: 0;
  padding: 0;
  vertical-align: top;
}
.post-body figure.highlight .gutter {
  width: 3.7rem;
  min-width: 3.7rem;
  user-select: none;
  background: #21252b;
  color: #6b7280;
  text-align: right;
}
.post-body figure.highlight .code {
  width: 100%;
  background: #282c34;
}
.post-body figure.highlight pre {
  margin: 0;
  padding: 1rem 1.1rem;
  overflow: visible !important;
  color: #abb2bf;
  font-family: Consolas, Monaco, "Cascadia Code", "Fira Code", monospace;
  font-size: 14px;
  line-height: 1.65;
}
.post-body figure.highlight .code pre {
  min-width: max-content;
}
.post-body figure.highlight .line {
  min-height: 1.65em;
}
.post-body figure.highlight .keyword,
.post-body figure.highlight .type {
  color: #c678dd;
}
.post-body figure.highlight .string {
  color: #98c379;
}
.post-body figure.highlight .number,
.post-body figure.highlight .literal {
  color: #d19a66;
}
.post-body figure.highlight .comment {
  color: #7f848e;
}
.post-body figure.highlight .meta,
.post-body figure.highlight .built_in,
.post-body figure.highlight .function .title {
  color: #61afef;
}
.code-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 2.4rem;
  padding: 0 0.75rem 0 1rem;
  background: #1b1f27;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #9ca3af;
  font-size: 12px;
  letter-spacing: 0.04em;
}
.code-copy-button {
  border: 0;
  border-radius: 6px;
  padding: 0.32rem 0.65rem;
  background: rgba(255, 255, 255, 0.08);
  color: #d1d5db;
  cursor: pointer;
  transition: background 0.16s ease, color 0.16s ease;
}
.code-copy-button:hover {
  background: #35bfab;
  color: #111827;
}

article {
  position: relative;
}
.post-toc {
  position: fixed;
  top: 128px;
  right: max(24px, calc((100vw - 1180px) / 2));
  width: 235px;
  max-height: calc(100vh - 160px);
  overflow: auto;
  padding: 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 10px 34px rgba(17, 24, 39, 0.10);
  backdrop-filter: blur(12px);
  z-index: 1;
}
.post-toc-title {
  margin-bottom: 0.7rem;
  color: #334f52;
  font-weight: 600;
}
.post-toc a {
  display: block;
  padding: 0.32rem 0.45rem;
  border-left: 2px solid transparent;
  border-radius: 4px;
  color: #666;
  font-size: 13px;
  line-height: 1.5;
  text-decoration: none;
}
.post-toc a.level-3 {
  padding-left: 1.05rem;
}
.post-toc a.level-4 {
  padding-left: 1.65rem;
}
.post-toc a.is-active,
.post-toc a:hover {
  border-left-color: #35bfab;
  background: rgba(53, 191, 171, 0.12);
  color: #243b3d;
}
@media screen and (max-width: 1180px) {
  .post-toc {
    position: static;
    width: auto;
    max-height: none;
    margin: 0 0 1.6rem;
  }
}
</style>`;
});

hexo.extend.injector.register("body_end", function () {
  return `
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
<script>
(function () {
  function getCodeText(block) {
    var code = block.querySelector(".code pre") || block.querySelector("pre");
    return code ? code.innerText.replace(/\\n$/, "") : "";
  }

  document.querySelectorAll(".post-body figure.highlight").forEach(function (block) {
    if (block.querySelector(".code-toolbar")) return;

    var language = Array.from(block.classList).filter(function (name) {
      return name !== "highlight";
    })[0] || "code";

    var toolbar = document.createElement("div");
    toolbar.className = "code-toolbar";
    toolbar.innerHTML = "<span>" + language.toUpperCase() + "</span><button class=\\"code-copy-button\\" type=\\"button\\">复制</button>";
    block.insertBefore(toolbar, block.firstChild);

    toolbar.querySelector("button").addEventListener("click", function () {
      var button = this;
      var text = getCodeText(block);
      var copied = function () {
        button.textContent = "已复制";
        setTimeout(function () {
          button.textContent = "复制";
        }, 1500);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(copied);
      } else {
        var textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
        copied();
      }
    });
  });

  var article = document.querySelector("article");
  var body = article && article.querySelector(".post-body");
  if (!article || !body || article.querySelector(".post-toc")) return;

  var headings = Array.from(body.querySelectorAll("h2, h3, h4")).filter(function (heading) {
    return heading.textContent.trim().length > 0;
  });
  if (headings.length < 2) return;

  var nav = document.createElement("aside");
  nav.className = "post-toc";
  nav.innerHTML = '<div class="post-toc-title">目录</div>';

  headings.forEach(function (heading, index) {
    if (!heading.id) {
      heading.id = "toc-heading-" + index;
    }
    var link = document.createElement("a");
    link.href = "#" + encodeURIComponent(heading.id);
    link.className = "level-" + heading.tagName.slice(1);
    link.textContent = heading.textContent.trim();
    nav.appendChild(link);
  });

  article.insertBefore(nav, body);

  var links = Array.from(nav.querySelectorAll("a"));
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (link) {
        link.classList.toggle("is-active", decodeURIComponent(link.hash.slice(1)) === entry.target.id);
      });
    });
  }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });

  headings.forEach(function (heading) {
    observer.observe(heading);
  });
})();
</script>`;
});
'@

Set-FileUtf8 (Join-Path $hexoScripts "mathjax.js") $enhancementScript

Write-Host "Updated varaint header, fixed banner, removed unused banner images, protected MathJax, and added code copy + TOC."
Write-Host "Next:"
Write-Host "  cd `"$blogRootResolved`""
Write-Host "  npm run clean"
Write-Host "  npm run build"
Write-Host "  npm run server"
