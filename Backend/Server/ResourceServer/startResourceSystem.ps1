
# 接口服务启动路径拼接
$ServerStartPath = $PSScriptRoot

Write-Host  GetResourceServerPath :: $ServerStartPath

# 拼接启动命令
$UsePath = Join-Path $ServerStartPath "ResourceServerAgent.js"
$UseCmd = "node " + $UsePath

$UseRealPath = Join-Path $ServerStartPath "ResourceServer.py"
$UseRealCmd = "python " + $UseRealPath
Write-Host startResourceSystemAgentServer

Start-Process powershell `
    -ArgumentList "-NoExit", $UseCmd

Start-Process powershell `
    -ArgumentList "-NoExit", $UseRealCmd

