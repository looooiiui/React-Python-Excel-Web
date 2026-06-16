import { useState } from "react";
import Register from "../page/LoginSystem/Register";
import { DebugTool } from "../Util/DebugTool/DebugTool";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CONSTPARAM from "../Core/CONST/CONST";

// 仅引入底层请求函数
import {
    sendLoginInfo,
    sendRegisterInfo,
    sendBanInfo,
    sendJoinProjection,
    exitProject,
    deleteProject,
    sendChangeInfo,
    verifyProjectJoin,
    addProject,
    editProject,
    sendMessageToAi,
    sendGetAllArticle,
    sendGetArticleDetail,
    sendAddArticle,
    sendUpdateArticle,
    sendDeleteArticle
} from "./NormalOper/NormalOper"

import {
    trainGetAllUser,
    trainGetUserById,
    trainAddUser,
    trainUpdateUser,
    trainDeleteUser,

    trainGetAllCourse,
    trainGetCourseById,
    trainAddCourse,
    trainUpdateCourse,
    trainDeleteCourse,

    trainGetAllClass,
    trainGetClassById,
    trainAddClass,
    trainUpdateClass,
    trainDeleteClass,

    trainGetAllEnroll,
    trainGetEnrollById,
    trainAddEnroll,
    trainUpdateEnroll,
    trainDeleteEnroll,
    trainGetEnrollByClass,
    trainGetEnrollByUser,

    trainGetAllAttendance,
    trainGetAttendanceById,
    trainAddAttendance,
    trainUpdateAttendance,
    trainDeleteAttendance,
    trainGetAttendanceByClass,

    trainGetAllScore,
    trainGetScoreById,
    trainAddScore,
    trainUpdateScore,
    trainDeleteScore,
    trainGetScoreByClass
} from "./TrainingOper/TrainingOper";

// 导入用户账号底层请求
import {
    sendGetAllAccount,
    sendGetAccountDetail,
    sendAddAccount,
    sendUpdateAccount,
    sendDeleteAccount
} from "./UserOper/UserOper"

// ====================== 接口地址常量（全部留在主文件） ======================
const loginVerifyURL = "/user/login";
const registerVerifyURL = "/user/register";
const adminBanURL = "/ban"

// 全局账户状态变量（全部留在主文件）
let accountInfo = { "accountId": "" };
let accountOnlineState = false;
let isAdmin = false;

//============业务常量========================================
const NORMALPARMA = "0";
const ADMINPARMA = "1";

//=========================返回码常量======================
const BACKERROR = 99;   // 程序异常

// ====================== 统一Getter静态方法，给子脚本读取 ======================
export class InfomationSystem {
    // 常量 Getter
    static getLoginVerifyURL() { return loginVerifyURL; }
    static getRegisterVerifyURL() { return registerVerifyURL; }
    static getAdminBanURL() { return adminBanURL; }
    static getNormalParma() { return NORMALPARMA; }
    static getAdminParma() { return ADMINPARMA; }
    static getBackError() { return BACKERROR; }

    // 全局状态 Getter
    static getCurrentLoginInfo() {
        const ObjCopy = { ...accountInfo };
        DebugTool.debugLog("前端信息中心: 向前端其他页面发送当前登录信息: " + JSON.stringify(ObjCopy));
        return ObjCopy;
    }
    static getCurrentLoginState() { return accountOnlineState; }
    static getAdminState() { return isAdmin; }

    // 内部工具方法（提供给NormalOper回调调用）
    static verifyLoginSuccess(resultData, accountId, password, adminState) {
        if (!("data" in resultData)) {
            return;
        }
        if (resultData.data === "0") {
            accountInfo.accountId = accountId;
            accountOnlineState = true;
            if (adminState === ADMINPARMA) {
                isAdmin = true;
            }
            if (adminState === NORMALPARMA) {
                isAdmin = false;
            }
            InfomationSystem.storeAccountInfo(accountId, isAdmin);
            DebugTool.debugLog("前端信息中心: 账户登录成功: " + accountId);
            DebugTool.debugLog("前端信息中心: 当前登录管理员权限: " + isAdmin);
        }
    }

    static storeAccountInfo(accountId, adminFlag) {
        localStorage.setItem("loginUser", accountId);
        localStorage.setItem("isAdmin", adminFlag);
        DebugTool.debugLog("前端信息中心: 存储账户信息");
    }

