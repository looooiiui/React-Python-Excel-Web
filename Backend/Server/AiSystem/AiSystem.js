const express = require('express');
const cors = require('cors');
const axios = require("axios");
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const app = express();
const port = 5004;

//=======================自定义工具===============================
const { DebugTool } = require('../../../src/Util/DebugTool/DebugTool');
//===============================================================
const { CONSTPARAM } = require("../Core/CONST/CONST");

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: '200kb' }));

//AI 接口限流
const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: "AI 请求过于频繁"
});
app.use(`${CONSTPARAM.AISYSTEMBASEURL}`, aiLimiter);


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
        CONSTPARAM.AISYSTEMSERVER,
        { ip: CONSTPARAM.CONNECTIP, port: port },
    );
})()

//=================================================
const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";
const MODEL_NAME = "normal-assistant:latest";

//===================AI聊天接口======================
app.post(`${CONSTPARAM.AISYSTEMBASEURL}/chat`, async (req, res) => {
    try {
        const { prompt } = req.body;

        // 校验是否是数组格式
        if (!Array.isArray(prompt)) {
            return res.status(400).json({ error: "传入信息不为数组" });
        }

        const validPrompt = prompt.filter(item =>
            item.content && item.content.trim()
        );

        if (validPrompt.length === 0) {
            return res.status(400).json({ "error": "对话内容不能为空" });
        }

        DebugTool.debugLog("AI系统后端接收消息: " + JSON.stringify(validPrompt))

        const response = await axios.post(OLLAMA_URL, {
            model: MODEL_NAME,
            messages: validPrompt,
            stream: false
        }, { timeout: 60000 });

        res.json({ response: response.data.message.content });
    } catch (error) {
        DebugTool.debugLog("调用Ollama异常: " + error.message);
        res.status(500).json({ error: "AI服务调用失败:" + error.message });
    }
});

// 启动监听
app.listen(port, async () => {
    DebugTool.debugLog("AI服务启动成功");
});
