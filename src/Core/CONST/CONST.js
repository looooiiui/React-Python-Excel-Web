import { DebugTool } from "../../Util/DebugTool/DebugTool";
import axios from "axios";

// ===================== 动态IP存储仓库（真实存放可变地址）=====================
export const ServerIpStore = {
    INFOIP: "",
    LOGINIP: "",
    PROJECTIONCENTERIP: "",
    AISYSTEMIP: "",
    ARTICLESYSTEMIP: "",
    TRAINIP: "",
    RESOURCEIP: "",
    IMGRESOURCEURL: "",
    MAINPAGEIMGURL: "",
};

// ===================== 只读常量类，对外兼容裸连写法 =====================
class CONSTPARAM {
    //==============前端页面路由URL===============================
    static MAINPAGEURL          = "/MainPage";
    static LOGINURL             = "/Login";
    static ABOUTURL             = "/Bbout";
    static REGISTERURL          = "/Register";
    static ARTICLEURL           = "/article"
    static INFOCHANGEURL        = "/infochange"
    static USERBASEURL          = "/user";
    static USERPROFILE          = "/profile";
    static TRAINEEMANAGERURL    = "/traineesManager"
    static SECURITYCENTERURL    = "/securityCenter"
    static PROJECTIONCENTERURL  = "/projectCenter"
    static TRAININGCENTERURL    = "/training"
    static AIASSISTANTURL       = "/aiAssistant"
    static RESULTSHOWCASEURL    = "/showcase"

    //===================后端基址==========================
    static ADMINBASE            = "/admin";
    static LOGINBASE            = "/api";
    static INTERFACEBASE        = "/interface";
    static INFOBASE             = "/info"
    static PROJECTBASE          = "/project"
    static ARTICLEBASE          = "/article"
    static TRAINBASE            = "/train"
    static RESOURCEBASE         = "/resource"
    static AISYSTEMBASE         = "/aiAssistant"
    //===============前端基址========================
    static FRONTARTICLE         = "/article"
    static FRONTRESULTSHOWPAGE  = "/detail"

    //==================资源地址=====================
    static NavLogo              = "/Logo/MainLogo/NavLogo/NavLogo.jpg";
    static MainBackgoundLogo    = "/Logo/MainLogo/BackgoundLogo/Backgound.PNG";
    static ManagerBackground    = "/Logo/MainLogo/BackgoundLogo/ManagerBackground.PNG";

    //================Nacos网关固定IP==================
    static INTERFACEIP = "http://127.0.0.1:5001";

    // ==================== 动态IP代理字段（外部裸连代码）====================
    static get INFOIP() { return ServerIpStore.INFOIP; }
    static set INFOIP(val) { ServerIpStore.INFOIP = val; }

    static get LOGINIP() { return ServerIpStore.LOGINIP; }
    static set LOGINIP(val) { ServerIpStore.LOGINIP = val; }

    static get PROJECTIONCENTERIP() { return ServerIpStore.PROJECTIONCENTERIP; }
    static set PROJECTIONCENTERIP(val) { ServerIpStore.PROJECTIONCENTERIP = val; }

    static get AISYSTEMIP() { return ServerIpStore.AISYSTEMIP; }
    static set AISYSTEMIP(val) { ServerIpStore.AISYSTEMIP = val; }

    static get ARTICLESYSTEMIP() { return ServerIpStore.ARTICLESYSTEMIP; }
    static set ARTICLESYSTEMIP(val) { ServerIpStore.ARTICLESYSTEMIP = val; }

    static get TRAINIP() { return ServerIpStore.TRAINIP; }
    static set TRAINIP(val) { ServerIpStore.TRAINIP = val; }

    static get RESOURCEIP() { return ServerIpStore.RESOURCEIP; }
    static set RESOURCEIP(val) { ServerIpStore.RESOURCEIP = val; }

    static get IMGRESOURCEURL() { return ServerIpStore.IMGRESOURCEURL; }
    static set IMGRESOURCEURL(val) { ServerIpStore.IMGRESOURCEURL = val; }

    static get MAINPAGEIMGURL() { return ServerIpStore.MAINPAGEIMGURL; }
    static set MAINPAGEIMGURL(val) { ServerIpStore.MAINPAGEIMGURL = val; }

    //=================数值常量================
    static INPUTMAXLEN = 20;
    static PASSWORDCHANGE = "4";
}

// checkUrlActive / initializeAnyUrl / syncResource
function syncResource() {
    // 这里赋值依然写 CONSTPARAM.IMGRESOURCEURL，内部自动同步到ServerIpStore
    CONSTPARAM.IMGRESOURCEURL = `${CONSTPARAM.RESOURCEIP}/resource/getPic`;
    CONSTPARAM.MAINPAGEIMGURL = `${CONSTPARAM.RESOURCEIP}/resource/getPic`;
    DebugTool.debugLog("获得后端图像URL基址: " + CONSTPARAM.IMGRESOURCEURL);
    DebugTool.debugLog("获得后端主页图像URL基址: " + CONSTPARAM.MAINPAGEIMGURL);
}

async function initializeAnyUrl(nacosName) {
    var sendName = { serverName: nacosName }
    const interfaceUrl = `${CONSTPARAM.INTERFACEIP}${CONSTPARAM.INTERFACEBASE}`;
    DebugTool.debugLog("前端信息中心: 拼接接口地址: " + interfaceUrl + "/getServerUrl");
    const { data } = await axios.post(`${interfaceUrl}/getServerUrl`, sendName);
    DebugTool.debugLog("前端信息中心: 获得后端基址: " + data.url);
    return data.url;
}

async function checkUrlActive(url, timeout = 3000) {
    try {
        DebugTool.debugLog(`试探地址: ${url}`)
        await axios.head(url, {
            timeout: timeout,
            validateStatus: () => true
        });
        DebugTool.debugLog("连接成功");
        return true
    } catch (error) {
        DebugTool.debugLog("连接失败");
        return false;
    }
}

// 顶层阻塞初始化
var result = await checkUrlActive(`${CONSTPARAM.INTERFACEIP}${CONSTPARAM.INTERFACEBASE}/getServerUrl`);
if (result) {
    CONSTPARAM.LOGINIP                  = CONSTPARAM.INTERFACEIP
    CONSTPARAM.INFOIP                   = CONSTPARAM.INTERFACEIP
    CONSTPARAM.PROJECTIONCENTERIP       = CONSTPARAM.INTERFACEIP
    CONSTPARAM.AISYSTEMIP               = CONSTPARAM.INTERFACEIP
    CONSTPARAM.ARTICLESYSTEMIP          = CONSTPARAM.INTERFACEIP
    CONSTPARAM.TRAINIP                  = CONSTPARAM.INTERFACEIP
    CONSTPARAM.RESOURCEIP               = CONSTPARAM.INTERFACEIP
    syncResource();
}

export default CONSTPARAM;