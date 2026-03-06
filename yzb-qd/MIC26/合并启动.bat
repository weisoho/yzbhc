@echo off
chcp 65001 >nul
cls
title 耗材库存管理系统 - 合并启动器
echo ============================================
echo        Material Inventory System Startup
echo ============================================
echo.
echo 1. 检查运行环境...
echo -------------------------------------------
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到 Node.js 环境!
    echo 请安装 Node.js v24.12.0 或更高版本
    echo.
    echo 正在打开依赖文件夹...
    start "" "%~dp0Install dependencies"
    echo.
    echo 请安装 Node.js 后重新运行本程序
    msg * "耗材库存管理系统启动失败：缺少Node.js运行环境。请安装Install dependencies文件夹中的node-v24.12.0-x64.msi"
    pause
    exit /b 1
)
echo ✓ Node.js 环境检测通过

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到 npm 包管理器!
    echo 请确保 Node.js 安装完整
    echo.
    echo 正在打开依赖文件夹...
    start "" "%~dp0Install dependencies"
    echo.
    echo 请重新安装 Node.js 后再次运行
    msg * "耗材库存管理系统启动失败：缺少npm包管理器。请重新安装Node.js"
    pause
    exit /b 1
)
echo ✓ npm 包管理器检测通过

echo.
echo 2. 检查项目文件...
echo -------------------------------------------
if not exist "package.json" (
    echo ERROR: package.json not found
    echo Please ensure the directory contains complete project files
    pause
    exit /b 1
)
echo ✓ package.json 检测通过

echo.
echo 3. 检查项目依赖...
echo -------------------------------------------
if not exist "node_modules" (
    echo node_modules directory not found, installing dependencies...
    echo.
    call npm install
    
    if errorlevel 1 (
        echo ERROR: Dependency installation failed
        pause
        exit /b 1
    )
    
    echo Dependencies installed successfully!
    echo ✓ 依赖安装完成
    echo.
) else (
    echo ✓ 依赖已存在，跳过安装
)

echo.
echo 4. 清理缓存...
echo -------------------------------------------
call npm run lint
echo ✓ 代码检查完成

echo.
echo 5. 检查构建状态...
echo -------------------------------------------
if not exist "dist" (
    echo dist directory not found, building project...
    echo.
    call npm run build
    
    if errorlevel 1 (
        echo ERROR: Project build failed
        pause
        exit /b 1
    )
    
    echo Project built successfully!
    echo ✓ 项目构建完成
    echo.
) else (
    echo ✓ 项目已构建，跳过构建
)

echo.
echo 6. 检查端口占用...
echo -------------------------------------------
set "PORT=5175"
set "MAX_RETRY=30"
set "RETRY_INTERVAL=2"

netstat -ano | findstr :%PORT% >nul
if %errorlevel% equ 0 (
    echo 警告: 端口 %PORT% 已被占用!
    echo 正在尝试停止占用进程...
    
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT% ^| findstr LISTENING') do (
        taskkill /F /PID %%a >nul 2>&1
        echo 已终止进程 PID: %%a
    )
    
    timeout /t 2 /nobreak >nul
)

echo.
echo 7. 启动开发服务器...
echo -------------------------------------------
echo 服务启动中，请稍候...
echo 访问地址: http://127.0.0.1:%PORT%
echo 按 Ctrl+C 停止服务
echo -------------------------------------------
echo.

start "Material Inventory System" cmd /k "npm run dev"

echo 等待服务启动...
set "SERVICE_STARTED=0"

for /l %%i in (1,1,%MAX_RETRY%) do (
    netstat -ano ^| findstr :%PORT% >nul
    if %errorlevel% equ 0 (
        set "SERVICE_STARTED=1"
        echo ✓ 服务已成功启动 (尝试 %%i/%MAX_RETRY%)
        goto :service_started
    )
    echo 等待服务启动... (尝试 %%i/%MAX_RETRY%)
    timeout /t %RETRY_INTERVAL% /nobreak >nul
)

if %SERVICE_STARTED% equ 0 (
    echo 错误: 服务启动失败，请检查错误信息!
    echo 可能的原因:
    echo 1. 端口 %PORT% 被其他程序占用
    echo 2. 依赖安装不完整
    echo 3. 代码存在语法错误
    pause
    exit /b 1
)

:service_started
echo.
echo 8. 打开浏览器...
echo -------------------------------------------
echo 正在打开浏览器访问应用...
start "" "http://127.0.0.1:%PORT%"

echo.
echo ============================================
echo   服务运行中: http://127.0.0.1:%PORT%
echo   按 Ctrl+C 停止服务
echo ============================================
echo.
echo 服务已在后台运行，PID: 
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT% ^| findstr LISTENING') do (
    echo %%a
)

echo.
echo 启动完成! 请检查服务器窗口中的启动状态
pause