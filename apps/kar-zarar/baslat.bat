@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Kar-Zarar
where python >nul 2>nul
if errorlevel 1 goto :nopython
if not exist "veri\ayarlar.json" python program\ayarla.py
echo -^> Uygulama aciliyor: http://localhost:8101
start "" http://localhost:8101
python program\sunucu.py
pause
exit /b 0
:nopython
echo HATA: Python bulunamadi. https://www.python.org adresinden kurun, "Add Python to PATH" isaretleyin.
pause
exit /b 1
