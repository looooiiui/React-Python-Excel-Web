import { useState } from "react";
import Register from "../page/LoginSystem/Register";
import { DebugTool } from "../Util/DebugTool/DebugTool";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CONSTPARAM from "../Core/CONST/CONST";


const loginVerifyURL = "/user/login";
const registerVerifyURL = "/user/register";
const adminBanURL = "/ban"

// 基本账户信息
let accountInfo = { "accountId": "" };
let accountOnlineState = false;
let isAdmin = false;

//============基本常量========================================

const NORMALPARMA = "0";
const ADMINPARMA = "1";

//=========================基本返回码======================
const BACKERROR = 99;   // 程序异常

//=================信息中心初始化=========================
initializeAccountInfo();
//=======================================================

export class InfomationSystem {

    // 账户信息发送(登录，注册)
    // param 为管理员变量
    // "0" 为登录
    // "1" 为注册
    // "2" 为管理员登录
    static sentAccountInfo(accountId, password, param, callback) {
        accountInfo.accountId = String(accountId).trim();

        DebugTool.debugLog("前端信息中心: 账号信息接收数组: " + JSON.stringify(accountInfo));
        DebugTool.debugLog("前端信息中心: 后端地址: " + CONSTPARAM.LOGINIP + CONSTPARAM.LOGINBASE);

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

    // 封禁指令发出
    static sendBanOperator(accountId, callback) {
        accountId = String(accountId).trim();
        DebugTool.debugLog("前端信息中心: 账号信息接收账户名: " + accountId);
        DebugTool.debugLog("前端信息中心: 后端地址: " + CONSTPARAM.LOGINIP + CONSTPARAM.LOGINBASE + adminBanURL);

        sendBanInfo(accountId, callback);
    }

    // 项目加入指令发出
    static sendJoinProjectionOper(projectionId, callback) {
        DebugTool.debugLog("前端信息中心: 接收加入项目ID: " + projectionId);
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.LOGINIP}${CONSTPARAM.LOGINBASE}${loginVerifyURL}`);

        // 确认加入身份
        let isAdminInt = "0";
        if (isAdmin) {
            isAdminInt = "2";
        }

        sendJoinProjection(projectionId, isAdminInt, callback);
    }

    // 项目退出指令发出
    static exitProjectOper(projectId, callback) {
        DebugTool.debugLog("前端信息中心: 接收退出项目ID: " + projectId);
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/info/delete`);

