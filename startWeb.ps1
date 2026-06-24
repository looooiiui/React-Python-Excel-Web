Write-Host start Backend

#================后端程序====================
Write-Host start InterfaceServer
. .\Backend\Server\startInterface.ps1

Write-Host start LoginSystem
. .\Backend\Server\LoginSystem\startLoginServer.ps1

Write-Host start WebApiInfo
. .\Backend\Server\InformationSystem\WebApiInfo\startNormalInfo.ps1

Write-Host start ProjectionServer
. .\Backend\Server\InformationSystem\ProjectionServer\startProjectionServer.ps1

Write-Host start ArticleServer
. .\Backend\Server\InformationSystem\ArticleServer\startArticleServer.ps1

Write-Host start AiSystem
. .\Backend\Server\AiSystem\startAiSystem.ps1

Write-Host start TrainingServer
. .\Backend\Server\TrainingSystem\startTrainSystem.ps1

Write-Host start ResourceServer
. .\Backend\Server\ResourceServer\startResourceSystem.ps1

#================前端启动==============

Write-Host start frontend
. .\src\startFrontend.ps1


