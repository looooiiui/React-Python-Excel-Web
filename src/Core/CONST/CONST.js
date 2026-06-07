import { DebugTool } from "../../Util/DebugTool/DebugTool";
import axios from "axios";

// 全局常量存储
class CONSTPARAM {
    //==============URL===============================
    static MAINPAGEURL = "/MainPage"; // 主页面
    static LOGINURL = "/Login"; // 登录页面
    static ABOUTURL = "/Bbout"; // 关于
    static REGISTERURL = "/Register"; // 注册
    static USERBASEURL = "/user"; // 用户基址
    static USERPROFILE = "/profile"; // 简介基址

    //===================后端基址==========================
    static LOGINBASE = "/api";  // 登录基址
    static INTERFACEBASE = "/interface"; //接口基址
    static INFOBASE = "/info" // 信息基址
    //==================资源地址=====================
    static NavLogo = "/Logo/MainLogo/NavLogo/NavLogo.jpg";
    static MainBackgoundLogo = "Logo/MainLogo/BackgoundLogo/Backgound.PNG";
    //=================IP==================
    static INTERFACEIP = "http://26.224.10.101:5001";
    static INFOIP = "";
    static LOGINIP = "";
    //================Nacos服务名字=============
    static NACOSLOGIN = "Login-Server";
    static NACOSINFO = "Info-Server";
    static NACOSINTERFACE = "Interface-Server";
}
initializeLoginUrl()
initializeInfoUrl()

// 初始化网站与后端基址(登录系统)
async function initializeLoginUrl() {
    var sendName = { serverName: CONSTPARAM.NACOSLOGIN }
    // 获取接口定位
    const interfaceUrl = `${CONSTPARAM.INTERFACEIP}${CONSTPARAM.INTERFACEBASE}`;
    DebugTool.debugLog("前端信息中心: 拼接接口地址: " + interfaceUrl + "/getServerUrl");

    const { data } = await axios.post(`${interfaceUrl}/getServerUrl`, sendName);

    DebugTool.debugLog("前端信息中心: 获得后端基址: " + data.url);

    // 注入登录系统地址
    CONSTPARAM.LOGINIP = `${data.url}`;
    DebugTool.debugLog(`注入登录系统: ${CONSTPARAM.LOGINIP}`)
}

// 初始化网站与后端基址(信息系统)
async function initializeInfoUrl() {
    var sendName = { serverName: CONSTPARAM.NACOSINFO }
    // 获取接口定位
    const interfaceUrl = `${CONSTPARAM.INTERFACEIP}${CONSTPARAM.INTERFACEBASE}`;
    DebugTool.debugLog("前端信息中心: 拼接接口地址: " + interfaceUrl + "/getServerUrl");

    const { data } = await axios.post(`${interfaceUrl}/getServerUrl`, sendName);

    DebugTool.debugLog("前端信息中心: 获得后端基址: " + data.url);

    // 注入信息系统地址
    CONSTPARAM.INFOIP = `${data.url}`;
    DebugTool.debugLog(`注入信息系统: ${CONSTPARAM.INFOIP}`)
}

export default CONSTPARAM;