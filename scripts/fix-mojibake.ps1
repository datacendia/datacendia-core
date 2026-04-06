$enc1252 = [System.Text.Encoding]::GetEncoding(1252)
$utf8enc = [System.Text.Encoding]::UTF8
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

function Fix-Mojibake($content) {
    $result = New-Object System.Text.StringBuilder($content.Length)
    $i = 0
    while ($i -lt $content.Length) {
        $code = [int]$content[$i]
        if ($code -ge 0xC0 -and $code -le 0xFF) {
            $seqLen = 0
            if ($code -ge 0xF0) { $seqLen = 4 }
            elseif ($code -ge 0xE0) { $seqLen = 3 }
            elseif ($code -ge 0xC0) { $seqLen = 2 }
            
            $valid = $true
            if ($i + $seqLen -gt $content.Length) { $valid = $false }
            else {
                for ($j = 1; $j -lt $seqLen; $j++) {
                    $fc = [int]$content[$i + $j]
                    if ($fc -lt 0x80 -or $fc -gt 0xBF) { $valid = $false; break }
                }
            }
            
            if ($valid -and $seqLen -gt 1) {
                $chunk = $content.Substring($i, $seqLen)
                $bytes = $enc1252.GetBytes($chunk)
                $decoded = $utf8enc.GetString($bytes)
                if ($decoded.Length -ge 1 -and $decoded.Length -le 2) {
                    [void]$result.Append($decoded)
                    $i += $seqLen
                    continue
                }
            }
        }
        [void]$result.Append($content[$i])
        $i++
    }
    return $result.ToString()
}

$files = @(
    "src\pages\sandbox\configs\nfx.ts",
    "src\pages\sandbox\configs\index-ventures.ts",
    "src\pages\sandbox\configs\general-catalyst.ts"
)

foreach ($f in $files) {
    $path = Join-Path $PSScriptRoot "..\$f"
    $path = (Resolve-Path $path).Path
    $content = [System.IO.File]::ReadAllText($path)
    $before = $content.Length
    $fixed = Fix-Mojibake $content
    [System.IO.File]::WriteAllText($path, $fixed, $utf8NoBom)
    
    # Count remaining mojibake
    $remaining = 0
    foreach ($ch in $fixed.ToCharArray()) {
        $code = [int]$ch
        if ($code -ge 0x80 -and $code -le 0xFF) { $remaining++ }
    }
    Write-Host "$f : $before -> $($fixed.Length) chars, remaining-latin1-supplement: $remaining"
}
Write-Host "Done"
