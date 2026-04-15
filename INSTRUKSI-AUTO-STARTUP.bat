@echo off
REM INSTRUKSI SETUP AUTO-STARTUP PM2
REM 
REM Karena Terminal VS Code tidak memiliki akses Administrator penuh,
REM silahkan ikuti langkah-langkah manual berikut:
REM
REM PILIHAN 1: Menggunakan Startup Folder (PALING MUDAH)
REM =======================================================
REM 1. Tekan Win + R, ketik: shell:startup
REM 2. Akan membuka folder Startup
REM 3. Copy file pm2-resurrect.bat ke folder tersebut
REM 4. Selesai! Server akan auto-start saat Windows startup
REM
REM PILIHAN 2: Menggunakan Task Scheduler (LEBIH ADVANCED)
REM ====================================================
REM 1. Tekan Win + R, ketik: taskschd.msc
REM 2. Klik "Create Basic Task..." di sebelah kanan
REM 3. Name: PM2-Resurrect-XVYN-Server
REM 4. Trigger: "At startup"
REM 5. Action: 
REM    - Program/script: c:\Users\Yeon Gallagher\New folder\pm2-resurrect.bat
REM 6. Centang "Run with highest privileges"
REM 7. Klik Finish
REM
REM VERIFIKASI
REM ==========
REM Untuk test, jalankan command:
REM   pm2 resurrect
REM
REM Untuk melihat log server:
REM   pm2 logs xvyn-server
REM
REM Untuk stop server:
REM   pm2 stop xvyn-server
REM
REM File-file yang sudah disiapkan:
REM - pm2-resurrect.bat (untuk auto-startup)
REM - start-server.bat (untuk manual start)
REM
REM STATUS SAAT INI:
echo.
echo STATUS SERVER SAAT INI:
echo ======================
pm2 list
echo.
echo Konfigurasi PM2 sudah disimpan di: %USERPROFILE%\.pm2\dump.pm2
pause
