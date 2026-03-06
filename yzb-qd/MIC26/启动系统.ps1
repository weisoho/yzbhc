Write-Host "============================================"
Write-Host "        耗材库存管理系统启动脚本"
Write-Host "============================================"
Write-Host ""
Write-Host "1. 检查项目依赖..."
Write-Host ""

# 检查package.json是否存在
if (-not (Test-Path "package.json")) {
    Write-Host "错误: 未找到 package.json 文件"
    Write-Host "请确保程序所在目录包含完整的项目文件"
    pause
    exit 1
}

# 检查node_modules目录是否存在
if (-not (Test-Path "node_modules")) {
    Write-Host "未找到 node_modules 目录，正在安装依赖..."
    Write-Host ""
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "错误: 依赖安装失败"
        pause
        exit 1
    }
    
    Write-Host "依赖安装成功！"
    Write-Host ""
}

# 检查dist目录是否存在
if (-not (Test-Path "dist")) {
    Write-Host "未找到 dist 目录，正在构建项目..."
    Write-Host ""
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "错误: 项目构建失败"
        pause
        exit 1
    }
    
    Write-Host "项目构建成功！"
    Write-Host ""
}

Write-Host "2. 启动开发服务器..."
Write-Host ""

# 启动开发服务器
Start-Process "cmd.exe" -ArgumentList "/k npm run dev" -WindowStyle Normal -WorkingDirectory "$PWD"

Write-Host "3. 等待服务器启动..."
Write-Host ""
Write-Host "服务器正在启动中，请稍候..."
Write-Host "访问地址: http://127.0.0.1:5175"
Write-Host ""
Write-Host "提示: 服务器启动后，您可以通过上述地址访问系统"
Write-Host "提示: 关闭服务器窗口将停止服务"
Write-Host ""
Write-Host "============================================"
Write-Host "启动脚本执行完成"
Write-Host "服务器窗口已打开，请在该窗口查看启动状态"
Write-Host "============================================"

# 等待几秒钟后打开浏览器
Start-Sleep -Seconds 5
Start-Process "http://127.0.0.1:5175"

pause
