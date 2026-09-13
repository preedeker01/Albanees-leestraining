$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host ""
Write-Host "Albanees - 750 frequente woorden + ontbrekende Anila/Ilir audio" -ForegroundColor Cyan
Write-Host "Dit programma kiest 750 hoogfrequente woorden totaal, met een natuurlijke verdeling over 3 t/m 7 Albanese letters."
Write-Host "dh, gj, ll, nj, rr, sh, th, xh en zh tellen als 1 letter."
Write-Host ""

if (!(Test-Path ".\audio-map.json")) { throw "audio-map.json niet gevonden. Zet dit script in de hoofdmap van Albanees-leestraining." }

$freqUrl = "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/sq/sq_50k.txt"
Write-Host "Frequentielijst ophalen..."
$raw = (Invoke-WebRequest -UseBasicParsing -Uri $freqUrl).Content

$digraphs = @("dh","gj","ll","nj","rr","sh","th","xh","zh")
function Albanian-Length([string]$w) {
  $w = $w.ToLowerInvariant()
  $n=0; $i=0
  while($i -lt $w.Length){
    if($i+1 -lt $w.Length -and $digraphs -contains $w.Substring($i,2)){ $n++; $i+=2 }
    else { $n++; $i++ }
  }
  return $n
}

# Standard Albanian alphabet only; remove obvious foreign/subtitle junk and one-letter fragments.
$allowed = '^[a-zçë]+$'
$groups = @{3=New-Object System.Collections.Generic.List[string];4=New-Object System.Collections.Generic.List[string];5=New-Object System.Collections.Generic.List[string];6=New-Object System.Collections.Generic.List[string];7=New-Object System.Collections.Generic.List[string]}
$seen = @{}
$all = New-Object System.Collections.Generic.List[string]

# Neem de eerste 750 geldige woorden in de corpus-rangorde. Geen kunstmatig quotum
# per lengte: de frequentie bepaalt dus de natuurlijke verdeling over 3 t/m 7 letters.
foreach($line in ($raw -split "`n")){
  $p = $line.Trim() -split '\s+'
  if($p.Count -lt 2){continue}
  $w = $p[0].ToLowerInvariant()
  if($w -notmatch $allowed){continue}
  if($seen.ContainsKey($w)){continue}
  $len=Albanian-Length $w
  if($len -ge 3 -and $len -le 7){
    $groups[$len].Add($w)
    $all.Add($w)
    $seen[$w]=$true
  }
  if($all.Count -ge 750){break}
}
if($all.Count -ne 750){throw "Kon geen 750 geldige woorden van 3 t/m 7 Albanese letters vinden."}

Write-Host ""
Write-Host "Natuurlijke verdeling van de 750 woorden:" -ForegroundColor Cyan
foreach($n in 3..7){ Write-Host ("  {0} letters: {1} woorden" -f $n,$groups[$n].Count) }

# Existing Dutch translations from the app's current word-data file are reused if present.
$translations=@{}
if(Test-Path ".\word-data-750.json"){
  try{
    $old=Get-Content -Raw -Encoding UTF8 ".\word-data-750.json"|ConvertFrom-Json
    if($old.translations){$old.translations.psobject.Properties|ForEach-Object{$translations[$_.Name]=[string]$_.Value}}
  }catch{}
}

Write-Host "Nederlandse vertalingen ophalen in kleine batches..."
$need=@($all | Where-Object { -not $translations.ContainsKey($_) })
$batchSize=20
for($i=0;$i -lt $need.Count;$i+=$batchSize){
  $end=[Math]::Min($i+$batchSize-1,$need.Count-1)
  $batch=@($need[$i..$end])
  $joined=($batch -join "`n")
  $q=[uri]::EscapeDataString($joined)
  $url="https://translate.googleapis.com/translate_a/single?client=gtx&sl=sq&tl=nl&dt=t&q=$q"
  try{
    $res=Invoke-RestMethod -Uri $url -Method Get
    $translated=(($res[0] | ForEach-Object { $_[0] }) -join "")
    $lines=@($translated -split "`n")
    if($lines.Count -eq $batch.Count){
      for($j=0;$j -lt $batch.Count;$j++){$translations[$batch[$j]]=$lines[$j].Trim()}
    } else { throw "Aantal vertalingen klopt niet" }
  }catch{
    # Per woord opnieuw proberen wanneer een batch niet goed terugkomt.
    foreach($w in $batch){
      $u="https://translate.googleapis.com/translate_a/single?client=gtx&sl=sq&tl=nl&dt=t&q=$([uri]::EscapeDataString($w))"
      try{$r=Invoke-RestMethod -Uri $u;$translations[$w]=[string]$r[0][0][0]}catch{$translations[$w]="—"}
      Start-Sleep -Milliseconds 120
    }
  }
  Write-Host ("Vertalingen: {0}/{1}" -f ([Math]::Min($end+1,$need.Count)),$need.Count)
  Start-Sleep -Milliseconds 150
}

