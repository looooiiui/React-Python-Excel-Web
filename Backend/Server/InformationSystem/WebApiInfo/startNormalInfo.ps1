
# 接口服务启动路径拼接
$ServerStartPath = $PSScriptRoot

Write-Host  GetInterfaceServerPath :: $ServerStartPath

# 拼接启动命令
$UsePath = Join-Path $ServerStartPath "InfoAgent.js"
$UseCmd = "node " + $UsePath

$UseRealPath = Join-Path $ServerStartPath "WebApi.py"
$UseRealCmd = "python " + $UseRealPath
Write-Host startWebApiAgentServer

Start-Process powershell `
    -ArgumentList "-NoExit", $UseCmd

Start-Process powershell `
    -ArgumentList "-NoExit", $UseRealCmd

