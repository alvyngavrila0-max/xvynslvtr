@echo off
REM This script will request Administrator privileges

:: Elevate batch script with Administrator privileges
::------begin UAC bypass------
setlocal DisableDelayedExpansion
set "batchPath=%~0"
for /F %%A in ('copy /Z "%~dpf0" nul') do set "ASCII=%%A"
setlocal enableDelayedExpansion
fltmc >nul 2>&1 | find /C /V "" >nul && (
  REM - User is NOT Administrator
  powershell -Command "Start-Process -FilePath '%batchPath%' -Verb RunAs" 2>nul | find /C /V "" >nul
  exit /b
) || (
  REM - User IS Administrator
  cd /d "c:\Users\Yeon Gallagher\New folder"
)
::------end UAC bypass------

cls
title PM2 Auto-Startup Setup

echo Setting up PM2 auto-startup on Task Scheduler...
echo.

REM Save PM2 processes
echo Saving PM2 configuration...
call pm2 save

echo.
echo Creating Task Scheduler entry...

REM Using VBScript to register the task (more reliable)
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$taskName = 'PM2-Resurrect-XVYN-Server'; " ^
  "$taskAction = New-ScheduledTaskAction -Execute 'C:\Windows\System32\cmd.exe' -Argument '/c pm2 resurrect'; " ^
  "$taskTrigger = New-ScheduledTaskTrigger -AtStartup; " ^
  "$taskSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable; " ^
  "try { Unregister-ScheduledTask -TaskName '$taskName' -Confirm:$false -ErrorAction Ignore } catch {}; " ^
  "Register-ScheduledTask -TaskName '$taskName' -Action $taskAction -Trigger $taskTrigger -Settings $taskSettings -Description 'Auto-start XVYN Server dengan PM2' -RunLevel Highest -Force; " ^
  "Write-Host 'Successfully created Task Scheduler task!'"

echo.
echo ============================================
echo SELESAI!
echo.
echo Server akan otomatis berjalan saat Windows startup
echo Proses yang tersimpan:
pm2 list
echo.
echo Untuk cek log server, gunakan: pm2 logs xvyn-server
echo ============================================
pause
