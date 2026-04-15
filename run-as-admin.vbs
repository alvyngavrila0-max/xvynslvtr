Set objShell = CreateObject("Shell.Application")
objShell.ShellExecute "cmd.exe", "/c """ & CreateObject("WScript.Shell").CurrentDirectory & "\setup-auto-startup-admin.bat""", "", "runas", 1
