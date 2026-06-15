import axios from "axios";
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import CONSTPARAM from "../../Core/CONST/CONST";
// 引入主类用于读取全局常量/状态
import { InfomationSystem } from "../InfomationSystem";

// 发送登录检测
export function sendLoginInfo(accountId, password, callback, adminParam) {
    accountId = String(accountId);
    password = String(password);
    adminParam = String(adminParam);
    DebugTool.debugLog("前端信息中心: 发送管理员状态: " + adminParam)

    let sendInfo = { accountId, password, adminParam };
    const url = `${CONSTPARAM.LOGINIP}${CONSTPARAM.LOGINBASE}${InfomationSystem.getLoginVerifyURL()}`;
    axios.post(url, sendInfo, { timeout: 5000 })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: 登录请求成功, 后端返回: " + JSON.stringify(res.data));
            InfomationSystem.verifyLoginSuccess(res.data, accountId, password, adminParam);
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 登录请求失败: " + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
            return InfomationSystem.getBackError();
        });
}

// 加入项目请求
export function sendJoinProjection(projectionId, isAdminInt, callback) {
    const accountInfo = InfomationSystem.getCurrentLoginInfo();
    let accountId = String(accountInfo.accountId);
    let isAdmin = String(isAdminInt);
    projectionId = Number(projectionId);
    DebugTool.debugLog("前端信息中心: 尝试加入项目: 项目ID: " + projectionId);

    let sendInfo = { accountId, projectionId, isAdmin };
    const url = `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/oper/join`;
    axios.post(url, sendInfo, { timeout: 5000 })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: 项目加入请求成功, 后端返回: " + JSON.stringify(res.data));
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 项目加入请求失败: " + err.message + JSON.stringify(err.response?.data));
            callback(InfomationSystem.getBackError());
            return InfomationSystem.getBackError();
        });
}

// 退出项目请求
export function exitProject(projectId, callback) {
    const accountInfo = InfomationSystem.getCurrentLoginInfo();
    let accountId = String(accountInfo.accountId);
    projectId = Number(projectId);
    DebugTool.debugLog("前端信息中心: 尝试退出项目: 项目ID: " + projectId);

    let sendInfo = { accountId, projectId };
    const url = `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/info/delete`;
    axios.post(url, sendInfo, { timeout: 5000 })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: 项目退出请求成功, 后端返回: " + JSON.stringify(res.data));
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 项目退出请求失败: " + err.message + JSON.stringify(err.response?.data));
            callback(InfomationSystem.getBackError());
            return InfomationSystem.getBackError();
        });
}

// 删除项目请求
export function deleteProject(projectId, callback) {
    projectId = Number(projectId);
    DebugTool.debugLog("前端信息中心: 尝试删除项目: 项目ID: " + projectId);
    let sendInfo = { projectId };
    const url = `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/oper/projectDelete`;
    axios.post(url, sendInfo, { timeout: 5000 })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: 项目删除请求成功, 后端返回: " + JSON.stringify(res.data));
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 项目删除请求失败: " + err.message + JSON.stringify(err.response?.data));
            callback(InfomationSystem.getBackError());
            return InfomationSystem.getBackError();
        });
}

// 发送更改信息请求
export function sendChangeInfo(changeInfo, param, callback) {
    const accountInfo = InfomationSystem.getCurrentLoginInfo();
    let accountId = accountInfo.accountId;
    DebugTool.debugLog("前端信息中心: 更改信息状态: " + param)
    let sendInfo = { accountId, changeInfo, param };
    const url = `${CONSTPARAM.LOGINIP}${CONSTPARAM.LOGINBASE}${CONSTPARAM.USERBASEURL}${CONSTPARAM.INFOCHANGEURL}`;
    axios.post(url, sendInfo, { timeout: 5000 })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: 修改请求成功, 后端返回: " + JSON.stringify(res.data));
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 修改请求失败: " + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
            return InfomationSystem.getBackError();
        });
}

// 发送封禁管理员请求
export function sendBanInfo(accountId, callback) {
    if (!InfomationSystem.getAdminState()) {
        DebugTool.debugLog("前端信息中心: 封禁请求失败: 账户不为管理员");
        callback(InfomationSystem.getBackError());
        return InfomationSystem.getBackError();
    }
    accountId = String(accountId);
    let sendInfo = { accountId };
    const url = `${CONSTPARAM.LOGINIP}${CONSTPARAM.LOGINBASE}${CONSTPARAM.ADMINBASE}${InfomationSystem.getAdminBanURL()}`;
    axios.post(url, sendInfo, { timeout: 5000 })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: 封禁请求成功, 后端返回: " + JSON.stringify(res.data));
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 封禁请求失败: " + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
            return InfomationSystem.getBackError();
        });
}

