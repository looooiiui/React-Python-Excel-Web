import axios from "axios";
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import CONSTPARAM from "../../Core/CONST/CONST";
import { InfomationSystem } from "../InfomationSystem";

// ========== 用户账号系统底层请求（对应后端WebApi.py /info/accountInfo 全套CRUD） ==========
// 1. 获取全部用户列表
export function sendGetAllAccount(callback) {
    const url = `${CONSTPARAM.INFOIP}${CONSTPARAM.LOGINBASE}/info/accountInfo`;
    axios.get(url, { timeout: 5000 })
        .then((res) => {
            DebugTool.debugLog("前端UserOper: 获取全部用户列表成功，后端返回：" + res.data);
            callback(res.data);
        })
        .catch((err) => {
            DebugTool.debugLog("前端UserOper: 获取全部用户列表失败：" + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
        });
}

// 2. 根据账号ACCOUNTID 查询单用户详情
export function sendGetAccountDetail(accountId, callback) {
    accountId = String(accountId);
    const url = `${CONSTPARAM.INFOIP}${CONSTPARAM.LOGINBASE}/info/accountInfo/${accountId}`;
    axios.get(url, { timeout: 5000 })
        .then((res) => {
            DebugTool.debugLog("前端UserOper: 获取用户详情成功，账号：" + accountId + " 返回：" + JSON.stringify(res.data));
            callback(res.data);
        })
        .catch((err) => {
            DebugTool.debugLog("前端UserOper: 获取用户详情失败：" + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
        });
}

// 3. 新增用户
export function sendAddAccount(accountId, password, name, admin, permission, callback) {
    accountId = String(accountId);
    password = String(password);
    name = String(name);
    admin = String(admin ?? "0");
    permission = Number(permission ?? 0);

    const sendInfo = {
        ACCOUNTID: accountId,
        PASSWORD: password,
        NAME: name,
        ADMIN: admin,
        PERMISSION: permission
    };
    const url = `${CONSTPARAM.INFOIP}${CONSTPARAM.LOGINBASE}/info/accountInfo/add`;
    axios.post(url, sendInfo, { timeout: 5000 })
        .then((res) => {
            DebugTool.debugLog("前端UserOper: 新增用户成功，账号：" + accountId + " 返回：" + JSON.stringify(res.data));
            callback(res.data);
        })
        .catch((err) => {
            DebugTool.debugLog("前端UserOper: 新增用户失败：" + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
        });
}

// 4. 更新编辑用户（仅传需要修改字段即可）
export function sendUpdateAccount(accountId, updateData, callback) {
    accountId = String(accountId);
    const sendInfo = { ...updateData };
    const url = `${CONSTPARAM.INFOIP}${CONSTPARAM.LOGINBASE}/info/accountInfo/update/${accountId}`;
    axios.post(url, sendInfo, { timeout: 5000 })
        .then((res) => {
            DebugTool.debugLog("前端UserOper: 更新用户成功，账号：" + accountId + " 返回：" + JSON.stringify(res.data));
            callback(res.data);
        })
        .catch((err) => {
            DebugTool.debugLog("前端UserOper: 更新用户失败：" + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
        });
}

// 5. 删除用户
export function sendDeleteAccount(accountId, callback) {
    accountId = String(accountId);
    const url = `${CONSTPARAM.INFOIP}${CONSTPARAM.LOGINBASE}/info/accountInfo/delete/${accountId}`;
    axios.post(url, {}, { timeout: 5000 })
        .then((res) => {
            DebugTool.debugLog("前端UserOper: 删除用户成功，账号：" + accountId + " 返回：" + JSON.stringify(res.data));
            callback(res.data);
        })
        .catch((err) => {
            DebugTool.debugLog("前端UserOper: 删除用户失败：" + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
        });
}