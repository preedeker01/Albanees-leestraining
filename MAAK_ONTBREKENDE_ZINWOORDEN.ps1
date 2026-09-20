$ErrorActionPreference="Stop"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "ALBANEES - ONTBREKENDE WOORD-VOOR-WOORD AUDIO" -ForegroundColor Cyan
Write-Host "Bestaande goede audio en koppelingen worden NIET gewijzigd."
Write-Host ""

if(!(Test-Path ".\audio-map.json")){throw "audio-map.json ontbreekt."}
if(!(Test-Path ".\ontbrekende_zinwoorden.json")){throw "ontbrekende_zinwoorden.json ontbreekt."}
if(!(Test-Path ".\audio\anila")){throw "audio\anila ontbreekt."}
if(!(Test-Path ".\audio\ilir")){throw "audio\ilir ontbreekt."}



$mapObj=Get-Content -Raw -Encoding UTF8 ".\audio-map.json"|ConvertFrom-Json
$files=@{}
foreach($prop in $mapObj.files.PSObject.Properties){
  $entry=@{}
  if($prop.Value.anila){$entry["anila"]=[string]$prop.Value.anila}
  if($prop.Value.ilir){$entry["ilir"]=[string]$prop.Value.ilir}
  $files[$prop.Name]=$entry
}
$map=@{
 version=2
 region=[string]$mapObj.region
 voices=@{
   anila=[string]$mapObj.voices.anila
   ilir=[string]$mapObj.voices.ilir
 }
 files=$files
}

# De goede basis gebruikt 0001 t/m 0484. Zoek toch veilig het hoogste werkelijk bestaande nummer.
$max=0
Get-ChildItem ".\audio\anila",".\audio\ilir" -Filter "*.mp3" | ForEach-Object {
 if($_.BaseName -match '^\d+$'){
   $n=[int]$_.BaseName
   if($n -gt $max){$max=$n}
 }
}
foreach($entry in $map.files.Values) {
 foreach($voice in @("anila","ilir")) {
  if($entry[$voice] -match '/(\d+)\.mp3$') {
   $n=[int]$Matches[1]
   if($n -gt $max){$max=$n}
  }
 }
}
$next=$max+1

$wanted=Get-Content -Raw -Encoding UTF8 ".\ontbrekende_zinwoorden.json"|ConvertFrom-Json
$todo=@($wanted | Where-Object {
 $entry=$map.files[[string]$_]
 $incomplete=$false
 foreach($voice in @("anila","ilir")) {
  if($null -eq $entry -or -not $entry[$voice]) { $incomplete=$true; continue }
  $file=[string]$entry[$voice]
  if(-not (Test-Path -LiteralPath $file -PathType Leaf)) { $incomplete=$true }
  elseif((Get-Item -LiteralPath $file).Length -lt 100) { $incomplete=$true }
 }
 $incomplete
})

Write-Host ("Ontbrekende woorden die nog gemaakt moeten worden: " + $todo.Count)
if($todo.Count -eq 0){
 Write-Host "Alles is al aanwezig. Er hoeft geen audio gemaakt te worden." -ForegroundColor Green
 exit
}

Write-Host ""
$stamp=Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item ".\audio-map.json" ".\audio-map.VOOR_WOORDVOORWOORD_$stamp.backup.json"
Write-Host "Kopieer Azure Speech KEY 1 naar het Windows-klembord."
Read-Host "Druk daarna op Enter"
$key=Get-Clipboard -Raw
if($null -eq $key){$key=""}
$key=($key -replace '[^A-Za-z0-9]','')
if($key.Length -lt 20){throw "Geen geldige Azure Speech KEY gevonden op het klembord."}

