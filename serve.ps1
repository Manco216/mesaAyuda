Param(
  [int]$Port = 8000
)

try { $null = [System.Net.HttpListener] } catch { }
try { $null = [System.IO.File] } catch { }

$listener = New-Object System.Net.HttpListener
# Registrar 127.0.0.1 y localhost si es posible, con fallback
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
  try { $listener.Start(); Write-Host "Static server running at $only" } catch { Write-Error "Cannot start server on port $Port. $_"; exit 1 }
}

function Get-ContentType([string]$ext) {
  switch ($ext.ToLower()) {
    ".html" { return "text/html" }
    ".htm" { return "text/html" }
    ".css" { return "text/css" }
    ".js" { return "application/javascript" }
    ".json" { return "application/json" }
    ".png" { return "image/png" }
    ".jpg" { return "image/jpeg" }
    ".jpeg" { return "image/jpeg" }
    ".svg" { return "image/svg+xml" }
    ".gif" { return "image/gif" }
    default { return "application/octet-stream" }
  }
}

while ($true) {
  try {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    $path = $request.Url.AbsolutePath.TrimStart('/')
    # Pretty-route rewrites to public folder
    if ([string]::IsNullOrWhiteSpace($path)) {
      $path = "public/index.html"
    } else {
      switch -Regex ($path) {
        '^(index(\.html)?|public/?$|planning|planificacion)$' { $path = "public/index.html"; break }
        '^(editar(\.html)?|edit)$' { $path = "public/editar.html"; break }
        '^(dashboard(\.html)?)$' { $path = "public/dashboard.html"; break }
        default { }
      }
    }
    $fullPath = Join-Path -Path (Get-Location) -ChildPath $path
    if (-not (Test-Path $fullPath)) {
      $response.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
      $response.Close()
      continue
    }
    $ext = [System.IO.Path]::GetExtension($fullPath)
    $response.ContentType = Get-ContentType $ext
    $bytes = [System.IO.File]::ReadAllBytes($fullPath)
    $response.ContentLength64 = $bytes.Length
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
    $response.Close()
  } catch {
    try { $response.Close() } catch {}
  }
}
