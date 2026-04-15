# Script untuk setup PM2 auto-startup di Windows
# Jalankan sebagai Administrator

# Pastikan PM2 daemon berjalan
pm2 save

# Setup Task Scheduler untuk auto-resurrect PM2 saat startup
$taskName = "PM2-Resurrect-XVYN-Server"
$taskDescription = "Auto-start XVYN Server dengan PM2 saat Windows startup"
$taskAction = New-ScheduledTaskAction -Execute "C:\Windows\System32\cmd.exe" -Argument "/c pm2 resurrect"
$taskTrigger = New-ScheduledTaskTrigger -AtStartup
$taskSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# Check jika task sudah ada, hapus dulu
try {
    Get-ScheduledTask -TaskName $taskName -ErrorAction Stop | Out-Null
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Host "Task lama dihapus"
} catch {
    Write-Host "Task baru akan dibuat"
}

# Buat task baru
Register-ScheduledTask -TaskName $taskName `
    -Action $taskAction `
    -Trigger $taskTrigger `
    -Settings $taskSettings `
    -Description $taskDescription `
    -RunLevel Highest `
    -Force

Write-Host "Task Scheduler berhasil dikonfigurasi!"
Write-Host "Server akan otomatis start saat Windows startup"
