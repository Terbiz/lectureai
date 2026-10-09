@echo off
chcp 65001 >nul
title LectureAI — Aggiorna GitHub
color 0A

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║       LectureAI — Aggiorna GitHub (push auto)        ║
echo ╚══════════════════════════════════════════════════════╝
echo.

REM Vai nella cartella dello script (funziona anche se lanci da altrove)
cd /d "%~dp0"

REM Verifica che sia un repo Git
if not exist ".git" (
    echo [ERRORE] Questa cartella non e' un repository Git.
    echo Assicurati che aggiorna.bat sia nella cartella del progetto.
    echo.
    pause
    exit /b 1
)

echo [1/4] Aggiungo i file modificati...
git add .
echo.

echo [2/4] Controllo se ci sono modifiche da salvare...
git diff --cached --quiet
if %errorlevel%==0 (
    echo.
    echo Nessuna modifica da salvare. Il repository e' gia' aggiornato.
    echo.
    pause
    exit /b 0
)
echo Ci sono modifiche da salvare.
echo.

echo [3/4] Messaggio del commit
echo.
echo   Premi INVIO per usare un messaggio automatico con data e ora,
echo   oppure scrivi il tuo messaggio personalizzato.
echo.
set /p "MSG=   Messaggio: "

if "%MSG%"=="" (
    for /f "tokens=1-4 delims=/: " %%a in ("%date% %time%") do set "MSG=Update automatico %%a/%%b/%%c %%d"
)

echo.
echo Commit: "%MSG%"
git commit -m "%MSG%"
echo.

echo [4/4] Push su GitHub...
git push
echo.

if %errorlevel%==0 (
    echo ╔══════════════════════════════════════════════════════╗
    echo ║         ✓ Push completato con successo!              ║
    echo ╚══════════════════════════════════════════════════════╝
    echo.
    echo Render fara' il deploy automatico entro ~1 minuto.
    echo URL: https://lectureai-nvgr.onrender.com
    echo.
) else (
    echo ╔══════════════════════════════════════════════════════╗
    echo ║         ✗ ERRORE durante il push                     ║
    echo ╚══════════════════════════════════════════════════════╝
    echo.
    echo Controlla i messaggi sopra per capire cosa e' andato storto.
    echo.
)

pause