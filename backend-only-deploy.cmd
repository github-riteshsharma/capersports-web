@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off

:: ----------------------
:: Backend Only Deployment
:: ----------------------

echo Starting Backend-only deployment...

:: Prerequisites
where node 2>nul >nul
IF %ERRORLEVEL% NEQ 0 (
  echo Missing node.js executable
  goto error
)

:: Setup
setlocal enabledelayedexpansion
SET ARTIFACTS=%~dp0%..\artifacts
IF NOT DEFINED DEPLOYMENT_SOURCE SET DEPLOYMENT_SOURCE=%~dp0%.
IF NOT DEFINED DEPLOYMENT_TARGET SET DEPLOYMENT_TARGET=%ARTIFACTS%\wwwroot

:: Copy backend files only
echo Copying backend files...
robocopy "%DEPLOYMENT_SOURCE%" "%DEPLOYMENT_TARGET%" /E /XD node_modules .git client uploads logs

:: Install backend dependencies
echo Installing backend dependencies...
IF EXIST "%DEPLOYMENT_TARGET%\package.json" (
  pushd "%DEPLOYMENT_TARGET%"
  call npm install --only=production --no-optional
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)

:: Create necessary directories
IF NOT EXIST "%DEPLOYMENT_TARGET%\uploads" mkdir "%DEPLOYMENT_TARGET%\uploads"
IF NOT EXIST "%DEPLOYMENT_TARGET%\public" mkdir "%DEPLOYMENT_TARGET%\public"

echo Backend deployment completed successfully!
goto end

:error
echo An error occurred during backend deployment.
exit /b 1

:end
endlocal
