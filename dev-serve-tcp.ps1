param(
  [string]$Root = (Get-Location).Path,
  [int]$Port = 8080
)

Add-Type -AssemblyName System.Net
# System.Text is part of the base runtime; explicit Add-Type is unnecessary

if (-not (Test-Path $Root)) { Write-Error "Root path not found: $Root"; exit 1 }

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
try { $listener.Start() } catch { Write-Error "Cannot start TCP server on port $Port. $_"; exit 1 }
Write-Host "TCP static server running at http://localhost:$Port/"

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
  if ((Test-Path $candidate) -and (Get-Item $candidate).PSIsContainer) { $candidate = Join-Path $candidate "index.html" }
  return $candidate
}

while ($true) {
  $client = $listener.AcceptTcpClient()
  Start-Job -ArgumentList $client,$Root -ScriptBlock {
    param($client,$Root)
    try {
      $stream = $client.GetStream()
      $reader = New-Object System.IO.StreamReader($stream)
      $writer = New-Object System.IO.StreamWriter($stream)
      $writer.AutoFlush = $true
      $requestLine = $reader.ReadLine()
      if (-not $requestLine) { $client.Close(); return }
      # e.g. GET /public/dashboard.html HTTP/1.1
      $parts = $requestLine.Split(' ')
      $method = $parts[0]
      $path = $parts[1]
      if ($method -ne 'GET') { $writer.Write("HTTP/1.1 405 Method Not Allowed`r`n`r`n"); $client.Close(); return }
      $local = Get-LocalPath $path
      if (-not (Test-Path $local)) { $writer.Write("HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: 9`r`n`r`nNot Found"); $client.Close(); return }
      $bytes = [System.IO.File]::ReadAllBytes($local)
      $ext = [System.IO.Path]::GetExtension($local).ToLower()
      $ctype = $mime[$ext]; if (-not $ctype) { $ctype = "application/octet-stream" }
      $headers = "HTTP/1.1 200 OK`r`nContent-Type: $ctype`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
      $hdrBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
      $stream.Write($hdrBytes,0,$hdrBytes.Length)
      $stream.Write($bytes,0,$bytes.Length)
      $client.Close()
    } catch { try { $client.Close() } catch {} }
  } | Out-Null
}