// 发送注册请求
export function sendRegisterInfo(accountId, password, callback) {
    accountId = String(accountId);
    password = String(password);
    let sendInfo = { accountId, password };
    const url = `${CONSTPARAM.LOGINIP}${CONSTPARAM.LOGINBASE}${InfomationSystem.getRegisterVerifyURL()}`;
    axios.post(url, sendInfo, { timeout: 5000 })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: 注册请求成功, 后端返回: " + JSON.stringify(res.data));
            InfomationSystem.verifyLoginSuccess(res.data, accountId, password, InfomationSystem.getNormalParma());
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 注册请求失败: " + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
            return InfomationSystem.getBackError();
        });
}

// 验证用户项目加入状态
export function verifyProjectJoin(accountId, projectId, callback) {
    const url = `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/oper/verify`;
    let sendInfo = { accountId, projectId }
    axios.post(url, sendInfo, { timeout: 5000 })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: 验证请求成功, 后端返回: " + res.data);
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: 验证请求失败: " + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
            return InfomationSystem.getBackError();
        });
}

// 添加项目
export function addProject(projectData, callback) {
    const url = `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/oper/add`;
    axios({
        method: "POST",
        url: url,
        data: projectData
    }).then(res => {
        callback(res.data);
    }).catch(err => {
        DebugTool.debugLog("添加项目请求异常：" + err);
    });
}

// 编辑项目
export function editProject(editData, callback) {
    const url = `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/oper/edit`;
    axios({
        method: "POST",
        url: url,
        data: editData
    }).then(res => {
        callback(res.data);
    }).catch(err => {
        DebugTool.debugLog("编辑项目请求异常：" + err);
    });
}

// AI聊天请求
export function sendMessageToAi(prompt, callback) {
    const listUrl = `${CONSTPARAM.AISYSTEMIP}${CONSTPARAM.AIASSISTANTURL}/chat`;
    let sendInfo = { prompt }
    axios.post(listUrl, sendInfo, { timeout: 60000 })
        .then((res) => {
            DebugTool.debugLog("前端信息中心: AI请求成功, 后端返回: " + res.data);
            callback(res.data);
            return res.data;
        })
        .catch((err) => {
            DebugTool.debugLog("前端信息中心: AI请求失败: " + err.message + JSON.stringify(err.response?.data));
            callback(InfomationSystem.getBackError());
            return InfomationSystem.getBackError();
        });
}

// ========== 文章系统底层请求 ==========
// 获取全部文章
export function sendGetAllArticle(callback) {
    const url = `${CONSTPARAM.ARTICLESYSTEMIP}${CONSTPARAM.ARTICLEBASE}/info/all`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端信息中心: 获取文章列表成功，后端返回：" + res.data);
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端信息中心: 获取文章列表失败：" + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
        });
}

// 获取单篇文章详情
export function sendGetArticleDetail(articleId, callback) {
    const url = `${CONSTPARAM.ARTICLESYSTEMIP}${CONSTPARAM.ARTICLEBASE}/info/${articleId}`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端信息中心: 获取文章详情成功，后端返回：" + res.data);
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端信息中心: 获取文章详情失败：" + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
        });
}

// 新增文章
export function sendAddArticle(title, content, authorId, callback) {
    const url = `${CONSTPARAM.ARTICLESYSTEMIP}${CONSTPARAM.ARTICLEBASE}/add`;
    const sendInfo = { title, content, author_id: authorId };
    axios.post(url, sendInfo, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端信息中心: 发布文章成功，后端返回：" + JSON.stringify(res.data));
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端信息中心: 发布文章失败：" + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
        });
}

// 更新编辑文章
export function sendUpdateArticle(articleId, title, content, callback) {
    const url = `${CONSTPARAM.ARTICLESYSTEMIP}${CONSTPARAM.ARTICLEBASE}/update/${articleId}`;
    const sendInfo = { title, content };
    axios.post(url, sendInfo, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端信息中心: 编辑文章成功，后端返回：" + JSON.stringify(res.data));
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端信息中心: 编辑文章失败：" + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
        });
}

// 删除文章
export function sendDeleteArticle(articleId, callback) {
    const url = `${CONSTPARAM.ARTICLESYSTEMIP}${CONSTPARAM.ARTICLEBASE}/delete/${articleId}`;
    axios.post(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端信息中心: 删除文章成功，后端返回：" + JSON.stringify(res.data));
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端信息中心: 删除文章失败：" + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
        });
}