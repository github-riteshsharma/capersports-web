@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off

:: ----------------------
:: KUDU Deployment Script
:: Simplified for MERN Stack
:: ----------------------

echo Starting MERN Stack deployment...

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

:: Deployment
echo Handling node.js deployment...

:: 1. Copy files (excluding problematic directories)
echo Copying files...
robocopy "%DEPLOYMENT_SOURCE%" "%DEPLOYMENT_TARGET%" /E /XD node_modules .git client\node_modules client\build uploads logs

:: 2. Install backend dependencies
echo Installing backend dependencies...
IF EXIST "%DEPLOYMENT_TARGET%\package.json" (
  pushd "%DEPLOYMENT_TARGET%"
  call npm install --only=production --no-optional
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)

:: 3. Install frontend dependencies and build
echo Installing frontend dependencies...
IF EXIST "%DEPLOYMENT_TARGET%\client\package.json" (
  pushd "%DEPLOYMENT_TARGET%\client"
  call npm install --include=dev --no-optional
  IF !ERRORLEVEL! NEQ 0 goto error
  
  echo Building frontend...
  call npm run build
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)

:: 4. Copy frontend build to public folder
echo Setting up static files...
IF EXIST "%DEPLOYMENT_TARGET%\client\build" (
  IF NOT EXIST "%DEPLOYMENT_TARGET%\public" mkdir "%DEPLOYMENT_TARGET%\public"
  xcopy "%DEPLOYMENT_TARGET%\client\build\*" "%DEPLOYMENT_TARGET%\public\" /E /Y /Q
  IF !ERRORLEVEL! NEQ 0 goto error
)

:: 5. Create uploads directory
IF NOT EXIST "%DEPLOYMENT_TARGET%\uploads" mkdir "%DEPLOYMENT_TARGET%\uploads"

echo Deployment completed successfully!
goto end

:error
echo An error occurred during deployment.
exit /b 1

:end
endlocal