$uri="https://$($map.region).tts.speech.microsoft.com/cognitiveservices/v1"
function EscapeXml([string]$s){[System.Security.SecurityElement]::Escape($s)}
function MakeAudio([string]$text,[string]$voice,[string]$path){
 $safe=EscapeXml $text
 $ssml="<speak version='1.0' xml:lang='sq-AL'><voice name='$voice'>$safe</voice></speak>"
 $headers=@{
   "Ocp-Apim-Subscription-Key"=$key
   "X-Microsoft-OutputFormat"="audio-24khz-48kbitrate-mono-mp3"
   "User-Agent"="AlbaneesLeestraining"
 }
 Invoke-WebRequest -UseBasicParsing -Method Post -Uri $uri -Headers $headers -ContentType "application/ssml+xml" -Body ([Text.Encoding]::UTF8.GetBytes($ssml)) -OutFile $path
}

$i=0
foreach($word in $todo){
 $i++
 $id="{0:D4}" -f $next
 $pa="audio/anila/$id.mp3"
 $pi="audio/ilir/$id.mp3"
 Write-Host ("["+$i+"/"+$todo.Count+"] "+$word)
 $entry=@{}
 $created=@()
 try {
  foreach($voice in @("anila","ilir")) {
   $oldEntry=$map.files[[string]$word]
   if($null -ne $oldEntry -and $oldEntry[$voice]) {
    $old=[string]$oldEntry[$voice]
    if((Test-Path -LiteralPath $old -PathType Leaf) -and (Get-Item -LiteralPath $old).Length -ge 100) {
     $entry[$voice]=$old
     continue
    }
   }
   $path=if($voice -eq "anila"){$pa}else{$pi}
   if(Test-Path -LiteralPath $path){throw "Bestand bestaat al: $path"}
   $created+=$path
   MakeAudio ([string]$word) $map.voices[$voice] $path
   if(-not (Test-Path -LiteralPath $path -PathType Leaf) -or (Get-Item -LiteralPath $path).Length -lt 100){throw "Geen geldige audio: $path"}
   $entry[$voice]=$path
  }
  # Save each completed pair; an interrupted later request cannot lose earlier work.
  $map.files[[string]$word]=$entry
  $map | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 ".\audio-map.json"
 } catch {
  foreach($path in $created){if(Test-Path -LiteralPath $path){Remove-Item -LiteralPath $path -Force}}
  throw
 }
 $next++
}

$map | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 ".\audio-map.json"

# Eindcontrole: ieder gevraagd woord heeft beide bestanden en geen twee teksten delen een pad.
$errors=@()
$seen=@{}
foreach($word in $wanted){
 $w=[string]$word
 if(-not $map.files.ContainsKey($w)){$errors+=("Geen mapping: "+$w);continue}
 foreach($voice in @("anila","ilir")){
   $p=$map.files[$w][$voice]
   if(-not $p){$errors+=("Geen "+$voice+" mapping: "+$w);continue}
   if(-not (Test-Path -LiteralPath $p -PathType Leaf)){$errors+=("Bestand ontbreekt: "+$p)}
   elseif((Get-Item -LiteralPath $p).Length -lt 100){$errors+=("Audiobestand is te klein: "+$p)}
 }
}
foreach($prop in $map.files.GetEnumerator()){
 foreach($voice in @("anila","ilir")){
   $p=$prop.Value[$voice]
   if($p){
     $key2=$voice+"|"+$p
     if($seen.ContainsKey($key2) -and $seen[$key2] -ne $prop.Key){
       $errors+=("Dubbel audiopad: "+$p+" voor '"+$seen[$key2]+"' en '"+$prop.Key+"'")
     } else {$seen[$key2]=$prop.Key}
   }
 }
}
if($errors.Count -gt 0){
 Write-Host ""
 Write-Host "CONTROLEFOUT - NIET PUSHEN NAAR GITHUB" -ForegroundColor Red
 $errors | ForEach-Object {Write-Host $_ -ForegroundColor Red}
 throw "Audio-eindcontrole niet geslaagd."
}
Write-Host ""
Write-Host "KLAAR EN GECONTROLEERD." -ForegroundColor Green
Write-Host ($todo.Count.ToString()+" nieuwe woorden voor Anila en Ilir toegevoegd.")
Write-Host "De 300 bestaande volledige zinnen zijn niet gewijzigd."
