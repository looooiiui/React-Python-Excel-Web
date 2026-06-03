import { useEffect } from "react";
import { InfomationSystem } from "../InfomationSystem/InfomationSystem"
import { useState } from "react";
import { createRoutesFromElements, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

//==========自定义工具导入===================
import { DebugTool } from "../Util/DebugTool/DebugTool";
import Login from "../page/LoginSystem/Login";

const LOGINURL = "/login";

function UserMainPage() {

    // 当前玩家登录ID
    const [currentAccountInfo, setCurrentAccountInfo] = useState({ "accountId": "" });
    const [currentLoginState, setCurrentLoginState] = useState(false);
    const { id } = useParams();

    // 重定向工具
    const navigate = useNavigate();

    // 玩家信息显示
    var currentId;

    // 验证当前进入的用户界面是否是用
    function verifyIdEqual() {
        if (id != currentAccountInfo.accountId) {
            navigate(LOGINURL);
        };
    }

    // 获得当前用户状态
    useEffect(() => {

        setCurrentAccountInfo(InfomationSystem.getCurrentLoginInfo());
        setCurrentLoginState(InfomationSystem.getCurrentLoginState());
        // 获取网站当前ID

        DebugTool.debugLog("用户主页面: 初始化用户页面");
        DebugTool.debugLog("用户主页面: 当前捕获页面用户ID: " + id);

    }, []);


    if (!currentLoginState) {
        currentId = "用户主页面: 未找到登录信息,您当前未登录";
    } else {
        // 检查是否是对应网页
        verifyIdEqual();
        currentId = currentAccountInfo.accountId;
    }

    return (
        <div>
            <h1>当前账户ID: {currentId}</h1>
        </div>
    )
}

export default UserMainPage;