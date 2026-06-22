<#
* ==================常量池================== * 
#>

Write-Host start Const Server

# 项目路径
$ProjectRoot = $PSScriptRoot
# 启动路径
$StartPath = Join-Path $ProjectRoot "\Server"

# =========================常量地址==============================
$LocInterfaceServer = "\"
$LocLoginServer = "\LoginSystem\"
$LocInfoAgent = "\InformationSystem\WebApiInfo\"
$LocNormalInfoSystem = "\InformationSystem\WebApiInfo\"
$LocProjectionServer = "\InformationSystem\ProjectionServer\"
$LocArticleServer = "\InformationSystem\ArticleServer\"
$LocTrainingServer = "\TrainingSystem"
$LocAiSystem = "\AiSystem\"

# =============================实际服务名==============================
$InterfaceServer = "InterfaceServer.js"
$LoginSystem = "loginServer.js"
$AiSystem = "AiSystem.js"
$TrainingServer = "TrainingServer.py"
$WebApiInfo = "WebApi.py"
$ProjectionServer = "ProjectionServer.py"
$ArticleServer = "ArticleServer.py"

# ======================代理服务=====================
$TrainingServerAgent = "TrainingServerAgent.js"
$WebApiInfoAgent = "InfoAgent.js"
$ProjectionServerAgent = "ProjectionServerAgent.js"
$ArticleServerAgent = "ArticleAgent.js"
