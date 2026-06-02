import { useEffect } from "react";
import { InfomationSystem } from "../InfomationSystem/InfomationSystem"
import { DebugTool } from "../Util/DebugTool/DebugTool";


function UserMainPage() {
    // 当前玩家登录ID
    var currentAccountInfo = { "accountId": "", "password": "" };
    var currentLoginState = false;

    // 玩家信息显示
    var currentId;

    // 获得当前用户状态
    currentAccountInfo = InfomationSystem.getCurrentLoginInfo();
    currentLoginState = InfomationSystem.getCurrentLoginState();

    if (!currentLoginState) {
        currentId = "用户主页面: 未找到登录信息,您当前未登录";
    } else {
        currentId = currentAccountInfo.accountId;
    }

    DebugTool.debugLog("用户主页面: 初始化用户页面");


    return (
        <div>
            <h1>当前账户ID: {currentId}</h1>
        </div>
    )
}

export default UserMainPage;