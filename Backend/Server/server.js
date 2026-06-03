const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

//=======================自定义工具===============================
const { DebugTool } = require('../../src/Util/DebugTool/DebugTool');
//账户登录系统验证
const { pythonVerify } = require("./LoginSystem/LoginSystem");
const { transmitArgvConvert } = require("./LoginSystem/LoginSystem");
const { verifyAccountNotEmpty } = require("./LoginSystem/LoginSystem");
const { convertVerifyInfo } = require("./LoginSystem/LoginSystem");
//===============================================================


app.use(cors());
app.use(express.json());

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
const WEBSUCCESSCODE = 200;         // 后端请求处理成功
const WEBARGVERROR = 400;           // 传入参数错误
const WEBONLINEERROR = 401;         // 未登录 
const WEBPERMESSIONERROR = 403;     // 后端权限错误
const WEBEXISTERROR = 404;          // 后端存在错误
const WEBSERVERERROR = 500;         // 后端服务器错误
//==============================================

//==============运行返回值======================
const ACCOUNT_INFO_INCOMPLETE = 11    // 后端账户不全

// 登录信息送入
app.post('/api/user/login', async (req, res) => {
    try {
        // 获取账户信息
        const { accountId, password, adminParam } = req.body;

        DebugTool.debugLog("后端主程序: 接收登录参数: " + adminParam);
        // 检验输入账号或者密码是否为空
        if (!verifyAccountNotEmpty(accountId, password)) {
            return res.json({
                "code": WEBSUCCESSCODE,
                "message": "账户密码不能为空",
                "data": ACCOUNT_INFO_INCOMPLETE
            });
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
        return res.status(500).json({
            "code": WEBSERVERERROR,
            "message": "校验错误",
            "data": "-3"
        });
    }

});

// 注册信息送入
app.post('/api/user/register', async (req, res) => {
    try {
        // 获取账户信息
        const { accountId, password } = req.body;

        // 检验输入账号或者密码是否为空
        if (!verifyAccountNotEmpty(accountId, password)) {
            return res.json({
                "code": WEBSUCCESSCODE,
                "message": "账户密码不能为空",
                "data": ACCOUNT_INFO_INCOMPLETE
            });
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
        return res.status(500).json({
            "code": WEBSERVERERROR,
            "message": "校验错误",
            "data": "-3"
        });
    }
});

// 启动监听
app.listen(port, () => {
    console.log("后端运行中");
});

