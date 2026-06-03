import Register from "../page/LoginSystem/Register";
import { DebugTool } from "../Util/DebugTool/DebugTool";
import axios from "axios";


// 后端基址
const baseURL = 'http://26.224.10.101:5000/api';
const loginVerifyURL = "/user/login";
const registerVerifyURL = "/user/register";

// 基本账户信息
var accountInfo = { "accountId": "" };
var accountOnlineState = false;

//=================基本返回码===============//
const BACKERROR = 99;   // 程序异常

export class InfomationSystem {

    // 账户信息发送(登录，注册)
    static sentAccountInfo(accountId, password, param, callback) {
        accountInfo.accountId = String(accountId).trim();

        DebugTool.debugLog("前端信息中心: 账号信息接收数组: " + JSON.stringify(accountInfo));
        DebugTool.debugLog("前端信息中心: 后端地址: " + baseURL + loginVerifyURL);

        // 发送对应类型检测
        if (param == 0) {
            sendLoginInfo(accountId, password, callback, "0");
        } else if (param == 1) {
            sendRegisterInfo(accountId, password, callback);
        } else if (param == 2) {
            sendLoginInfo(accountId, password, callback, "1");
        }
    }
    // 得到当前登录状态
    static getCurrentLoginState() {
        return accountOnlineState;
    }

    // 得到当前登录信息(副本)
    static getCurrentLoginInfo() {
        const ObjCopy = { ...accountInfo };
        DebugTool.debugLog("前端信息中心: 向前端其他页面发送当前登录信息: " + JSON.stringify(ObjCopy));
        return ObjCopy;
    }

    // 清空当前账户ID状态
    static clearOnlineState() {
        accountInfo = { "accountId": "" };
        accountOnlineState = false
    }
}

// 发送登录检测
function sendLoginInfo(accountId, password, callback, adminParam) {
    accountId = String(accountId);
    password = String(password);
    adminParam = String(adminParam);
    DebugTool.debugLog("前端信息中心: 发送管理员状态: " + adminParam)

    // 建立发送字典
    var sendInfo = { accountId, password, adminParam };

    // 发送验证请求
    axios.post(baseURL + loginVerifyURL, sendInfo, {
        timeout: 5000
    })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: 登录请求成功, 后端返回: " + JSON.stringify(res.data));
            // 更新登录状态
            verifyLoginSuccess(res.data, accountId, password);
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 登录请求失败: " + err.message + err.response?.data);
            callback(BACKERROR);
            return BACKERROR;
        });
}

// 发送注册检测
function sendRegisterInfo(accountId, password, callback) {
    accountId = String(accountId);
    password = String(password);
    // 建立发送字典
    var sendInfo = { accountId, password };

    // 发送验证请求
    axios.post(baseURL + registerVerifyURL, sendInfo, {
        timeout: 5000
    })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: 注册请求成功, 后端返回: " + JSON.stringify(res.data));
            // 更新登录状态
            verifyLoginSuccess(res.data, accountId, password);
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 注册请求失败: " + err.message + err.response?.data);
            callback(BACKERROR);
            return BACKERROR;
        });
}

// 判断登录成功用于更改状态
function verifyLoginSuccess(resultData, accountId, password) {
    if (!("data" in resultData)) {
        return;
    }

    // 登录或注册成功更新状态
    if (resultData.data == "0") {
        accountInfo.accountId = accountId;
        accountOnlineState = true;
        DebugTool.debugLog("前端信息中心: 账户登录成功: " + accountId);
    }
}