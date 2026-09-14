@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py update_gallery.py
) else (
  python update_gallery.py
)
if errorlevel 1 (
  echo.
  echo Gallery update failed. Make sure Python is installed.
  pause
  exit /b 1
)
echo.
echo Done. Your portfolio gallery list is now up to date.
pause
