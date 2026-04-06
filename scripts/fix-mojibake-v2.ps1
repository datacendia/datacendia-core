$enc1252 = [System.Text.Encoding]::GetEncoding(1252)
$utf8enc = [System.Text.Encoding]::UTF8
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# Build reverse map: Unicode code point -> Windows-1252 byte value
$reverseMap = @{}
for ($b = 0; $b -le 255; $b++) {
    $ch = $enc1252.GetString([byte[]]@($b))
    $cp = [int]$ch[0]
    $reverseMap[$cp] = $b
}

function Get-1252Byte($char) {
    $cp = [int]$char
    if ($script:reverseMap.ContainsKey($cp)) { return $script:reverseMap[$cp] }
    return -1
}

function Fix-Mojibake($content) {
    $result = New-Object System.Text.StringBuilder($content.Length)
    $i = 0
    while ($i -lt $content.Length) {
        $b0 = Get-1252Byte $content[$i]
        
        if ($b0 -ge 0xC0 -and $b0 -le 0xFF) {
            # Potential UTF-8 lead byte
            $seqLen = 0
            if ($b0 -ge 0xF0) { $seqLen = 4 }
            elseif ($b0 -ge 0xE0) { $seqLen = 3 }
            elseif ($b0 -ge 0xC0) { $seqLen = 2 }
            
            $valid = $true
            if ($i + $seqLen -gt $content.Length) { $valid = $false }
            else {
                for ($j = 1; $j -lt $seqLen; $j++) {
                    $bj = Get-1252Byte $content[$i + $j]
                    if ($bj -lt 0x80 -or $bj -gt 0xBF) { $valid = $false; break }
                }
            }
            
            if ($valid -and $seqLen -gt 1) {
                # Collect bytes and decode as UTF-8
                $bytes = New-Object byte[] $seqLen
                for ($j = 0; $j -lt $seqLen; $j++) {
                    $bytes[$j] = [byte](Get-1252Byte $content[$i + $j])
                }
                try {
                    $decoded = $utf8enc.GetString($bytes)
                    if ($decoded.Length -ge 1 -and $decoded.Length -le 2 -and [int]$decoded[0] -ne 0xFFFD) {
                        [void]$result.Append($decoded)
                        $i += $seqLen
                        continue
                    }
                } catch {}
            }
        }
        [void]$result.Append($content[$i])
        $i++
    }
    return $result.ToString()
}

$files = @(
    "c:\Users\Stu\datacendia-core\src\pages\sandbox\configs\nfx.ts",
    "c:\Users\Stu\datacendia-core\src\pages\sandbox\configs\index-ventures.ts",
    "c:\Users\Stu\datacendia-core\src\pages\sandbox\configs\general-catalyst.ts"
)

foreach ($path in $files) {
    $content = [System.IO.File]::ReadAllText($path)
    $before = $content.Length
    $fixed = Fix-Mojibake $content
    [System.IO.File]::WriteAllText($path, $fixed, $utf8NoBom)
    
    # Count remaining latin-1 supplement chars
    $remaining = 0
    foreach ($ch in $fixed.ToCharArray()) {
        $code = [int]$ch
        if ($code -ge 0x80 -and $code -le 0xFF) { $remaining++ }
    }
    $fname = Split-Path $path -Leaf
    Write-Host "$fname : $before -> $($fixed.Length) chars, remaining-latin-supplement: $remaining"
}
Write-Host "Done"
