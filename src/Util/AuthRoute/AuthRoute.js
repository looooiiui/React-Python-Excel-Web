import { Navigate, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
//===========自定义组件引入======================
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";
import CONSTPARAM from "../../Core/CONST/CONST";
import { DebugTool } from "../DebugTool/DebugTool";

function AuthRoute({ children, requireAdmin = false }) {
    const { pathname } = useLocation();
    const loc = useLocation();
    const LOGINURL = "/Login";

    const getUserId = () => {
        const res = pathname.match(/\/user\/(\w+)/);
        return res ? Number(res[1]) : null;
    };

    const userId = getUserId();

    // 得到当前登录状态(检查登录状态)
    const isLogin = InfomationSystem.getCurrentLoginState();
    DebugTool.debugLog("路由拦截: 当前登录状态: " + isLogin);
    if (!isLogin) {
        DebugTool.debugLog("路由拦截: 拦截预跳转网页: " + CONSTPARAM.LOGINURL + " 拦截原因: 未登录");
        return <Navigate to={LOGINURL} state={{ from: loc.pathname }} replace />;
    }

    // 管理员权限
    if (requireAdmin && !InfomationSystem.getAdminState()) {
        DebugTool.debugLog("路由拦截: 拦截预跳转网页: " + CONSTPARAM.LOGINURL + " 拦截原因: 不是管理员");
        return <Navigate to={LOGINURL} state={{ from: loc.pathname }} replace />;
    }

    if (userId != null) {
        if (userId != InfomationSystem.getCurrentLoginInfo().accountId) {
            DebugTool.debugLog("路由拦截: 登录ID与当前记录已登录ID不符");
            return <Navigate to={LOGINURL} state={{ from: loc.pathname }} replace />;
        }
    }

    return children
}

export default AuthRoute;