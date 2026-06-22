Write-Host start Backend

#================后端程序====================
Write-Host start InterfaceServer
. .\Backend\startInterface.ps1

Write-Host start LoginSystem
. .\Backend\startLoginServer.ps1

Write-Host start WebApiInfo
. .\Backend\startNormalInfo.ps1

Write-Host start ProjectionServer
. .\Backend\startProjectionServer.ps1

Write-Host start ArticleServer
. .\Backend\startArticleServer.ps1

Write-Host start AiSystem
. .\Backend\startAiSystem.ps1

Write-Host start TrainingServer
. .\Backend\startTrainSystem.ps1

#================前端启动==============

Write-Host start frontend
. .\src\startFrontend.ps1


