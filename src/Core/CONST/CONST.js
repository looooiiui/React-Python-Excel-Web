import { DebugTool } from "../../Util/DebugTool/DebugTool";
import axios from "axios";

// 全局常量存储
class CONSTPARAM {
    //==============URL===============================
    static MAINPAGEURL = "/MainPage"; // 主页面
    static LOGINURL = "/Login"; // 登录页面
    static ABOUTURL = "/Bbout"; // 关于
    static REGISTERURL = "/Register"; // 注册
    static ARTICLEURL = "/article"
    static INFOCHANGEURL = "/infochange"
    static USERBASEURL = "/user"; // 用户基址
    static USERPROFILE = "/profile"; // 简介基址
    static TRAINEEMANAGERURL = "/traineesManager" // 学员管理基址
    static SECURITYCENTERURL = "/securtiyCenter" // 安全中心基址
    static PROJECTIONCENTERURL = "/projectCenter" // 项目中心
    static AIASSISTANTURL = "/aiAssistant" // AI中心

    //===================后端基址==========================
    static ADMINBASE = "/admin"; //管理基址
    static LOGINBASE = "/api";  // 登录基址
    static INTERFACEBASE = "/interface"; //接口基址
    static INFOBASE = "/info" // 信息基址
    static PROJECTBASE = "/project" //项目基址
    static ARTICLEBASE = "/article" // 文章系统基址
    //===============前端基址========================
    static FRONTARTICLE = "/article"

    //==================资源地址=====================
    static NavLogo = "/Logo/MainLogo/NavLogo/NavLogo.jpg";
    static MainBackgoundLogo = "/Logo/MainLogo/BackgoundLogo/Backgound.PNG";
    static ManagerBackground = "/Logo/MainLogo/BackgoundLogo/ManagerBackground/ManagerBackground.PNG";
    //=================服务IP==================
    static INTERFACEIP = "http://26.224.10.101:5001";
    static INFOIP = "";
    static LOGINIP = "";
    static PROJECTIONCENTERIP = "";
    static AISYSTEMIP = "";
    static ARTICLESYSTEMIP = "";
    //================Nacos服务名字=============
    static NACOSLOGIN = "Login-Server";
    static NACOSINFO = "Info-Server";
    static NACOSINTERFACE = "Interface-Server";
    static NACOSPROJECTION = "Projection-Server";
    static NACOSAIASSISTANT = "Ai-Server";
    static NACOSARTICLE = "Article-Server";
    //=================数值常量================
    static INPUTMAXLEN = 20;

    //===================信息修改传输基本参数===============
    static PASSWORDCHANGE = "4";

}

//===========初始化注入IP===============
// 检查连接
var result = await checkUrlActive(`${CONSTPARAM.INTERFACEIP}${CONSTPARAM.INTERFACEBASE}/getServerUrl`);
if (result) {
    await initializeLoginUrl()
    await initializeInfoUrl()
    await initializeProjectUrl()
    await initializeAiUrl()
    await initializeArticleUrl();
}
//======================================

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
    const { data } = await axios.post(`${interfaceUrl}/getServerUrl`, sendName, {
        timeout: 10000
    });

    DebugTool.debugLog("前端信息中心: 获得后端基址: " + data.url);

    // 注入信息系统地址
    CONSTPARAM.INFOIP = `${data.url}`;
    DebugTool.debugLog(`注入信息系统: ${CONSTPARAM.INFOIP}`)
}

// 初始化网站与项目基址(项目系统)
async function initializeProjectUrl() {
    var sendName = { serverName: CONSTPARAM.NACOSPROJECTION }
    // 获取接口定位
    const interfaceUrl = `${CONSTPARAM.INTERFACEIP}${CONSTPARAM.INTERFACEBASE}`;
    DebugTool.debugLog("前端信息中心: 拼接接口地址: " + interfaceUrl + "/getServerUrl");

    const { data } = await axios.post(`${interfaceUrl}/getServerUrl`, sendName, {
        timeout: 10000
    });

    DebugTool.debugLog("前端信息中心: 获得后端基址: " + data.url);

    // 注入信息系统地址
    CONSTPARAM.PROJECTIONCENTERIP = `${data.url}`;
    DebugTool.debugLog(`注入信息系统: ${CONSTPARAM.PROJECTIONCENTERIP}`)
}

// 初始化网站与AI系统基址(AI系统)
async function initializeAiUrl() {
    var sendName = { serverName: CONSTPARAM.NACOSAIASSISTANT }
    // 获取接口定位
    const interfaceUrl = `${CONSTPARAM.INTERFACEIP}${CONSTPARAM.INTERFACEBASE}`;
    DebugTool.debugLog("前端信息中心: 拼接接口地址: " + interfaceUrl + "/getServerUrl");

    const { data } = await axios.post(`${interfaceUrl}/getServerUrl`, sendName, {
        timeout: 10000
    });

    DebugTool.debugLog("前端信息中心: 获得后端基址: " + data.url);

    // 注入信息系统地址
    CONSTPARAM.AISYSTEMIP = `${data.url}`;
    DebugTool.debugLog(`注入信息系统: ${CONSTPARAM.PROJECTIONCENTERIP}`)
}

// 初始化网站与AI系统基址(AI系统)
async function initializeArticleUrl() {
    var sendName = { serverName: CONSTPARAM.NACOSARTICLE }
    // 获取接口定位
    const interfaceUrl = `${CONSTPARAM.INTERFACEIP}${CONSTPARAM.INTERFACEBASE}`;
    DebugTool.debugLog("前端信息中心: 拼接接口地址: " + interfaceUrl + "/getServerUrl");

    const { data } = await axios.post(`${interfaceUrl}/getServerUrl`, sendName, {
        timeout: 10000
    });

    DebugTool.debugLog("前端信息中心: 获得后端基址: " + data.url);

    // 注入信息系统地址
    CONSTPARAM.ARTICLESYSTEMIP = `${data.url}`;
    DebugTool.debugLog(`注入文章系统: ${CONSTPARAM.ARTICLESYSTEMIP}`)
}

// 启动前探测网址存在
/** 
 * @param {String} url 目标地址
 * @param {Number} timeout 超时毫秒
 * @returns {Promise<boolean>} true 连接正常
*/
async function checkUrlActive(url, timeout = 3000) {
    try {
        DebugTool.debugLog(`试探地址: ${url}`)
        // 发送连接测试
        await axios.head(url, {
            timeout: timeout,
            validateStatus: () => true
        });
        DebugTool.debugLog("连接成功")
        return true

    } catch (error) {
        // 未连接上对应服务
        DebugTool.debugLog("连接失败");
        return false;
    }
}

export default CONSTPARAM;