        exitProject(projectId, callback);
    }

    // 项目删除指令发出
    static deleteProjectOper(projectId, callback) {
        projectId = Number(projectId);

        DebugTool.debugLog("前端信息中心: 接收删除项目ID: " + projectId);
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/info/delete`);

        deleteProject(projectId, callback);
    }

    // 信息修改指令发出
    static sendChangeOperator(changeInfo, param, callback) {
        changeInfo = String(changeInfo).trim();
        DebugTool.debugLog("前端信息中心: 接收修改信息名: " + changeInfo);
        DebugTool.debugLog("前端信息中心: 后端地址: " + CONSTPARAM.LOGINIP + CONSTPARAM.LOGINBASE + CONSTPARAM.USERBASEURL + CONSTPARAM.INFOCHANGEURL);

        sendChangeInfo(changeInfo, param, callback);
    }

    // 验证项目加入状态
    static veriftProjectJoinState(projectId, callback) {
        let accountId = accountInfo.accountId

        DebugTool.debugLog("前端信息中心: 接收验证项目名: " + projectId);
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/oper/projectDelete`);

        verifyProjectJoin(accountId, projectId, callback);
    }

    // 向AI发送聊天信息
    static chatMessageToAi(prompt, callback) {
        DebugTool.debugLog("前端信息中心: 向AI发送消息: ");
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.AIASSISTANTURL}/chat`);

        sendMessageToAi(prompt, callback);
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
    let sendInfo = { accountId, password, adminParam };

    // 发送验证请求
    axios.post(`${CONSTPARAM.LOGINIP}${CONSTPARAM.LOGINBASE}${loginVerifyURL}`, sendInfo, {
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

// 加入项目请求
function sendJoinProjection(projectionId, isAdminInt, callback) {
    let accountId = String(accountInfo.accountId);
    let isAdmin = String(isAdminInt);
    projectionId = Number(projectionId);
    DebugTool.debugLog("前端信息中心: 尝试加入项目: 项目ID: " + projectionId);

    // 建立发送字典
    let sendInfo = { accountId, projectionId, isAdmin };

    axios.post(`${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/oper/join`, sendInfo, {
        timeout: 5000
    })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: 项目加入请求成功, 后端返回: " + JSON.stringify(res.data));
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 项目加入请求失败: " + err.message + JSON.stringify(err.response?.data));
            callback(BACKERROR);
            return BACKERROR;
        });
}

// 退出项目请求
function exitProject(projectId, callback) {
    let accountId = String(InfomationSystem.getCurrentLoginInfo().accountId);
    projectId = Number(projectId);
    DebugTool.debugLog("前端信息中心: 尝试退出项目: 项目ID: " + projectId);

    // 建立发送字典
    let sendInfo = { accountId, projectId };

    // 发送请求
    axios.post(`${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/info/delete`, sendInfo, {
        timeout: 5000
    })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: 项目退出请求成功, 后端返回: " + JSON.stringify(res.data));
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 项目退出请求失败: " + err.message + JSON.stringify(err.response?.data));
            callback(BACKERROR);
            return BACKERROR;
        });
}

// 删除项目请求
function deleteProject(projectId, callback) {
    projectId = Number(projectId);
    DebugTool.debugLog("前端信息中心: 尝试退出项目: 项目ID: " + projectId);

    // 建立发送字典
    let sendInfo = { projectId };

    // 发送请求
    axios.post(`${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/oper/projectDelete`, sendInfo, {
        timeout: 5000
    })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: 项目删除请求成功, 后端返回: " + JSON.stringify(res.data));
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 项目删除请求成功: " + err.message + JSON.stringify(err.response?.data));
            callback(BACKERROR);
            return BACKERROR;
        });
}


// 发送更改请求
function sendChangeInfo(changeInfo, param, callback) {
    let accountId = accountInfo.accountId;
    DebugTool.debugLog("前端信息中心: 更改信息状态: " + param)

    // 建立发送字典
    let sendInfo = { accountId, changeInfo, param };

    // 发送更改请求
    axios.post(`${CONSTPARAM.LOGINIP}${CONSTPARAM.LOGINBASE}${CONSTPARAM.USERBASEURL}${CONSTPARAM.INFOCHANGEURL}`, sendInfo, {
        timeout: 5000
    })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: 修改请求成功, 后端返回: " + JSON.stringify(res.data));
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 修改请求失败: " + err.message + err.response?.data);
            callback(BACKERROR);
            return BACKERROR;
        });
}

// 发送封禁请求
function sendBanInfo(accountId, callback) {
    // 验证身份
    if (!isAdmin) {
        DebugTool.debugLog("前端信息中心: 封禁请求失败: 账户不为管理员");
        callback(BACKERROR);
        return BACKERROR;
    }

    accountId = String(accountId);
    // 建立发送字典
    let sendInfo = { accountId };
    axios.post(`${CONSTPARAM.LOGINIP}${CONSTPARAM.LOGINBASE}${CONSTPARAM.ADMINBASE}${adminBanURL}`, sendInfo, {
        timeout: 5000
    })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: 封禁请求成功, 后端返回: " + JSON.stringify(res.data));
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 封禁请求失败: " + err.message + err.response?.data);
            callback(BACKERROR);
            return BACKERROR;
        });
}

// 发送注册检测
function sendRegisterInfo(accountId, password, callback) {
    accountId = String(accountId);
    password = String(password);
    // 建立发送字典
    let sendInfo = { accountId, password };

    // 发送验证请求
    axios.post(`${CONSTPARAM.LOGINIP}${CONSTPARAM.LOGINBASE}${registerVerifyURL}`, sendInfo, {
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

// 判断项目加入状态
function verifyProjectJoin(accountId, projectId, callback) {
    let listUrl = `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/oper/verify`;

    let sendInfo = { accountId, projectId }
    // 返回的全部项目
    axios.post(listUrl, sendInfo, {
        timeout: 5000
    })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: 验证请求成功, 后端返回: " + res.data);
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 验证请求失败: " + err.message + err.response?.data);
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

// 向AI发送信息
function sendMessageToAi(prompt, callback) {
    let listUrl = `${CONSTPARAM.AISYSTEMIP}${CONSTPARAM.AIASSISTANTURL}/chat`;
    let sendInfo = { prompt }

    // 向AI发送消息
    axios.post(listUrl, sendInfo, {
        timeout: 60000
    })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: AI请求成功, 后端返回: " + res.data);
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 验证请求失败: " + err.message + JSON.stringify(err.response?.data));
            callback(BACKERROR);
            return BACKERROR;
        });
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

