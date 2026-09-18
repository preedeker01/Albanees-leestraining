$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

function Stop-Fout([string]$Tekst) {
    Write-Host ""
    Write-Host "FOUT: $Tekst" -ForegroundColor Red
    Write-Host "Er is niet verder gegaan."
    Read-Host "Druk Enter om af te sluiten"
    exit 1
}

# Veiligheidscontrole: dit moet de hoofdmap van Albanees-leestraining zijn.
foreach($p in @("audio-map.json","word-data-750.json","audio\anila","audio\ilir")) {
    if(-not (Test-Path $p)) { Stop-Fout "Niet gevonden: $p. Zet dit script in de hoofdmap van Albanees-leestraining." }
}

# PS 5.1-compatibele JSON -> hashtable conversie
function ConvertTo-Hashtable($obj) {
    if($null -eq $obj) { return $null }
    if($obj -is [System.Collections.IDictionary]) {
        $h=@{}
        foreach($k in $obj.Keys){ $h[$k]=ConvertTo-Hashtable $obj[$k] }
        return $h
    }
    if($obj -is [PSCustomObject]) {
        $h=@{}
        foreach($p in $obj.PSObject.Properties){ $h[$p.Name]=ConvertTo-Hashtable $p.Value }
        return $h
    }
    if(($obj -is [System.Collections.IEnumerable]) -and -not ($obj -is [string])) {
        $a=@(); foreach($x in $obj){ $a += ,(ConvertTo-Hashtable $x) }; return $a
    }
    return $obj
}

try {
    $map = ConvertTo-Hashtable ((Get-Content "audio-map.json" -Raw -Encoding UTF8) | ConvertFrom-Json)
    $wd  = (Get-Content "word-data-750.json" -Raw -Encoding UTF8) | ConvertFrom-Json
} catch { Stop-Fout "JSON kan niet worden gelezen: $($_.Exception.Message)" }

if(-not $map.files) { Stop-Fout "audio-map.json bevat geen 'files'." }
if(-not $map.region) { $map.region = "northeurope" }
if(-not $map.voices) { Stop-Fout "Stemgegevens ontbreken in audio-map.json." }

# Haal de actuele 750 woorden uit word-data-750.json, zodat het script altijd
# precies aansluit bij de woordenlijst die in dezelfde GitHub-map staat.
$doel = New-Object System.Collections.Generic.List[string]
$gezien=@{}
foreach($len in @("3","4","5","6","7")) {
    $prop=$wd.words.PSObject.Properties[$len]
    if($null -ne $prop) {
        foreach($w in $prop.Value) {
            $w=[string]$w
            if($w -and -not $gezien.ContainsKey($w)) { $gezien[$w]=$true; $doel.Add($w) }
        }
    }
}
if($doel.Count -ne 750) {
    Stop-Fout "Ik verwacht exact 750 unieke oefenwoorden, maar vind $($doel.Count). audio-map.json is niet gewijzigd."
}

$missing = New-Object System.Collections.Generic.List[string]
foreach($w in $doel) {
    $e=$map.files[$w]
    if($null -eq $e -or -not $e.anila -or -not $e.ilir) { $missing.Add($w) }
}

Write-Host ""
Write-Host "750 woorden gecontroleerd." -ForegroundColor Cyan
Write-Host "Ontbrekende woorden voor Anila/Ilir: $($missing.Count)"
if($missing.Count -eq 0) {
    Write-Host "Alles is al aanwezig. Er hoeft niets gegenereerd te worden." -ForegroundColor Green
    Read-Host "Druk Enter om af te sluiten"
    exit 0
}

# Bepaal hoogste werkelijk gebruikte numerieke bestands-ID uit bestanden EN map.
$maxId=0
foreach($dir in @("audio\anila","audio\ilir")) {
    Get-ChildItem $dir -File -Filter "*.mp3" | ForEach-Object {
        if($_.BaseName -match '^\d+$') { $n=[int]$_.BaseName; if($n -gt $maxId){$maxId=$n} }
    }
}
foreach($key in $map.files.Keys) {
    foreach($v in @("anila","ilir")) {
        $rel=$map.files[$key][$v]
        if($rel -match '/(\d+)\.mp3$') { $n=[int]$Matches[1]; if($n -gt $maxId){$maxId=$n} }
    }
}
Write-Host "Nieuwe nummers beginnen na: $maxId"

# Backup vóór enige wijziging.
$stamp=Get-Date -Format "yyyyMMdd-HHmmss"
$backup="audio-map.VOOR_750_$stamp.backup.json"
Copy-Item "audio-map.json" $backup -Force
Write-Host "Backup gemaakt: $backup"

Write-Host ""
Write-Host "Open in Azure je Speech-resource en kopieer KEY 1 naar het Windows-klembord."
Read-Host "Als KEY 1 op het klembord staat, druk Enter"

