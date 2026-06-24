. .\Backend\const.ps1

# 接口服务启动路径拼接
$ServerStartPath = Join-Path $startPath $LocResourceServer

Write-Host  GetResourceServerPath :: $ServerStartPath

# 拼接启动命令
$UsePath = Join-Path $ServerStartPath $ResourceServerAgent
$UseCmd = "node " + $UsePath

$UseRealPath = Join-Path $ServerStartPath $ResourceServer
$UseRealCmd = "python " + $UseRealPath
Write-Host startResourceSystemAgentServer

Start-Process powershell `
    -ArgumentList "-NoExit", $UseCmd

Start-Process powershell `
    -ArgumentList "-NoExit", $UseRealCmd

