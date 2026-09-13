@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0MAAK_750_WOORDEN_EN_AUDIO.ps1"
if errorlevel 1 (
 echo.
 echo Er is een fout opgetreden. Maak een screenshot van de foutmelding.
 pause
)
