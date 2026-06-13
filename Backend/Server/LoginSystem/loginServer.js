const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const port = 5000;

//=======================自定义工具===============================
const { DebugTool } = require('../../../src/Util/DebugTool/DebugTool');
//账户登录系统验证
const { pythonVerify } = require("./LoginSystem");
const { transmitArgvConvert } = require("./LoginSystem");
const { verifyAccountNotEmpty } = require("./LoginSystem");
const { convertVerifyInfo } = require("./LoginSystem");
const { pythonBanOperator } = require("./LoginSystem");
const { pythonInfoChange } = require("./LoginSystem");

//===============================================================
const { CONSTPARAM } = require("../Core/CONST/CONST");

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: '100kb' }));


/*
规定登录系统向前端的传参:

登录:
返回值说明:
- 元组第1位:是否校验通过(True=通过,False=不通过)
- 元组第2位:状态码
    - 0 : 账号验证通过
    - 1 : 账户信息不存在
    - 2 : 账号信息验证错误（信息不全/密码错误）

注册:
账户注册处理
返回-1: 程序运行出错
返回0 : 注册成功
返回1 : 账户注册出现问题(非法字符/账户密码问题)
返回2 : 账户已被注册

后端返回标准:
{
    "code":
    "message":
    "data":
}

*/

//==============标准后端返回=====================
const WEBSUCCESSCODE = CONSTPARAM.WEBSUCCESSCODE;         // 后端请求处理成功
const WEBARGVERROR = CONSTPARAM.WEBARGVERROR;           // 传入参数错误
const WEBONLINEERROR = CONSTPARAM.WEBONLINEERROR;         // 未登录 
const WEBPERMESSIONERROR = CONSTPARAM.WEBPERMESSIONERROR;     // 后端权限错误
const WEBEXISTERROR = CONSTPARAM.WEBEXISTERROR;          // 后端存在错误
const WEBSERVERERROR = CONSTPARAM.WEBSERVERERROR;         // 后端服务器错误
//==============================================

//==============运行返回值======================
const ACCOUNT_INFO_INCOMPLETE = 11    // 后端账户不全
//=============================================


//=================Nacos服务初始化==================

const { NacosConfigClient, NacosNamingClient } = require("nacos");
const yaml = require("js-yaml");

const configClient = new NacosConfigClient({
    serverAddr: CONSTPARAM.NACOSURL,
    namespace: "public"
});

// 分组常量
const DATA_ID = "LOGINPARAM";
const GRUOP = "LOGIN_GROUP";

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
        CONSTPARAM.LOGINSERVER,
        { ip: CONSTPARAM.CONNECTIP, port: 5000 },
    );
})()

//=============================================
/*
    后端传入Python参数与Python脚本内处理参数一致
    Param 对应参数以及效果:
    "0": 验证普通用户
    "1": 注册普通用户
    "2": 验证管理员用户
*/

// 登录信息送入
app.post(`${CONSTPARAM.BACKENDBASEURL}/user/login`, async (req, res) => {
    try {
        // 获取账户信息
        const { accountId, password, adminParam } = req.body;

        DebugTool.debugLog("后端主程序: 接收登录参数: " + adminParam);
        // 检验输入账号或者密码是否为空
        if (!verifyAccountNotEmpty(accountId.trim(), password.trim())) {
            let response = CONSTPARAM.backendResponse(WEBSUCCESSCODE, "账户密码不能为空", ACCOUNT_INFO_INCOMPLETE);
            return res.send(response);
        }

        // 等待命令完成(登录校验传入"0"代表普通登录, 传入"1"为管理员登录)
        if (adminParam == "0") {
            const result = await pythonVerify(accountId, password, "0");
            var returnValue = transmitArgvConvert(result);
        }
        else if (adminParam == "1") {
            const result = await pythonVerify(accountId, password, "2");
            var returnValue = transmitArgvConvert(result);
        }

        // 原始返回结果
        var originalResult = {
            "code": WEBSUCCESSCODE,
            "message": "校验完成",
            "data": returnValue
        }
        // 处理后返回结果
        convertVerifyInfo(originalResult, "0");

        // 返回结果
        return res.json(originalResult);

    } catch (err) {
        let response = CONSTPARAM.backendResponse(WEBSERVERERROR, "校验错误", "-3");
        return res.status(500).send(response);
    }
});

// 注册信息送入
app.post(`${CONSTPARAM.BACKENDBASEURL}/user/register`, async (req, res) => {
    try {
        // 获取账户信息
        const { accountId, password } = req.body;

        // 检验输入账号或者密码是否为空
        if (!verifyAccountNotEmpty(accountId.trim(), password.trim())) {
            let response = CONSTPARAM.backendResponse(WEBSUCCESSCODE, "账户密码不能为空", ACCOUNT_INFO_INCOMPLETE);
            return res.send(response);
        }

        // 等待命令完成
        const result = await pythonVerify(accountId, password, "1");
        var returnValue = transmitArgvConvert(result);

        // 原始返回结果
        var originalResult = {
            "code": WEBSUCCESSCODE,
            "message": "校验完成",
            "data": returnValue
        }
        // 处理后返回结果
        convertVerifyInfo(originalResult, "1");

        // 返回结果
        return res.json(originalResult);

    } catch (err) {
        let response = CONSTPARAM.backendResponse(WEBSERVERERROR, "校验错误", "-3");
        return res.status(500).send(response);
    }
});

// 封禁请求送入
app.post(`${CONSTPARAM.BACKENDBASEURL}/admin/ban`, async (req, res) => {
    try {
        // 获取账户信息
        const { accountId } = req.body;

        // 等待命令完成
        const result = await pythonBanOperator(accountId)
        var returnValue = transmitArgvConvert(result);

        // 原始返回结果
        var originalResult = {
            "code": WEBSUCCESSCODE,
            "message": returnValue == "0" ? "封禁完成" : "封禁失败",
            "data": returnValue
        }

        // 返回结果
        return res.json(originalResult);

    } catch (err) {
        let response = CONSTPARAM.backendResponse(WEBSERVERERROR, "校验错误", "-3");
        return res.status(500).send(response);
    }
})

// 信息更改请求送入
app.post(`${CONSTPARAM.BACKENDBASEURL}/user/infochange`, async (req, res) => {
    try {
        // 获取账户信息
        const { accountId, changeInfo, param } = req.body;

        // 等待命令完成
        const result = await pythonInfoChange(accountId, changeInfo, param);
        var returnValue = transmitArgvConvert(result);

        // 原始返回结果
        var originalResult = {
            "code": WEBSUCCESSCODE,
            "message": returnValue == "0" ? "信息更新完成" : "信息更新失败",
            "data": returnValue
        }

        // 返回结果
        return res.json(originalResult);
    } catch (error) {
        let response = CONSTPARAM.backendResponse(WEBSERVERERROR, "信息更新错误", returnValue);
        return res.status(500).send(response);
    }
})

// 启动监听
app.listen(port, async () => {
    console.log("登录后端运行中");
    var test = await getNacosConfig();
    DebugTool.debugLog("后端调取: " + JSON.stringify(test));
});

