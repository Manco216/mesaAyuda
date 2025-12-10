param(
  [string]$Root = (Get-Location).Path,
  [int]$Port = 8080
)

Add-Type -AssemblyName System.Net

if (-not (Test-Path $Root)) {
  Write-Error "Root path not found: $Root"
  exit 1
}

$listener = New-Object System.Net.HttpListener
# Intenta registrar ambos prefijos; si 'localhost' está reservado, hará fallback a 127.0.0.1
$prefixes = @("http://127.0.0.1:$Port/", "http://localhost:$Port/")
foreach ($p in $prefixes) { try { $listener.Prefixes.Add($p) } catch { } }
try {
  $listener.Start()
  Write-Host "Static server running at http://127.0.0.1:$Port/ (and localhost if available)"
} catch {
  Write-Warning "Start failed with localhost prefix. Retrying with 127.0.0.1 only. $_"
  $listener = New-Object System.Net.HttpListener
  $only = "http://127.0.0.1:$Port/"
  $listener.Prefixes.Add($only)
  try {
    $listener.Start()
    Write-Host "Static server running at $only"
  } catch {
    Write-Error "Cannot start server on port $Port. $_"
    exit 1
  }
}

$mime = @{ 
  ".html" = "text/html"; ".htm" = "text/html"; ".css" = "text/css"; ".js" = "application/javascript";
  ".json" = "application/json"; ".png" = "image/png"; ".jpg" = "image/jpeg"; ".jpeg" = "image/jpeg"; ".gif" = "image/gif";
  ".svg" = "image/svg+xml"; ".ico" = "image/x-icon"; ".txt" = "text/plain"
}

function Get-LocalPath($urlPath) {
  $rel = $urlPath.TrimStart('/')
  if ([string]::IsNullOrWhiteSpace($rel)) { $rel = "public/index.html" }
  # Pretty-route rewrites
  switch -Regex ($rel) {
    '^(index\.html|public/?$|planning|planificacion)$' { $rel = "public/index.html"; break }
    '^(editar|edit)$' { $rel = "public/editar.html"; break }
    '^dashboard$' { $rel = "public/dashboard.html"; break }
    default { }
  }
  $candidate = Join-Path $Root $rel
  if ((Test-Path $candidate) -and (Get-Item $candidate).PSIsContainer) {
    $candidate = Join-Path $candidate "index.html"
  }
  return $candidate
}

Write-Host "Entering loop. IsListening: $($listener.IsListening)"

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    $path = Get-LocalPath $req.Url.AbsolutePath
    try { Write-Host ("GET {0} -> {1}" -f $req.Url.AbsolutePath, $path) } catch {}
    if (-not (Test-Path $path)) {
      $res.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      $res.Close()
      continue
    }

    $ext = [System.IO.Path]::GetExtension($path).ToLower()
    $ctype = $mime[$ext]
    if (-not $ctype) { $ctype = "application/octet-stream" }

    $buf = [System.IO.File]::ReadAllBytes($path)
    $res.ContentType = $ctype
    $res.ContentLength64 = $buf.Length
    $res.OutputStream.Write($buf, 0, $buf.Length)
    $res.OutputStream.Close()
    $res.Close()
  } catch {
    # Ignore transient errors
    Write-Warning "Error in loop: $_"
    Start-Sleep -Milliseconds 50
  }
}
Write-Host "Exited loop. IsListening: $($listener.IsListening)"