$out=[ordered]@{source="FrequencyWords Albanian sq_50k (2016)";count=750;letter_rule="Albanian alphabet; digraphs count as one letter";words=[ordered]@{};translations=[ordered]@{}}
foreach($n in 3..7){$out.words["$n"]=@($groups[$n])}
foreach($w in $all){$out.translations[$w]=[string]$translations[$w]}
$out|ConvertTo-Json -Depth 6|Set-Content -Encoding UTF8 ".\word-data-750.json"

# Speech key via clipboard.
Write-Host ""
Write-Host "Kopieer nu KEY 1 van Azure Speech naar het Windows-klembord." -ForegroundColor Yellow
Read-Host "Druk alleen op Enter zodra KEY 1 gekopieerd is" | Out-Null
$key=Get-Clipboard -Raw
$key=[regex]::Replace([string]$key,'[^A-Za-z0-9]','')
if([string]::IsNullOrWhiteSpace($key)){throw "Geen Azure Speech KEY op het klembord gevonden."}

$mapObj=Get-Content -Raw -Encoding UTF8 ".\\audio-map.json"|ConvertFrom-Json
$mapHash=@{version=$mapObj.version;region=$mapObj.region;voices=@{anila=[string]$mapObj.voices.anila;ilir=[string]$mapObj.voices.ilir};files=@{}}
if($mapObj.files){
 foreach($prop in $mapObj.files.PSObject.Properties){
  $entry=@{}
  if($prop.Value.anila){$entry["anila"]=[string]$prop.Value.anila}
  if($prop.Value.ilir){$entry["ilir"]=[string]$prop.Value.ilir}
  $mapHash.files[$prop.Name]=$entry
 }
}
$max=0
foreach($v in $mapHash.files.Values){
 foreach($audioPath in $v.Values){
  if($audioPath -match '/(\\d{4})\\.mp3$'){$num=[int]$matches[1];if($num -gt $max){$max=$num}}
 }
}
$next=$max+1
$missing=@($all | Where-Object { -not $mapHash.files.ContainsKey($_) })
Write-Host ("Nieuwe woorden waarvoor audio ontbreekt: {0}" -f $missing.Count) -ForegroundColor Green

$region="northeurope"
$endpoint="https://$region.tts.speech.microsoft.com/cognitiveservices/v1"
$voices=@(
 @{folder="anila";name="sq-AL-AnilaNeural"},
 @{folder="ilir";name="sq-AL-IlirNeural"}
)
New-Item -ItemType Directory -Force ".\audio\anila",".\audio\ilir"|Out-Null

function EscapeXml([string]$s){[System.Security.SecurityElement]::Escape($s)}
$idx=0
foreach($w in $missing){
 $id="{0:D4}" -f $next; $next++; $idx++
 if(-not $mapHash.files.ContainsKey($w)){$mapHash.files[$w]=@{}}
 foreach($voice in $voices){
   $rel="audio/$($voice.folder)/$id.mp3"
   $dest=Join-Path $root ($rel -replace '/','\')
   $ssml="<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='sq-AL'><voice name='$($voice.name)'>$(EscapeXml $w)</voice></speak>"
   $headers=@{"Ocp-Apim-Subscription-Key"=$key;"X-Microsoft-OutputFormat"="audio-24khz-48kbitrate-mono-mp3";"User-Agent"="Albanees500"}
   Invoke-WebRequest -Uri $endpoint -Method Post -Headers $headers -ContentType "application/ssml+xml; charset=utf-8" -Body ([Text.Encoding]::UTF8.GetBytes($ssml)) -OutFile $dest
   $mapHash.files[$w][$voice.folder]=$rel
   Start-Sleep -Milliseconds 80
 }
 Write-Host ("Audio {0}/{1}: {2}" -f $idx,$missing.Count,$w)
}

$mapHash|ConvertTo-Json -Depth 10|Set-Content -Encoding UTF8 ".\audio-map.json"
$key=$null

Write-Host ""
Write-Host "KLAAR." -ForegroundColor Green
Write-Host "word-data-750.json is gemaakt."
Write-Host "Alleen ontbrekende Anila/Ilir MP3-bestanden zijn toegevoegd."
Write-Host "Open GitHub Desktop: commit daarna de nieuwe/gewijzigde bestanden en Push origin."
Read-Host "Druk Enter om af te sluiten" | Out-Null
