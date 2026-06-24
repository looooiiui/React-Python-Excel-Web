
# 接口服务启动路径拼接
$ServerStartPath = $PSScriptRoot

Write-Host  GetInterfaceServerPath :: $ServerStartPath

# 拼接启动命令
$UsePath = Join-Path $ServerStartPath "loginServer.js"
$UseCmd = "node " + $UsePath
Write-Host startLoginServer

Start-Process powershell `
    -ArgumentList "-NoExit", $UseCmd 