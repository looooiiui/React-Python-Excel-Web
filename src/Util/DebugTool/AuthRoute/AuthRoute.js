import { Navigate, useLocation } from "react-router-dom";

//===========自定义组件引入======================
import { InfomationSystem } from "../../../InfomationSystem/InfomationSystem";
import CONSTPARAM from "../../../Core/CONST/CONST";
import { DebugTool } from "../DebugTool";

function AuthRoute({ children }) {
    const loc = useLocation();
    const LOGINURL = "/Login";

    DebugTool.debugLog("路由拦截: 拦截预跳转网页: " + CONSTPARAM.LOGINURL);
    // 得到当前登录状态(检查登录状态)
    const isLogin = InfomationSystem.getCurrentLoginState();
    if (!isLogin) {
        return <Navigate to={LOGINURL} state={{ from: loc.pathname }} replace />
    }

    return children
}

export default AuthRoute;