. .\Backend\const.ps1

# 接口服务启动路径拼接
$ServerStartPath = Join-Path $startPath $LocProjectionServer

Write-Host  GetInterfaceServerPath :: $ServerStartPath

# 拼接启动命令
$UsePath = Join-Path $ServerStartPath $ProjectionServerAgent
$UseCmd = "node " + $UsePath

$UseRealPath = Join-Path $ServerStartPath $ProjectionServer
$UseRealCmd = "python " + $UseRealPath
Write-Host startWebApiAgentServer

Start-Process powershell `
    -ArgumentList "-NoExit", $UseCmd

Start-Process powershell `
    -ArgumentList "-NoExit", $UseRealCmd

