$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8081/")
$listener.Start()
Write-Host "Listening on 8081..."
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $ctx.Response.StatusCode = 200
    $bytes = [System.Text.Encoding]::UTF8.GetBytes("Hello")
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $ctx.Response.Close()
}
