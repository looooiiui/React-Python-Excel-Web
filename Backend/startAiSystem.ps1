. .\Backend\const.ps1

# 接口服务启动路径拼接
$ServerStartPath = Join-Path $startPath $LocAiSystem

Write-Host  GetInterfaceServerPath :: $ServerStartPath

# 拼接启动命令
$UsePath = Join-Path $ServerStartPath $AiSystem
$UseCmd = "node " + $UsePath
Write-Host startInterface

Start-Process powershell `
    -ArgumentList "-NoExit", $UseCmd 