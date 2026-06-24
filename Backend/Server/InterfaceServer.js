const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const port = 5001;

//=======================自定义工具===============================
const { DebugTool } = require('../../src/Util/DebugTool/DebugTool');
//===============================================================
const { CONSTPARAM } = require("./Core/CONST/CONST");

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: '100kb' }));


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
    try {
        const { serverName } = req.body;
        if (!serverName) {
            return res.status(400).json({ msg: "serverName 不能为空" });
        }

        const instances = await naming.selectInstances(serverName);
        const targetInstance = instances?.length > 0 ? instances : [{ ip: "127.0.0.1", port: "8080" }];
        const instance = targetInstance[0];

        DebugTool.debugLog(`服务[${serverName}]选中实例：${instance.ip}:${instance.port}`);
        res.json({
            url: `http://${instance.ip}:${instance.port}`
        });
    } catch (err) {
        DebugTool.debugLog("获取Nacos实例异常：", err);
        // 异常时直接返回本地兜底地址
        res.json({
            url: "http://127.0.0.1:8080"
        });
    }
})
// 启动监听
app.listen(port, async () => {
    DebugTool.debugLog("接口后端运行中");
    var test = await getNacosConfig();
    DebugTool.debugLog("后端调取: " + JSON.stringify(test));
});