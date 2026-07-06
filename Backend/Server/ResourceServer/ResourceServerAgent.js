const express       = require('express');
const cors          = require('cors');
const app = express();
const port = 4008;

//=======================自定义工具===============================
const { DebugTool }     = require('../../../src/Util/DebugTool/DebugTool');
//===============================================================
const { CONSTPARAM }    = require("../Core/CONST/CONST");

app.use(cors());
app.use(express.json({ limit: '100mb' }));

//=================Nacos服务初始化==================

const { NacosConfigClient, NacosNamingClient } = require("nacos");

// 初始注册服务
const naming = new NacosNamingClient({
    serverList: CONSTPARAM.NACOSURL,
    namespace: "public",
    logger: console
});

// 注册
(async () => {
    await naming.ready()
    await naming.registerInstance(
        CONSTPARAM.RESOURCESERVER,
        { 
            ip: CONSTPARAM.CONNECTIP, 
            port: 5009,
            ephemeral: false, 
        },    
    );
})()

// 启动监听
app.listen(port, async () => {
    DebugTool.debugLog("代理信息存储后端运行中");
});