$ErrorActionPreference="Stop"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "ALBANESE ZINNENAUDIO REPARATIE v11" -ForegroundColor Cyan
Write-Host "Deze reparatie maakt ALLE losse woorden en ALLE 300 zinnen opnieuw."
Write-Host "Bestaande MP3-bestanden worden niet overschreven; er worden nieuwe nummers gebruikt."
Write-Host ""

if (!(Test-Path ".\audio-map.json")) { throw "audio-map.json staat niet in deze map." }
if (!(Test-Path ".\sentence-audio-texts.json")) { throw "sentence-audio-texts.json ontbreekt." }
New-Item -ItemType Directory -Force ".\audio\anila" | Out-Null
New-Item -ItemType Directory -Force ".\audio\ilir" | Out-Null

$mapObj=Get-Content -Raw -Encoding UTF8 ".\audio-map.json" | ConvertFrom-Json
$map=@{version=11;region="northeurope";voices=@{anila="sq-AL-AnilaNeural";ilir="sq-AL-IlirNeural"};files=@{}}
if($mapObj.region){$map.region=[string]$mapObj.region}
if($mapObj.voices){
 if($mapObj.voices.anila){$map.voices.anila=[string]$mapObj.voices.anila}
 if($mapObj.voices.ilir){$map.voices.ilir=[string]$mapObj.voices.ilir}
}
if($mapObj.files){
 foreach($prop in $mapObj.files.PSObject.Properties){
   $entry=@{}
   if($prop.Value.anila){$entry.anila=[string]$prop.Value.anila}
   if($prop.Value.ilir){$entry.ilir=[string]$prop.Value.ilir}
   $map.files[$prop.Name]=$entry
 }
}

# Zoek hoogste bestaand nummer in beide audiomappen EN in de map.
$max=0
Get-ChildItem ".\audio\anila",".\audio\ilir" -Filter "*.mp3" -ErrorAction SilentlyContinue | ForEach-Object {
 if($_.BaseName -match '^\d+$'){ $n=[int]$_.BaseName; if($n -gt $max){$max=$n} }
}
foreach($v in $map.files.Values){
 foreach($p in $v.Values){
  if($p -match '/(\d+)\.mp3$'){ $n=[int]$matches[1]; if($n -gt $max){$max=$n} }
 }
}
$next=$max+1

Write-Host "Kopieer nu KEY 1 van je Azure Speech-resource naar het Windows klembord."
Read-Host "Druk daarna hier op Enter"
$key=(Get-Clipboard -Raw)
if($null -eq $key){$key=""}
$key=($key -replace '[^A-Za-z0-9]','')
if($key.Length -lt 20){throw "Geen geldige Azure Speech KEY op het klembord gevonden."}

$texts=Get-Content -Raw -Encoding UTF8 ".\sentence-audio-texts.json" | ConvertFrom-Json
$region=$map.region
$uri="https://$region.tts.speech.microsoft.com/cognitiveservices/v1"

function EscapeXml([string]$s){
 return [System.Security.SecurityElement]::Escape($s)
}
function MakeAudio([string]$text,[string]$voice,[string]$path){
 $escaped=EscapeXml $text
 $ssml="<speak version='1.0' xml:lang='sq-AL'><voice name='$voice'>$escaped</voice></speak>"
 $headers=@{
  "Ocp-Apim-Subscription-Key"=$key
  "X-Microsoft-OutputFormat"="audio-24khz-48kbitrate-mono-mp3"
  "User-Agent"="AlbaneesLeestraining"
 }
 Invoke-WebRequest -UseBasicParsing -Method Post -Uri $uri -Headers $headers -ContentType "application/ssml+xml" -Body ([Text.Encoding]::UTF8.GetBytes($ssml)) -OutFile $path
}

$total=$texts.Count
$i=0
foreach($text in $texts){
 $i++
 $id="{0:D4}" -f $next
 $pa="audio/anila/$id.mp3"
 $pi="audio/ilir/$id.mp3"
 Write-Host "[$i/$total] $text"
 MakeAudio $text $map.voices.anila ".\$pa"
 MakeAudio $text $map.voices.ilir ".\$pi"
 # BELANGRIJK: ieder tekstitem krijgt zijn eigen nieuwe ID.
 $map.files[[string]$text]=@{anila=$pa;ilir=$pi}
 $next++
}

$map | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 ".\audio-map.json"
Write-Host ""
Write-Host "KLAAR." -ForegroundColor Green
Write-Host "$total teksten opnieuw gemaakt voor Anila en Ilir."
Write-Host "Nu GitHub Desktop openen, alles committen en Push origin."
