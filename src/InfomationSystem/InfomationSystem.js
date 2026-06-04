import { useState } from "react";
import Register from "../page/LoginSystem/Register";
import { DebugTool } from "../Util/DebugTool/DebugTool";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CONSTPARAM from "../Core/CONST/CONST";


// 后端基址
const baseURL = 'http://26.224.10.101:5000/api';
const loginVerifyURL = "/user/login";
const registerVerifyURL = "/user/register";

// 基本账户信息
var accountInfo = { "accountId": "" };
var accountOnlineState = false;
var isAdmin = false;

//============基本常量========================================

const NORMALPARMA = "0";
const ADMINPARMA = "1";

//=========================基本返回码======================//
const BACKERROR = 99;   // 程序异常

initializeAccountInfo();

export class InfomationSystem {

    // 账户信息发送(登录，注册)
    // param 为管理员变量
    // "0" 为登录
    // "1" 为注册
    // "2" 为管理员登录
    static sentAccountInfo(accountId, password, param, callback) {
        accountInfo.accountId = String(accountId).trim();

        DebugTool.debugLog("前端信息中心: 账号信息接收数组: " + JSON.stringify(accountInfo));
        DebugTool.debugLog("前端信息中心: 后端地址: " + baseURL + loginVerifyURL);

        // 发送对应类型检测
        // "0" 为登录中普通登录
        // "1" 为登录中管理员登录
        if (param === 0) {
            sendLoginInfo(accountId, password, callback, NORMALPARMA);
        } else if (param === 1) {
            sendRegisterInfo(accountId, password, callback);
        } else if (param === 2) {
            sendLoginInfo(accountId, password, callback, ADMINPARMA);
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

    // 得到当前管理员状态
    static getAdminState() {
        return isAdmin;
    }

    // 清空当前账户ID状态
    static clearOnlineState() {
        accountInfo = { "accountId": "" };
        accountOnlineState = false
        isAdmin = false;
    }

    // 退出登录
    static logout() {
        localStorage.removeItem("loginUser");
        localStorage.removeItem("isAdmin");
        this.clearOnlineState();
        DebugTool.debugLog("前端信息中心: 当前登录状态: " + accountOnlineState);
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
            verifyLoginSuccess(res.data, accountId, password, adminParam);
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
            verifyLoginSuccess(res.data, accountId, password, NORMALPARMA);
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
function verifyLoginSuccess(resultData, accountId, password, adminState) {
    if (!("data" in resultData)) {
        return;
    }

    // 登录或注册成功更新状态
    if (resultData.data === "0") {
        accountInfo.accountId = accountId;
        accountOnlineState = true;

        // 验证管理员权限
        if (adminState === ADMINPARMA) {
            isAdmin = true;
        }
        if (adminState === NORMALPARMA) {
            isAdmin = false;
        }

        storeAccountInfo(accountId, isAdmin);
        DebugTool.debugLog("前端信息中心: 账户登录成功: " + accountId);
        DebugTool.debugLog("前端信息中心: 当前登录管理员权限: " + isAdmin);

    }
}

// 存储网页信息
function storeAccountInfo(accountId, isAdmin) {
    localStorage.setItem("loginUser", accountId);
    localStorage.setItem("isAdmin", isAdmin);
    DebugTool.debugLog("前端信息中心: 存储账户信息");
}

// 初始化网页信息
function initializeAccountInfo() {
    const userId = localStorage.getItem("loginUser");
    const admin = localStorage.getItem("isAdmin");

    if (userId) {
        accountInfo = { "accountId": userId };
        accountOnlineState = true;
    } else {
        accountInfo = { "accountId": "" };
        accountOnlineState = false;
    }

    isAdmin = admin === "true";

    DebugTool.debugLog("前端信息中心: 初始化读取账户信息: " + JSON.stringify(accountInfo) + " 管理员：" + isAdmin);
}
