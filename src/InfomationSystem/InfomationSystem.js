import Register from "../page/LoginSystem/Register";
import { DebugTool } from "../Util/DebugTool/DebugTool";
import axios from "axios";


// 后端基址
const baseURL = 'http://localhost:5000/api';
const loginVerifyURL = "/user/login";
const registerVerifyURL = "/user/register";

// 基本账户信息
var accountInfo = { accountId: "", password: "" };

//=================基本返回码===============//
const BACKERROR = 99;   // 程序异常

export class InfomationSystem {

    // 账户信息发送(登录，注册)
    static sentAccountInfo(accountId, password, param, callback) {
        accountInfo.accountId = String(accountId).trim();
        accountInfo.password = String(password).trim();

        DebugTool.debugLog("账号信息接收数组: " + JSON.stringify(accountInfo));
        DebugTool.debugLog(baseURL + loginVerifyURL);

        // 发送对应类型检测
        if (param == 0) {
            sendLoginInfo(accountId, password, callback);
        } else if (param == 1) {
            sendRegisterInfo(accountId, password, callback);
        }
    }
}

// 发送注册检测
function sendLoginInfo(accountId, password, callback) {
    accountId = String(accountId);
    password = String(password);
    // 建立发送字典
    var sendInfo = { accountId, password };

    // 发送验证请求
    axios.post(baseURL + loginVerifyURL, sendInfo, {
        timeout: 5000
    })
        .then((res) => {
            DebugTool.debugLog("登录请求成功, 后端返回: " + JSON.stringify(res.data));
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("登录请求失败: ", err.message, err.response?.data);
            callback(BACKERROR);
            return BACKERROR;
        });
}

// 发送登录检测
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
            DebugTool.debugLog("注册请求成功, 后端返回: " + JSON.stringify(res.data));
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("注册请求失败: ", err.message, err.response?.data);
            callback(BACKERROR);
            return BACKERROR;
        });
}