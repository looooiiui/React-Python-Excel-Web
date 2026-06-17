.\const.ps1

# 接口服务启动路径拼接
$ServerStartPath = Join-Path $startPath $LocLoginServer

Write-Host  GetInterfaceServerPath :: $ServerStartPath

# 拼接启动命令
$UsePath = Join-Path $ServerStartPath $LoginSystem
$UseCmd = "node " + $UsePath
Write-Host startLoginServer

Start-Process powershell `
    -ArgumentList "-NoExit", $UseCmd 