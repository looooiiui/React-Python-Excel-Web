const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const port = 5001;

//=======================自定义工具===============================
const { DebugTool } = require('../../src/Util/DebugTool/DebugTool');
//===============================================================
const { CONSTPARAM } = require("./Core/CONST/CONST");

app.use(cors());
app.use(express.json());
app.use(helmet());

//=================Nacos服务初始化==================

const { NacosConfigClient, NacosNamingClient } = require("nacos");
const yaml = require("js-yaml");

const configClient = new NacosConfigClient({
    serverAddr: CONSTPARAM.NACOSURL,
    namespace: "public"
});

// 分组常量
const DATA_ID = "INTERFACE";
const GRUOP = "DEFAULT_GROUP";

// 主动获取Nacos配置
async function getNacosConfig() {
    const raw = await configClient.getConfig(DATA_ID, GRUOP);
    // 转换为Js对象
    const cfg = yaml.load(raw);
    return cfg;
}

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
        CONSTPARAM.INTERFACESERVER,
        { ip: CONSTPARAM.CONNECTIP, port: 5001 },
    );
})()


//=============================================

//===========获得服务接口地址===============
app.post(`${CONSTPARAM.INTERFACEURL}/getServerUrl`, async (req, res) => {
    const { serverName } = req.body;

    // 寻找 Nacos 实例
    const instances = await naming.selectInstances(
        serverName,
    );

    // 返回活着的第一个实例后端
    const instance = instances[0];
    res.json({
        url: `http://${instance.ip}:${instance.port}`
    });
});

// 启动监听
app.listen(port, async () => {
    DebugTool.debugLog("接口后端运行中");
    var test = await getNacosConfig();
    DebugTool.debugLog("后端调取: " + JSON.stringify(test));
});