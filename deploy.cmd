@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off

:: ----------------------
:: KUDU Deployment Script
<<<<<<< HEAD
:: Simplified for MERN Stack
:: ----------------------

echo Starting MERN Stack deployment...

:: Prerequisites
where node 2>nul >nul
IF %ERRORLEVEL% NEQ 0 (
  echo Missing node.js executable
=======
:: Version: 1.0.17
:: ----------------------

:: Prerequisites
:: -------------

:: Verify node.js installed
where node 2>nul >nul
IF %ERRORLEVEL% NEQ 0 (
  echo Missing node.js executable, please install node.js, if already installed make sure it can be reached from current environment.
>>>>>>> parent of 03364ed (commit)
  goto error
)

:: Setup
<<<<<<< HEAD
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
=======
:: -----

setlocal enabledelayedexpansion

SET ARTIFACTS=%~dp0%..\artifacts

IF NOT DEFINED DEPLOYMENT_SOURCE (
  SET DEPLOYMENT_SOURCE=%~dp0%.
)

IF NOT DEFINED DEPLOYMENT_TARGET (
  SET DEPLOYMENT_TARGET=%ARTIFACTS%\wwwroot
)

IF NOT DEFINED NEXT_MANIFEST_PATH (
  SET NEXT_MANIFEST_PATH=%ARTIFACTS%\manifest

  IF NOT DEFINED PREVIOUS_MANIFEST_PATH (
    SET PREVIOUS_MANIFEST_PATH=%ARTIFACTS%\manifest
  )
)

IF NOT DEFINED KUDU_SYNC_CMD (
  :: Install kudu sync
  echo Installing Kudu Sync
  call npm install kudusync -g --silent
  IF !ERRORLEVEL! NEQ 0 goto error

  :: Locally just running "kuduSync" would also work
  SET KUDU_SYNC_CMD=%appdata%\npm\kuduSync.cmd
)

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Deployment
:: ----------

echo Handling node.js deployment.

:: 1. KuduSync
IF /I "%IN_PLACE_DEPLOYMENT%" NEQ "1" (
  call :ExecuteCmd "%KUDU_SYNC_CMD%" -v 50 -f "%DEPLOYMENT_SOURCE%" -t "%DEPLOYMENT_TARGET%" -n "%NEXT_MANIFEST_PATH%" -p "%PREVIOUS_MANIFEST_PATH%" -i ".git;.hg;.deployment;deploy.cmd"
  IF !ERRORLEVEL! NEQ 0 goto error
)

:: 2. Select deployment approach based on what exists
IF EXIST "%DEPLOYMENT_TARGET%\server\package.json" (
  :: Full stack deployment - install server dependencies
  pushd "%DEPLOYMENT_TARGET%\server"
  call :ExecuteCmd npm install --production
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
  
  :: Build client if it exists
  IF EXIST "%DEPLOYMENT_TARGET%\client\package.json" (
    pushd "%DEPLOYMENT_TARGET%\client"
    call :ExecuteCmd npm install
    IF !ERRORLEVEL! NEQ 0 goto error
    
    call :ExecuteCmd npm run build
    IF !ERRORLEVEL! NEQ 0 goto error
    popd
    
    :: Copy client build to server public directory
    IF EXIST "%DEPLOYMENT_TARGET%\client\build" (
      call :ExecuteCmd xcopy "%DEPLOYMENT_TARGET%\client\build\*" "%DEPLOYMENT_TARGET%\server\public\" /E /Y
      IF !ERRORLEVEL! NEQ 0 goto error
    )
  )
) ELSE (
  :: Backend only deployment
  call :ExecuteCmd npm install --production
  IF !ERRORLEVEL! NEQ 0 goto error
)

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
goto end

:: Execute command routine that will echo out when error
:ExecuteCmd
setlocal
set _CMD_=%*
call %_CMD_%
if "%ERRORLEVEL%" NEQ "0" echo Failed exitCode=%ERRORLEVEL%, command=%_CMD_%
exit /b %ERRORLEVEL%

:error
endlocal
echo An error has occurred during web site deployment.
call :exitSetErrorLevel
call :exitFromFunction 2>nul

:exitSetErrorLevel
exit /b 1

:exitFromFunction
()

:end
endlocal
echo Finished successfully.
>>>>>>> parent of 03364ed (commit)
