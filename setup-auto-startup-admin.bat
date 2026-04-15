@echo off
REM Create a VBScript to run PowerShell as Administrator
setlocal enabledelayedexpansion

cd /d "c:\Users\Yeon Gallagher\New folder"

REM Direct command to add Task Scheduler task
powershell -Command "^
$taskName = 'PM2-Resurrect-XVYN-Server'; ^
$taskAction = New-ScheduledTaskAction -Execute 'C:\Windows\System32\cmd.exe' -Argument '/c pm2 resurrect'; ^
$taskTrigger = New-ScheduledTaskTrigger -AtStartup; ^
$taskSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable; ^
try { Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction Ignore } catch {}; ^
Register-ScheduledTask -TaskName $taskName -Action $taskAction -Trigger $taskTrigger -Settings $taskSettings -Description 'Auto-start XVYN Server dengan PM2' -RunLevel Highest -Force; ^
Write-Host 'Task Scheduler successfully configured!'; ^
"

echo.
echo Server auto-startup telah dikonfigurasi!
echo Press any key to close...
pause
