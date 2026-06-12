const express = require('express');
const cors = require('cors');
const axios = require("axios");
const helmet = require('helmet');
const app = express();
const port = 5004;

//=======================自定义工具===============================
const { DebugTool } = require('../../../src/Util/DebugTool/DebugTool');
//===============================================================
const { CONSTPARAM } = require("../Core/CONST/CONST");

app.use(cors());
app.use(express.json());
app.use(helmet());

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
const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const MODEL_NAME = "qwen2.5:7b-instruct-q4_K_M";

app.post("/ai/chat", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "prompt is required" });

        const response = await axios.post(OLLAMA_URL, {
            model: MODEL_NAME,
            prompt: prompt,
            stream: false
        }, { timeout: 60000 });

        res.json({ response: response.data.response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 启动监听
app.listen(port, async () => {
    DebugTool.debugLog("AI服务启动成功");
});
