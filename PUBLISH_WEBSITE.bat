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
  echo Gallery update failed. Make sure Python is installed.
  pause
  exit /b 1
)

git add -A
git diff --cached --quiet
if %errorlevel%==0 (
  echo No website changes to publish.
  pause
  exit /b 0
)

git commit -m "Update photography gallery"
if errorlevel 1 (
  echo Commit failed. Check your Git configuration.
  pause
  exit /b 1
)

git push origin main
if errorlevel 1 (
  echo Push failed. Sign in to GitHub if requested, then try again.
  pause
  exit /b 1
)

echo.
echo Website changes pushed successfully.
pause
