@echo off
title Junimpum Church Website Server
echo ==============================================
echo   Junimpum Church Website Local Server
echo   Starting development server...
echo   Open browser at: http://localhost:3000
echo ==============================================
cd /d "%~dp0"
call npm run dev
pause
