
# 修复终端中文乱码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

<# ================================ Node与Nacos等模块安装 ================================#>

# 1. 检测系统是否安装 Node.js，无则通过 winget 安装 LTS 版
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "No detection of Node.js, starting installation of LTS version" -ForegroundColor Cyan
    winget install --id OpenJS.NodeJS.LTS -e --source winget
    # 刷新当前终端环境变量，让新安装的node/npm立即生效
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
} else {
    Write-Host "Node.js detected, skipping installation" -ForegroundColor Green
}

# 2. 校验 npm 命令是否可用
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm not found, Node.js installation abnormal!" -ForegroundColor Red
    pause
    exit 1
}

# 3. 进入脚本所在项目根目录
$projectRoot = $PSScriptRoot
Set-Location $projectRoot
Write-Host "Working directory: $projectRoot" -ForegroundColor Cyan

# 5. 检测/安装 nacos-sdk-nodejs
Write-Host "Start checking and installing nacos..." -ForegroundColor Green
npm install nacos --save
Write-Host "nacos module install completed!" -ForegroundColor Green

<# ================================ Node与Nacos等模块安装 ================================#>

<# ============================= 2. 检测安装 Python与其对应模块 ================================= #>

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "No detection of Python, start installing Python 3.11 LTS" -ForegroundColor Cyan
    # winget安装Python3.11，自动加入PATH
    winget install --id Python.Python.3.13 -e --source winget
    # 再次刷新环境变量
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
} else {
    Write-Host "Python detected, skip install" -ForegroundColor Green
}

# 兜底修复pip
if (-not (Get-Command pip -ErrorAction SilentlyContinue)) {
    Write-Host "pip missing, bootstrap pip..." -ForegroundColor Yellow
    python -m ensurepip --upgrade
}

# 切换国内pip镜像加速
Write-Host "Set pip mirror to Tsinghua source" -ForegroundColor Cyan
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# 依次安装 Flask、flask-cors
Write-Host "Installing Flask..." -ForegroundColor Green
pip install flask

Write-Host "Installing flask-cors..." -ForegroundColor Green
pip install flask-cors

Write-Host "Installing pymysql..." -ForegroundColor Green
pip install pymysql

Write-Host "Installing openpyxl..." -ForegroundColor Green
pip install openpyxl

Write-Host "Python + Flask + flask-cors + pymysql + openpyxl environment ready!" -ForegroundColor Green
python --version
pip list --format=freeze | Select-String flask
pip list --format=freeze | Select-String pymysql
pip list --format=freeze | Select-String openpyxl

<# ============================= 2. 检测安装 Python与其对应模块 ================================= #>

<# ======================================= 3. nacos安装 =========================================#>

## 新版NACOS，停用
<# Check if nacos-setup command already exists
if (-not (Get-Command nacos-setup -ErrorAction SilentlyContinue)) {
    Write-Host "nacos-setup not found, starting download and install tool" -ForegroundColor Cyan
    powershell -NoProfile -ExecutionPolicy Bypass -Command "iwr -UseBasicParsing https://nacos.io/nacos-installer.ps1 | iex"
}
else {
    Write-Host "nacos-setup exists, skipping tool installation" -ForegroundColor Green
}

# 2. Check Nacos instance directory; if it exists, do not redeploy (to avoid resetting passwords)
$nacosInstallDir = "$env:USERPROFILE\.nacos\3.2.2"
if (-not (Test-Path $nacosInstallDir)) {    
    Write-Host "Nacos 3.2.2 not found, starting fresh deployment. Please enter a custom admin password." -ForegroundColor Cyan
    nacos-setup -v 3.2.2
}
else {
    Write-Host "Nacos 3.2.2 already deployed locally, skipping deployment, existing credentials preserved." -ForegroundColor Green
}

Write-Host "Operation complete. Access URL: http://127.0.0.1:8848/nacos, default username: nacos" -ForegroundColor Green

# Optional: start existing Nacos instance with one command
if (Test-Path "$nacosInstallDir\bin\startup.cmd") {
    Write-Host "Starting Nacos standalone service..." -ForegroundColor Cyan
    Start-Process "$nacosInstallDir\bin\startup.cmd" -ArgumentList "-m standalone"
}#>

# 2.3.2版本,不能用
<# Install the deployment tool only once
if (-not (Get-Command nacos-setup -ErrorAction SilentlyContinue)) {
    $scriptRaw = iwr -Uri "https://nacos.io/nacos-installer.ps1" -UseBasicParsing
    $scriptRaw.Content | iex
    # Refresh PATH so the command becomes available immediately
    $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [      Environment]::GetEnvironmentVariable("Path", "User")
}

# 2.3.2 installation directory
$nacos2Dir = "$env:USERPROFILE\.nacos\2.3.2"
if (-not (Test-Path $nacos2Dir)) {
    Write-Host "Starting deployment of Nacos 2.3.2" -ForegroundColor Cyan
    # -v specifies the older version 2.3.2
    nacos-setup -v 2.3.2
} else {
    Write-Host "Nacos 2.3.2 already exists, skipping deployment" -ForegroundColor Green
}#>

# 目标存放目录，路径对齐
$nacosRoot = "D:\WorkCode\WebReact"
$targetPath = "$nacosRoot\nacos-2.3.2"
$zipTemp = "$env:TEMP\nacos-2.3.2.zip"

# Check whether it is already installed; if so, skip download and extraction
if (Test-Path "$targetPath") {
    Write-Host "Nacos 2.3.2 already exists, starting directly" -ForegroundColor Green
}
else {
    Write-Host "Downloading the Nacos 2.3.2 package" -ForegroundColor Cyan
    # Download Nacos 2.3.2 package
    Invoke-WebRequest -Uri "https://github.com/alibaba/nacos/releases/download/2.3.2/nacos-server-2.3.2.zip" -OutFile $zipTemp -UseBasicParsing

    Write-Host "Extracting files to $targetPath" -ForegroundColor Cyan
    Expand-Archive -Path $zipTemp -DestinationPath $nacosRoot -Force
    # Remove temporary zip file
    Remove-Item $zipTemp -Force
}
