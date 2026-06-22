. .\Backend\const.ps1

# 接口服务启动路径拼接
$ServerStartPath = Join-Path $startPath $LocTrainingServer

Write-Host  GetInterfaceServerPath :: $ServerStartPath

# 拼接启动命令
$UsePath = Join-Path $ServerStartPath $TrainingServerAgent
$UseCmd = "node " + $UsePath

$UseRealPath = Join-Path $ServerStartPath $TrainingServer
$UseRealCmd = "python " + $UseRealPath
Write-Host startWebApiAgentServer

Start-Process powershell `
    -ArgumentList "-NoExit", $UseCmd

Start-Process powershell `
    -ArgumentList "-NoExit", $UseRealCmd

