Write-Host start Backend

#================后端程序====================
Write-Host start InterfaceServer
.\startInterface.ps1

Write-Host start LoginSystem
.\startLoginServer.ps1

Write-Host start WebApiInfo
.\startNormalInfo.ps1

Write-Host start ProjectionServer
.\startProjectionServer.ps1

Write-Host start ArticleServer
.\startArticleServer.ps1

Write-Host start AiSystem
.\startAiSystem.ps1

Write-Host start TrainingServer
.\startTrainSystem.ps1
#================前端启动==============

Write-Host start frontend
..\src\startFrontend.ps1


