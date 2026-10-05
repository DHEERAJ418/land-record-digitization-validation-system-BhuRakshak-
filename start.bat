@echo off
setlocal
cd /d "%~dp0"

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 goto :error
)

if not defined MONGODB_URI set "MONGODB_URI=mongodb://127.0.0.1:27017"
if not defined MONGODB_DB set "MONGODB_DB=bhurakshak"

powershell -NoProfile -Command "$c=Test-NetConnection -ComputerName 127.0.0.1 -Port 27017 -WarningAction SilentlyContinue; if ($c.TcpTestSucceeded) { exit 0 } else { exit 1 }" >nul 2>&1
if errorlevel 1 (
  echo.
  echo [WARNING] MongoDB is not listening on 127.0.0.1:27017.
  echo Start the MongoDB service first, or set MONGODB_URI to your MongoDB Atlas URI.
  echo The website will still start, but database features will return MONGODB_UNAVAILABLE until MongoDB is reachable.
  echo.
)

call npm start
if errorlevel 1 goto :error
exit /b 0

:error
echo.
echo BhuRakshak stopped because of the error above.
pause
exit /b 1
