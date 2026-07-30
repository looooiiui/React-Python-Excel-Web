##[Ps1 To Exe]
##
##Kd3HDZOFADWE8uO1
##Nc3NCtDXTlGDjoXa8T9U6k/rfl8ubPeeuLWz+LO5/un49hXAXZIbRxlSjir5CAaKXPAuReAXuNgSaRsrOfsI7byeEuSmJQ==
##Kd3HFJGZHWLWoLaVvnQnhQ==
##LM/RF4eFHHGZ7/K1
##K8rLFtDXTiW5
##OsHQCZGeTiiZ4dI=
##OcrLFtDXTiW5
##LM/BD5WYTiiZ4tI=
##McvWDJ+OTiiZ4tI=
##OMvOC56PFnzN8u+Vs1Q=
##M9jHFoeYB2Hc8u+Vs1Q=
##PdrWFpmIG2HcofKIo2QX
##OMfRFJyLFzWE8uK1
##KsfMAp/KUzWJ0g==
##OsfOAYaPHGbQvbyVvnQX
##LNzNAIWJGmPcoKHc7Do3uAuO
##LNzNAIWJGnvYv7eVvnQX
##M9zLA5mED3nfu77Q7TV64AuzAgg=
##NcDWAYKED3nfu77Q7TV64AuzAgg=
##OMvRB4KDHmHQvbyVvnQX
##P8HPFJGEFzWE8tI=
##KNzDAJWHD2fS8u+Vgw==
##P8HSHYKDCX3N8u+Vgw==
##LNzLEpGeC3fMu77Ro2k3hQ==
##L97HB5mLAnfMu77Ro2k3hQ==
##P8HPCZWEGmaZ7/K1
##L8/UAdDXTlGDjoXa8T9U6k/rfl8ubPeeuLWz+LO5/un49hXAXZIbRxlSjir5CAaKXPAuYvAXh8UQRwlkKuoOgg==
##Kc/BRM3KXxU=
##
##
##fd6a9f26a06ea3bc99616d4851b372ba
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


