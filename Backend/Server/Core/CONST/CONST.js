
// 全局常量存储
class CONSTPARAM {
    //===========IP常量===============
    static NACOSURL = "26.224.10.101:8848";
    static CONNECTIP = "26.224.10.101";
    static BACKENDBASEURL = "/api";
    static INTERFACEURL = "/interface";
    //===========Nacos分组=============
    static LOGINSERVER = "Login-Server";
    static LOGINSERVERGROUP = "LOGINGROUP";
    static INTERFACESERVER = "Interface-Server";
    static INTERFACESERVERGROUP = "INTERFACEGROUP";
    static INFOSERVER = "Info-Server";
    static INFOSERVERGROUP = "INFOSERVERGROUP";
    static PROJECTIONSERVER = "Projection-Server";
    static PROJECTIONSERVERGTOUP = "PROJECTIONSERVERGTOUP";
    static AISYSTEMSERVER = "ai-server";
    static AISYSTEMSeRVERGROUP = "AISYSTEMSeRVERGROUP";
    //==============标准后端返回=====================
    static WEBSUCCESSCODE = 200;         // 后端请求处理成功
    static WEBARGVERROR = 400;           // 传入参数错误
    static WEBONLINEERROR = 401;         // 未登录 
    static WEBPERMESSIONERROR = 403;     // 后端权限错误
    static WEBEXISTERROR = 404;          // 后端存在错误
    static WEBSERVERERROR = 500;         // 后端服务器错误

    //===================后端返回标准函数=================
    static backendResponse(code, message, data) {
        return JSON.stringify({
            "code": code,
            "message": message,
            "data": data
        });
    }
}

module.exports = {
    CONSTPARAM
};