    static initializeAccountInfo() {
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

    // ========== 对外暴露业务操作方法（原有逻辑完全不变） ==========
    static sentAccountInfo(accountId, password, param, callback) {
        accountInfo.accountId = String(accountId).trim();
        DebugTool.debugLog("前端信息中心: 账号信息接收数组: " + JSON.stringify(accountInfo));
        DebugTool.debugLog("前端信息中心: 后端地址: " + CONSTPARAM.LOGINIP + CONSTPARAM.LOGINBASE);
        if (param === 0) {
            sendLoginInfo(accountId, password, callback, NORMALPARMA);
        } else if (param === 1) {
            sendRegisterInfo(accountId, password, callback);
        } else if (param === 2) {
            sendLoginInfo(accountId, password, callback, ADMINPARMA);
        }
    }

    static sendBanOperator(accountId, callback) {
        accountId = String(accountId).trim();
        DebugTool.debugLog("前端信息中心: 账号信息接收账户名: " + accountId);
        DebugTool.debugLog("前端信息中心: 后端地址: " + CONSTPARAM.LOGINIP + CONSTPARAM.LOGINBASE + adminBanURL);
        sendBanInfo(accountId, callback);
    }

    static sendJoinProjectionOper(projectionId, callback) {
        DebugTool.debugLog("前端信息中心: 接收加入项目ID: " + projectionId);
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.LOGINIP}${CONSTPARAM.LOGINBASE}${loginVerifyURL}`);
        let isAdminInt = "0";
        if (isAdmin) {
            isAdminInt = "2";
        }
        sendJoinProjection(projectionId, isAdminInt, callback);
    }

    static exitProjectOper(projectId, callback) {
        DebugTool.debugLog("前端信息中心: 接收退出项目ID: " + projectId);
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/info/delete`);
        exitProject(projectId, callback);
    }

    static deleteProjectOper(projectId, callback) {
        projectId = Number(projectId);
        DebugTool.debugLog("前端信息中心: 接收删除项目ID: " + projectId);
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/info/delete`);
        deleteProject(projectId, callback);
    }

    static sendChangeOperator(changeInfo, param, callback) {
        changeInfo = String(changeInfo).trim();
        DebugTool.debugLog("前端信息中心: 接收修改信息名: " + changeInfo);
        DebugTool.debugLog("前端信息中心: 后端地址: " + CONSTPARAM.LOGINIP + CONSTPARAM.LOGINBASE + CONSTPARAM.USERBASEURL + CONSTPARAM.INFOCHANGEURL);
        sendChangeInfo(changeInfo, param, callback);
    }

    static veriftProjectJoinState(projectId, callback) {
        let accountId = accountInfo.accountId
        DebugTool.debugLog("前端信息中心: 接收验证项目名: " + projectId);
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/oper/projectDelete`);
        verifyProjectJoin(accountId, projectId, callback);
    }

    static sendAddProjectOper(projectData, callback) {
        DebugTool.debugLog("前端信息中心: 接收添加项目数据");
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/oper/add`);
        addProject(projectData, callback);
    }

    static sendEditProjectOper(editData, callback) {
        DebugTool.debugLog("前端信息中心: 接收编辑项目数据");
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/oper/edit`);
        editProject(editData, callback);
    }

    static chatMessageToAi(prompt, callback) {
        DebugTool.debugLog("前端信息中心: 向AI发送消息: ");
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.AIASSISTANTURL}/chat`);
        sendMessageToAi(prompt, callback);
    }

    // 文章系统对外方法
    static getAllArticleOper(callback) {
        DebugTool.debugLog("前端信息中心: 请求获取全部文章列表");
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.ARTICLESYSTEMIP}${CONSTPARAM.ARTICLEBASE}/info/all`);
        sendGetAllArticle(callback);
    }
    static getArticleDetailOper(articleId, callback) {
        const id = Number(articleId);
        DebugTool.debugLog("前端信息中心: 请求文章详情,文章ID:" + id);
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.ARTICLESYSTEMIP}${CONSTPARAM.ARTICLEBASE}/info/${id}`);
        sendGetArticleDetail(id, callback);
    }
    static addArticleOper(title, content, callback) {
        const accountId = accountInfo.accountId;
        DebugTool.debugLog("前端信息中心: 请求发布新文章,作者ID:" + accountId);
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.ARTICLESYSTEMIP}${CONSTPARAM.ARTICLEBASE}/add`);
        sendAddArticle(title, content, accountId, callback);
    }
    static updateArticleOper(articleId, title, content, callback) {
        const id = Number(articleId);
        DebugTool.debugLog("前端信息中心: 请求编辑文章,文章ID:" + id);
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.ARTICLESYSTEMIP}${CONSTPARAM.ARTICLEBASE}/update/${id}`);
        sendUpdateArticle(id, title, content, callback);
    }
    static deleteArticleOper(articleId, callback) {
        const id = Number(articleId);
        DebugTool.debugLog("前端信息中心: 请求删除文章,文章ID:" + id);
        DebugTool.debugLog("前端信息中心: 后端地址: " + `${CONSTPARAM.ARTICLESYSTEMIP}${CONSTPARAM.ARTICLEBASE}/delete/${id}`);
        sendDeleteArticle(id, callback);
    }

    static clearOnlineState() {
        accountInfo = { "accountId": "" };
        accountOnlineState = false
        isAdmin = false;
    }

    static logout() {
        localStorage.removeItem("loginUser");
        localStorage.removeItem("isAdmin");
        this.clearOnlineState();
        DebugTool.debugLog("前端信息中心: 当前登录状态: " + accountOnlineState);
    }

    // ======== 培训模块全部对外静态方法 ========
    // ========== 用户模块 ==========
    static trainGetAllUserOper(callback) {
        DebugTool.debugLog("前端信息中心: 请求获取全部培训用户");
        DebugTool.debugLog("前端信息中心: 地址：" + `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/user/info/all`);
        trainGetAllUser(callback);
    }
    static trainGetUserDetailOper(userId, callback) {
        const id = Number(userId);
        DebugTool.debugLog("前端信息中心: 查询培训用户详情 ID:" + id);
        trainGetUserById(id, callback);
    }
    static trainAddUserOper(userData, callback) {
        DebugTool.debugLog("前端信息中心: 新增培训用户");
        trainAddUser(userData, callback);
    }
    static trainUpdateUserOper(userId, userData, callback) {
        const id = Number(userId);
        DebugTool.debugLog("前端信息中心: 更新培训用户 ID:" + id);
        trainUpdateUser(id, userData, callback);
    }
    static trainDeleteUserOper(userId, callback) {
        const id = Number(userId);
        DebugTool.debugLog("前端信息中心: 删除培训用户 ID:" + id);
        trainDeleteUser(id, callback);
    }

    // ========== 课程模块 ==========
    static trainGetAllCourseOper(callback) {
        DebugTool.debugLog("前端信息中心: 获取全部培训课程");
        trainGetAllCourse(callback);
    }
    static trainGetCourseDetailOper(courseId, callback) {
        const id = Number(courseId);
        DebugTool.debugLog("前端信息中心: 查询课程详情 ID:" + id);
        trainGetCourseById(id, callback);
    }
    static trainAddCourseOper(courseData, callback) {
        DebugTool.debugLog("前端信息中心: 新增培训课程");
        trainAddCourse(courseData, callback);
    }
    static trainUpdateCourseOper(courseId, courseData, callback) {
        const id = Number(courseId);
        DebugTool.debugLog("前端信息中心: 更新课程 ID:" + id);
        trainUpdateCourse(id, courseData, callback);
    }
    static trainDeleteCourseOper(courseId, callback) {
        const id = Number(courseId);
        DebugTool.debugLog("前端信息中心: 删除课程 ID:" + id);
        trainDeleteCourse(id, callback);
    }

    // ========== 班次模块 ==========
    static trainGetAllClassOper(callback) {
        DebugTool.debugLog("前端信息中心: 获取全部培训班次");
        trainGetAllClass(callback);
    }
    static trainGetClassDetailOper(classId, callback) {
        const id = Number(classId);
        DebugTool.debugLog("前端信息中心: 查询班次详情 ID:" + id);
        trainGetClassById(id, callback);
    }
    static trainAddClassOper(classData, callback) {
        DebugTool.debugLog("前端信息中心: 新增培训班次");
        trainAddClass(classData, callback);
    }
    static trainUpdateClassOper(classId, classData, callback) {
        const id = Number(classId);
        DebugTool.debugLog("前端信息中心: 更新班次 ID:" + id);
        trainUpdateClass(id, classData, callback);
    }
    static trainDeleteClassOper(classId, callback) {
        const id = Number(classId);
        DebugTool.debugLog("前端信息中心: 删除班次 ID:" + id);
        trainDeleteClass(id, callback);
    }

    // ========== 报名模块 ==========
    static trainGetAllEnrollOper(callback) {
        DebugTool.debugLog("前端信息中心: 获取全部报名记录");
        trainGetAllEnroll(callback);
    }
    static trainGetEnrollDetailOper(enrollId, callback) {
        const id = Number(enrollId);
        DebugTool.debugLog("前端信息中心: 查询单条报名 ID:" + id);
        trainGetEnrollById(id, callback);
    }
    static trainAddEnrollOper(enrollData, callback) {
        DebugTool.debugLog("前端信息中心: 新增报名记录");
        trainAddEnroll(enrollData, callback);
    }
    static trainUpdateEnrollOper(enrollId, enrollData, callback) {
        const id = Number(enrollId);
        DebugTool.debugLog("前端信息中心: 更新报名记录 ID:" + id);
        trainUpdateEnroll(id, enrollData, callback);
    }
    static trainDeleteEnrollOper(enrollId, callback) {
        const id = Number(enrollId);
        DebugTool.debugLog("前端信息中心: 删除报名记录 ID:" + id);
        trainDeleteEnroll(id, callback);
    }
    static trainGetEnrollByClassOper(classId, callback) {
        DebugTool.debugLog("前端信息中心: 根据班次查询报名");
        trainGetEnrollByClass(classId, callback);
    }
    static trainGetEnrollByUserOper(userId, callback) {
        DebugTool.debugLog("前端信息中心: 根据用户查询报名: id: " + userId);
        trainGetEnrollByUser(userId, callback);
    }

    // ========== 考勤模块 ==========
    static trainGetAllAttendanceOper(callback) {
        DebugTool.debugLog("前端信息中心: 获取全部考勤记录");
        trainGetAllAttendance(callback);
    }
    static trainGetAttendanceDetailOper(attId, callback) {
        const id = Number(attId);
        trainGetAttendanceById(id, callback);
    }
    static trainAddAttendanceOper(attData, callback) {
        trainAddAttendance(attData, callback);
    }
    static trainUpdateAttendanceOper(attId, attData, callback) {
        const id = Number(attId);
        trainUpdateAttendance(id, attData, callback);
    }
    static trainDeleteAttendanceOper(attId, callback) {
        const id = Number(attId);
        trainDeleteAttendance(id, callback);
    }
    static trainGetAttendanceByClassOper(classId, callback) {
        trainGetAttendanceByClass(classId, callback);
    }

    // ========== 成绩模块 ==========
    static trainGetAllScoreOper(callback) {
        DebugTool.debugLog("前端信息中心: 获取全部成绩记录");
        trainGetAllScore(callback);
    }
    static trainGetScoreDetailOper(scoreId, callback) {
        const id = Number(scoreId);
        trainGetScoreById(id, callback);
    }
    static trainAddScoreOper(scoreData, callback) {
        trainAddScore(scoreData, callback);
    }
    static trainUpdateScoreOper(scoreId, scoreData, callback) {
        const id = Number(scoreId);
        trainUpdateScore(id, scoreData, callback);
    }
    static trainDeleteScoreOper(scoreId, callback) {
        const id = Number(scoreId);
        trainDeleteScore(id, callback);
    }
    static trainGetScoreByClassOper(classId, callback) {
        trainGetScoreByClass(classId, callback);
    }

    // ===================== 新增：系统用户账号CRUD对外操作方法 =====================
    // 获取全部系统用户列表
    static getAllAccountOper(callback) {
        DebugTool.debugLog("前端信息中心：调用获取全部系统用户接口");
        sendGetAllAccount(callback);
    }

    // 根据账号ACCOUNTID 查询单条系统用户详情
    static getAccountDetailOper(accountId, callback) {
        DebugTool.debugLog("前端信息中心：调用查询系统用户详情接口，账号：" + accountId);
        sendGetAccountDetail(accountId, callback);
    }

    // 新增系统用户
    static addAccountOper(accountId, password, name, admin, permission, callback) {
        DebugTool.debugLog("前端信息中心：调用新增系统用户接口，账号：" + accountId);
        sendAddAccount(accountId, password, name, admin, permission, callback);
    }

    // 更新系统用户（仅传需要修改的字段）
    static updateAccountOper(accountId, updateData, callback) {
        DebugTool.debugLog("前端信息中心：调用更新系统用户接口，账号：" + accountId);
        sendUpdateAccount(accountId, updateData, callback);
    }

    // 删除系统用户
    static deleteAccountOper(accountId, callback) {
        DebugTool.debugLog("前端信息中心：调用删除系统用户接口，账号：" + accountId);
        sendDeleteAccount(accountId, callback);
    }
}

// 页面初始化执行
InfomationSystem.initializeAccountInfo();