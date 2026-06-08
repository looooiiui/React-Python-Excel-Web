const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { DebugTool } = require('../../../src/Util/DebugTool/DebugTool');

//=========Python执行路径(绝对路径)==========
const pythonPath = path.join(__dirname, "./PythonExcel/FileProcessingMain.py");
const accountExcelPath = path.join(__dirname, "./PythonExcel/AccountInfomation.xlsx");

//==========验证参数===================
const LOGINPARAM = "0";         // 登录请求参数 
const REGISTERPARAM = "1";      // 注册请求操作
const ADMINBANOPERATOR = "3"    // 封禁指令
//=========登录信息校验基本信息返回映射表============
const LOGINMAP = {
    "-3": "后端程序运行出错",
    "0": "登录成功",
    "1": "账号信息不存在",
    "2": "账号信息验证错误（信息不全/密码错误）",
    "3": "当前账户等级为管理员",
    "4": "当前账户不为管理员账户",
    "5": "当前账户被封禁",
};
const REGISTERMAP = {
    "-3": "后端程序运行出错",
    "-1": "服务器校验脚本出错",
    "0": "注册成功",
    "1": "账号注册出现问题(非法字符/账户密码问题)",
    "2": "账户已被注册"
};

// 调用Python更改封禁状态(4参数)
async function pythonBanOperator(accountId) {
    try {
        // ========格式化入形式为字符串==============
        var transmitParma = ADMINBANOPERATOR;
        accountId = String(accountId);
        var cmd = `python "${pythonPath}" "${accountExcelPath}" "${transmitParma}" "${accountId}"`;

        DebugTool.debugLog("执行命令：" + cmd);

        const { stdout, stderr } = await execAsync(cmd);

        if (stderr) {
            DebugTool.debugLog("Python: 脚本报错:" + stderr);
            return "-3";
        }

        // 处理结果交出
        const result = stdout.trim();
        DebugTool.debugLog("Python: 输出: " + result);
        return result;

        // 程序异常
    } catch (error) {
        DebugTool.debugLog("Python: 执行错误: " + error);
        return "-3";
    }
}

// 调用Python修改账户信息
async function pythonInfoChange(accountId, changeInfo, param) {
    try {
        // ========格式化入形式为字符串==============
        var transmitParma = String(param);
        accountId = String(accountId);
        changeInfo = String(changeInfo);
        var cmd = `python "${pythonPath}" "${accountExcelPath}" "${transmitParma}" "${accountId}" "${changeInfo}"`;

        DebugTool.debugLog("执行命令：" + cmd);

        // 等待程序执行完成
        const { stdout, stderr } = await execAsync(cmd);

        if (stderr) {
            DebugTool.debugLog("Python: 脚本报错:" + stderr);
            return "-3";
        }

        // 处理结果交出
        const result = stdout.trim();
        DebugTool.debugLog("Python: 输出: " + result);
        return result;

        // 程序异常
    } catch (error) {
        DebugTool.debugLog("Python: 执行错误: " + error);
        return "-3";
    }
}

// 调用Python验证账户状态
async function pythonVerify(accountId, password, param) {
    try {
        // ========格式化入形式为字符串==============
        var transmitParma = String(param);
        accountId = String(accountId);
        password = String(password);
        var cmd = `python "${pythonPath}" "${accountExcelPath}" "${transmitParma}" "${accountId}" "${password}"`;

        DebugTool.debugLog("执行命令：" + cmd);

        // 等待程序执行完成
        const { stdout, stderr } = await execAsync(cmd);

        if (stderr) {
            DebugTool.debugLog("Python: 脚本报错:" + stderr);
            return "-3";
        }

        // 处理结果交出
        const result = stdout.trim();
        DebugTool.debugLog("Python: 输出: " + result);
        return result;

        // 程序异常
    } catch (error) {
        DebugTool.debugLog("Python: 执行错误: " + error);
        return "-3";
    }
}

// 格式化Python传回参数为后端传出参数
// 预留，用于同一管理返回值对应
// 由于Python的返回值已经符合要求，直接返回
function transmitArgvConvert(result) {
    var innerResult = String(result);
    return innerResult;
}

// 检查账户信息是否输入不全(账户或者密码为空)
function verifyAccountNotEmpty(accountId, password) {
    if (!accountId || !password) {
        return false;
    }
    return true;
}

// 将标准返回信息更改为对应账号验证信息(修改原值)
function convertVerifyInfo(resReturn, param) {
    try {
        // 确认键存在
        if (!("message" in resReturn)) {
            return;
        }
        // 确认验证列存在
        if (!("data" in resReturn)) {
            return;
        }

        // 获得对应信息参数
        var innerParam = String(param);
        var innerData = String(resReturn.data);

        // 登录转换请求
        if (innerParam == LOGINPARAM) {
            resReturn["message"] = LOGINMAP[innerData];
        }
        // 注册转换请求
        else if (innerParam == REGISTERPARAM) {
            resReturn["message"] = REGISTERMAP[innerData];
        }

    } catch (error) {
        DebugTool.debugLog("账户验证信息转换: 出现错误: " + error.message);
    }
}

module.exports = {
    pythonVerify,
    transmitArgvConvert,
    verifyAccountNotEmpty,
    convertVerifyInfo,
    pythonBanOperator,
    pythonInfoChange,
};