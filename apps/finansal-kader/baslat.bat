@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Finansal Kader
echo == Finansal Kader ==

where python >nul 2>nul
if errorlevel 1 goto :nopython

if exist ".venv\Scripts\python.exe" goto :venvok
echo -^> Python ortami kuruluyor, ilk sefer biraz surer...
python -m venv .venv
:venvok
.venv\Scripts\python.exe -m pip install -q --disable-pip-version-check -r requirements.txt
if errorlevel 1 goto :pipfail


echo -^> Uygulama aciliyor: http://localhost:8102
start "" http://localhost:8102
.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8102
echo Uygulama kapandi.
pause
exit /b 0

:nopython
echo HATA: Python bulunamadi. https://www.python.org adresinden kurun, "Add Python to PATH" isaretleyin.
pause
exit /b 1

:pipfail
echo HATA: Paketler kurulamadi, internet baglantisini kontrol edin ve tekrar deneyin.
pause
exit /b 1
