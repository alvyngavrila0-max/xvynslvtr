@echo off
REM Start XVYN Server with PM2
cd /d "c:\Users\Yeon Gallagher\New folder"
pm2 start server.js --name "xvyn-server" --no-autorestart
pause
