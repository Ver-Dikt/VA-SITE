$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$missing = @()
$paths = @(
  "index.html",
  "src/styles.css",
  "src/app.js",
  "src/content.js",
  "assets/pdf/VA PRESS KIT RU small size.pdf",
  "assets/pdf/press-photos.zip",
  "assets/audio/time-is-frozen.mp3",
  "assets/audio/haunted.mp3",
  "assets/audio/i-need-you.mp3",
  "assets/audio/proof.mp3",
  "assets/audio/get.mp3",
  "assets/press/image-p01-02.jpeg",
  "assets/press/image-p02-01.jpeg",
  "assets/press/image-p03-01.jpeg",
  "assets/press/image-p04-02.jpeg",
  "assets/press/image-p05-01.jpeg",
  "assets/press/image-p06-01.jpeg",
  "assets/press/image-p07-02.jpeg",
  "assets/press/image-p08-02.jpeg"
)

foreach ($path in $paths) {
  $full = Join-Path $root $path
  if (-not (Test-Path -LiteralPath $full)) {
    $missing += $path
  }
}

if ($missing.Count -gt 0) {
  $missing | ForEach-Object { Write-Error "Missing file: $_" }
  exit 1
}

Write-Host "Static asset check passed"