$key=(Get-Clipboard -Raw)
if($null -eq $key){ Stop-Fout "Geen sleutel op het klembord gevonden." }
$key=($key -replace '[^A-Za-z0-9]','')
if($key.Length -lt 20){ Stop-Fout "De sleutel op het klembord lijkt niet geldig." }

$region=[string]$map.region
$uri="https://$region.tts.speech.microsoft.com/cognitiveservices/v1"
$headers=@{
    "Ocp-Apim-Subscription-Key"=$key
    "X-Microsoft-OutputFormat"="audio-24khz-48kbitrate-mono-mp3"
    "User-Agent"="AlbaneesLeestraining"
}
$voices=@{
    anila=[string]$map.voices.anila
    ilir=[string]$map.voices.ilir
}
if(-not $voices.anila){$voices.anila="sq-AL-AnilaNeural"}
if(-not $voices.ilir){$voices.ilir="sq-AL-IlirNeural"}

function XmlEscape([string]$s) {
    return [System.Security.SecurityElement]::Escape($s)
}

$gemaakt=0
foreach($w in $missing) {
    $maxId++
    $id=("{0:D4}" -f $maxId)
    $temp=@{}
    try {
        foreach($v in @("anila","ilir")) {
            $out="audio\$v\$id.mp3"
            if(Test-Path $out){ throw "Bestand bestaat al: $out" }
            $txt=XmlEscape $w
            $voice=XmlEscape $voices[$v]
            $ssml="<speak version='1.0' xml:lang='sq-AL'><voice name='$voice'>$txt</voice></speak>"
            Invoke-WebRequest -UseBasicParsing -Method Post -Uri $uri -Headers $headers `
                -ContentType "application/ssml+xml" -Body ([Text.Encoding]::UTF8.GetBytes($ssml)) `
                -OutFile $out
            if(-not (Test-Path $out) -or (Get-Item $out).Length -lt 100) {
                throw "Geen geldig audiobestand gemaakt voor '$w' ($v)."
            }
            $temp[$v]=$out.Replace("\","/")
        }
        # Koppeling pas toevoegen nadat BEIDE bestanden goed zijn gemaakt.
        $map.files[$w]=@{anila=$temp.anila; ilir=$temp.ilir}
        $gemaakt++
        Write-Host ("[{0}/{1}] {2} -> {3}" -f $gemaakt,$missing.Count,$w,$id)
    } catch {
        foreach($v in @("anila","ilir")) {
            $f="audio\$v\$id.mp3"; if(Test-Path $f){Remove-Item $f -Force}
        }
        # Bewaar reeds volledig geslaagde eerdere woorden, zodat Azure-werk niet verloren gaat.
        $map | ConvertTo-Json -Depth 20 | Set-Content "audio-map.json" -Encoding UTF8
        Stop-Fout "Genereren stopte bij '$w': $($_.Exception.Message). Eerdere volledig gemaakte woorden zijn veilig opgeslagen."
    }
}

$map | ConvertTo-Json -Depth 20 | Set-Content "audio-map.json" -Encoding UTF8

# Eindcontrole
$errors=New-Object System.Collections.Generic.List[string]
$seen=@{}
foreach($w in $doel) {
    $e=$map.files[$w]
    foreach($v in @("anila","ilir")) {
        if($null -eq $e -or -not $e[$v]) { $errors.Add("Ontbrekende mapping: $w / $v"); continue }
        $rel=[string]$e[$v]
        $local=$rel.Replace("/","\")
        if(-not (Test-Path $local)){ $errors.Add("Bestand ontbreekt: $rel") }
    }
}
foreach($text in $map.files.Keys) {
    foreach($v in @("anila","ilir")) {
        $rel=[string]$map.files[$text][$v]
        if($rel) {
            $key2="$v|$rel"
            if($seen.ContainsKey($key2) -and $seen[$key2] -ne $text) {
                $errors.Add("Dubbele koppeling: $rel = '$($seen[$key2])' EN '$text'")
            } else { $seen[$key2]=$text }
        }
    }
}

Write-Host ""
if($errors.Count -gt 0) {
    Write-Host "CONTROLEFOUT - NIET PUSHEN NAAR GITHUB" -ForegroundColor Red
    $errors | Select-Object -First 30 | ForEach-Object { Write-Host $_ -ForegroundColor Red }
    if($errors.Count -gt 30){Write-Host "... en nog $($errors.Count-30) fouten."}
} else {
    Write-Host "KLAAR EN GECONTROLEERD." -ForegroundColor Green
    Write-Host "Alle 750 oefenwoorden hebben nu Anila + Ilir audio."
    Write-Host "Nieuwe woorden gemaakt: $gemaakt"
    Write-Host ""
    Write-Host "Open nu GitHub Desktop -> controleer Changes -> Commit to main -> Push origin."
}
Read-Host "Druk Enter om af te sluiten"
