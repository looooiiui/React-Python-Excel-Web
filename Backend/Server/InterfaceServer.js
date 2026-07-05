const express       = require('express');
const cors          = require('cors');
const helmet        = require('helmet');
const morgan        = require('morgan');
const http          = require('http');
const httpProxy     = require('http-proxy');
const app = express();
const port = 5001;

//=======================自定义工具===============================
const { DebugTool }     = require('../../src/Util/DebugTool/DebugTool');
//===============================================================
const { CONSTPARAM }    = require("./Core/CONST/CONST");

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

//=================Nacos服务初始化==================

const { NacosConfigClient, NacosNamingClient } = require("nacos");
const yaml = require("js-yaml");

const serverCache = new Map();    // 可以使用的实例
const serviceList = [
    "Login-Server", 
    "Info-Server", 
    "Ai-Server",
    "Article-Server", 
    "Training-Server", 
    "Resource-Server", 
    "Projection-Server"
];
const hostServiceMap = {
    "api"                   : "Login-Server",
    "info"                  : "Info-Server",
    "aiAssistant"           : "Ai-Server",
    "article"               : "Article-Server",
    "train"                 : "Training-Server",
    "resource"              : "Resource-Server",
    "project"               : "Projection-Server"
};

// 分组常量
const DATA_ID = "INTERFACE";
const GRUOP = "DEFAULT_GROUP";
const configClient = new NacosConfigClient({
    serverAddr: CONSTPARAM.NACOSURL,
    namespace: "public"
});

const proxy = httpProxy.createProxyServer({
    agent: new http.Agent({ keepAlive: false }),
    timeout: 60000,
    proxyTimeout: 60000
});

// 捕获代理失败，防止进程崩溃
proxy.on("error", (err, req, res) => {
    res.end(JSON.stringify({
        data: -1,
        code: 12,
        msg: "后端服务连接失败"
    }));
});

// 新增：给所有代理返回资源添加跨域资源策略头
proxy.on("proxyRes", (proxyRes, req, res) => {
    // 关键头，解决页面COEP拦截内嵌图片
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
});

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
    logger: {
        info:   () => {},
        warn:   () => {},
        error:  () => {},
        debug:  () => {}
    }
});

// ============== Nacos订阅函数 =================
async function subscribeService(serviceName) {
    await naming.subscribe(serviceName, (instances) => {
        // 过滤下线实例与不健康实例
        const onlineInstances = instances.filter(instance => instance.healthy === true && instance.enabled === true);

        serverCache.set(serviceName, onlineInstances);
        let instanceHost = "无可用实例";
        if (Array.isArray(onlineInstances) && onlineInstances.length > 0) {
            instanceHost = `${onlineInstances[0].ip}:${onlineInstances[0].port}`;
        }
        DebugTool.debugLog(`服务[${serviceName}]实例变更: ${instanceHost}`);
        DebugTool.debugLog(`当前服务[${serviceName}]缓存实例列表: ${JSON.stringify(onlineInstances)}`);
    });
}

// ============= 负载选取节点 ==============
function pickWeightInstance(instances) {
    if (!instances || instances.length === 0) { 
        return null; 
    }
    // 第二次过滤
    const validInstances = instances.filter(instance => instance.healthy === true && instance.enabled === true);
    if (validInstances.length === 0) {
        return null;
    }

    // 计算总权重
    let totalWeight = instances.reduce((sum, instance) => sum + (instance.weight || 1), 0);
    // 随机选择一个权重值
    let randomWeight = Math.random() * totalWeight;
    for (let instance of instances) {
        randomWeight -= (instance.weight || 1);
        if (randomWeight <= 0) {
            return instance;
        }
    }
    return instances[0];
}

// 注册
(async () => {
    await naming.ready()

    // 注册接口服务
    await naming.registerInstance(
        CONSTPARAM.INTERFACESERVER,
        { ip: CONSTPARAM.CONNECTIP, port: 5001 },
    );
    // 订阅服务实例变更
    for (const serviceName of serviceList) {
        await subscribeService(serviceName);
    }
})()

// 5秒定时全量刷新所有服务实例缓存
setInterval(async () => {
    for (const serviceName of serviceList) {
        try {
            // getAllInstances：获取该服务全部原始实例（包含 enabled=false 手动下线、不健康实例）
            const allRawInstances = await naming.getAllInstances(serviceName);
            // DebugTool.debugLog(`${JSON.stringify(allRawInstances)}`);
            // 过滤：只保留手动上线 + 健康的实例
            const validOnlineInstances = allRawInstances.filter(ins => ins.enabled === true && ins.healthy === true);
            // 强制覆盖本地缓存，不管SDK推送有没有执行
            serverCache.set(serviceName, validOnlineInstances);
            DebugTool.debugLog(`[定时刷新] ${serviceName} 原始实例总数:${allRawInstances.length} 有效可用实例:${validOnlineInstances.length}`);
        } catch (err) {
            DebugTool.debugLog(`[定时刷新异常] ${serviceName} 获取实例失败:`, err);
        }
    }
}, 5000);

// =============== 路由代理发送 ==============
app.use("/:servicePrefix/", (req, res, next) => {
    const servicePrefix = req.params.servicePrefix;
    const serviceName = hostServiceMap[servicePrefix];
    if (!serviceName) return res.status(200).json({ 
        "msg": "服务前缀未注册",
        "code": CONSTPARAM.CODE_ERROR,
        "data": 11
    });
    
    const instances = serverCache.get(serviceName) || [];
    const instance = pickWeightInstance(instances);
    if (!instance) {
        return res.status(200).json({ 
            "msg": "服务实例未找到",
            "code": CONSTPARAM.CODE_ERROR,
            "data": 12
        });
    }

    const targetUrl = `http://${instance.ip}:${instance.port}`;
    DebugTool.debugLog(`代理请求到服务[${serviceName}]实例: ${targetUrl}`);

    req.url = req.originalUrl.replace("^", `/${servicePrefix}`);
    req.headers.connection = "close";

    // 动态转发目标，每次请求单独传 target，无初始化URL校验问题
    proxy.web(req, res, {
        target: targetUrl,
        changeOrigin: true
    });
})

// 启动监听
app.listen(port, async () => {
    DebugTool.debugLog("接口后端运行中");
    var test = await getNacosConfig();
    DebugTool.debugLog("后端调取: " + JSON.stringify(test));
});