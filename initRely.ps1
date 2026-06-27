
# 脚本最顶部强制控制台编码，消除中文符号乱码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null
$env:PYTHONUTF8 = 1
$env:PYTHONIOENCODING = "utf-8"

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

# 目标存放目录
$nacosRoot = Split-Path $projectRoot -Parent
$targetPath = Join-Path $nacosRoot "nacos-2.3.2"
$zipTemp = Join-Path $env:TEMP "nacos-2.3.2.zip"
$tempUnzip = Join-Path $env:TEMP "nacos-tmp"

# 目标存放目录，路径对齐
if (Test-Path (Join-Path $targetPath "bin\startup.cmd")) {
    Write-Host "Nacos 2.3.2 already exists, starting directly" -ForegroundColor Green
}
else {
    Write-Host "Start downloading the Nacos 2.3.2 zip file" -ForegroundColor Cyan
    # 下载残留删除
    if(Test-Path $zipTemp){ Remove-Item $zipTemp -Force }
    # github下载，虽然下的很慢
    Invoke-WebRequest -Uri "https://github.com/alibaba/nacos/releases/download/2.3.2/nacos-server-2.3.2.zip" -OutFile $zipTemp -UseBasicParsing -TimeoutSec 120

    Write-Host "Extracting files to $targetPath" -ForegroundColor Cyan
    $tempUnzip = "$env:TEMP\nacos-tmp"
    if(Test-Path $tempUnzip){Remove-Item $tempUnzip -Recurse -Force}
    Expand-Archive -Path $zipTemp -DestinationPath $tempUnzip -Force

    # 移动内部 nacos 文件夹并重命名为 nacos-2.3.2
    $innerNacos = "$tempUnzip\nacos"
    Move-Item -Path $innerNacos -Destination $targetPath -Force

    # 清理临时文件
    Remove-Item $zipTemp -Force
    Remove-Item $tempUnzip -Recurse -Force
    Write-Host "Extraction complete, directory: $targetPath" -ForegroundColor Green
}


# 这里就不自动启动了，放后面
<# 
Set-Location "$targetPath\bin"
.\startup.cmd -m standalone 
#>

# MySQL CE 一键检测+安装脚本
$mysqlAppId = "Oracle.MySQL"

# 检查 winget 是否可用
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "winget was not detected, so MySQL CE can't be installed automatically. Please install it manually or enable the Windows package management feature." -ForegroundColor Yellow
}
else {
    # 检查本机是否已安装 MySQL Community Server
    winget list --id $mysqlAppId -e > $null 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Detected that MySQL Community Server is already installed, skipping download and installation" -ForegroundColor Green
    }
    else {
        Write-Host "Detected that MySQL CE is not installed, starting automatic installation" -ForegroundColor Cyan
        winget install --id $mysqlAppId -e --accept-source-agreements --accept-package-agreements
        if ($LASTEXITCODE -eq 0) {
            Write-Host "MySQL CE installation completed" -ForegroundColor Green
        }
        else {
            Write-Host "MySQL CE installation failed. Please check your network/permissions and consider running the terminal as an administrator." -ForegroundColor Red
            Write-Host "If the issue persists, please download and install manually from: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Yellow
        }
    }
}

# MySQL全局配置
$mysqlPwd = "!Qq3303220151"
# 兼容powershell 5.X
$mysqlCmd = Get-Command mysql.exe -ErrorAction SilentlyContinue
if ($mysqlCmd) {
    $mysqlBin = $mysqlCmd.Source
} else {
    $mysqlBin = $null
}
if (-not $mysqlBin) {
    $possibleMysqlBins = @(
        "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe",
        "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe",
        "C:\Program Files (x86)\MySQL\MySQL Server 5.7\bin\mysql.exe"
    )
    $mysqlBin = $possibleMysqlBins | Where-Object { Test-Path $_ } | Select-Object -First 1
}

if (-not $mysqlBin) {
    Write-Host "Error: MySQL executable file mysql.exe not found. Please ensure MySQL is installed and added to PATH or manually set `$mysqlBin." -ForegroundColor Red
    exit 1
}

# ---------------------- 业务库初始化 ----------------------
$useSql = Join-Path $ProjectRoot "initConf\WebSql.sql"
# 校验业务SQL文件是否存在
if (-not (Test-Path $useSql)) {
    Write-Host "Error: Business SQL file does not exist $useSql" -ForegroundColor Red
} else {
    # 创建两个业务库
    & $mysqlBin -uroot -p"$mysqlPwd" -e "CREATE DATABASE IF NOT EXISTS my_project DEFAULT CHARACTER SET utf8mb4;"
    $createExit1 = $LASTEXITCODE
    & $mysqlBin -uroot -p"$mysqlPwd" -e "CREATE DATABASE IF NOT EXISTS train_manage DEFAULT CHARACTER SET utf8mb4;"
    $createExit2 = $LASTEXITCODE

    # 关键修复：Get-Content 指定 UTF8 读取，中文不乱码
    Get-Content $useSql -Encoding UTF8 | & $mysqlBin -uroot -p"$mysqlPwd" my_project
    $importExit1 = $LASTEXITCODE
    Get-Content $useSql -Encoding UTF8 | & $mysqlBin -uroot -p"$mysqlPwd" train_manage
    $importExit2 = $LASTEXITCODE

    if ($createExit1 -eq 0 -and $createExit2 -eq 0 -and $importExit1 -eq 0 -and $importExit2 -eq 0) {
        Write-Host "✅ MySQL databases and tables initialized successfully (Databases: my_project, train_manage)" -ForegroundColor Green
    } else {
        Write-Host "❌ MySQL business database init failed, check above error logs" -ForegroundColor Red
    }
}

# ---------------------- Nacos专用库初始化 ----------------------
$nacosDb = "nacos_config"
$nacosSql = Join-Path $targetPath "conf\mysql-schema.sql"
# 校验Nacos官方SQL文件
if (-not (Test-Path $nacosSql)) {
    Write-Host "Error: Nacos schema SQL file does not exist $nacosSql" -ForegroundColor Red
} else {
    & $mysqlBin -uroot -p"$mysqlPwd" -e "CREATE DATABASE IF NOT EXISTS $nacosDb DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    $nacosCreateExit = $LASTEXITCODE

    # 同样加 -Encoding UTF8 读取官方SQL
    Get-Content $nacosSql -Encoding UTF8 | & $mysqlBin -uroot -p"$mysqlPwd" $nacosDb
    $nacosImportExit = $LASTEXITCODE

    if ($nacosCreateExit -eq 0 -and $nacosImportExit -eq 0) {
        Write-Host "Nacos database nacos_config table structure import completed" -ForegroundColor Green
    } else {
        Write-Host "Nacos database init failed, check above error logs" -ForegroundColor Red
    }
}