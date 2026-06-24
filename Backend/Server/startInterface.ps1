
# 接口服务启动路径拼接
$ServerStartPath = Join-Path $startPath $LocInterfaceServer

Write-Host  GetInterfaceServerPath :: $ServerStartPath

# 拼接启动命令
$UsePath = Join-Path $ServerStartPath $InterfaceServer
$UseCmd = "node " + $UsePath
Write-Host startInterface

Start-Process powershell `
    -ArgumentList "-NoExit", $UseCmd