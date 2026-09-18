@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0MAAK_ONTBREKENDE_750_AUDIO.ps1"
