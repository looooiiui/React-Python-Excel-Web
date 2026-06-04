import { use, useState } from "react";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem"
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import { useNavigate } from "react-router-dom";

//==========自定义工具组引入===================
import Theme from "../../Theme/theme";
import CONSTPARAM from "../../Core/CONST/CONST";
//============================================


// 用户常量
const INPUTMAXLEN = 20;

// 登录界面
function Login() {
    // =================进入界面初始化===================
    // InfomationSystem.clearOnlineState();
    //==================================================

    const [accountId, setAccountId] = useState(""); // 绑定账号ID
    const [password, setPassword] = useState(""); // 绑定密码
    const [loginInfo, setLoginInfo] = useState([]) // 显示登录状态
    const [administrator, setadministrator] = useState(false) // 是否为管理员

    // 重定向工具
    const navigate = useNavigate();

    // 检测回车执行
    const enterPressed = (e) => {
        if (e.key === 'Enter') {
            // 发送登录信息
            LoginConfirm()
        }
    };

    // 登录确定(清空密码)
    function LoginConfirm() {

        // 检验是否勾选管理员
        var isAdmin = 0;
        if (administrator) {
            isAdmin = 2;
        }

        // 向信息管理器传送账号信息
        InfomationSystem.sentAccountInfo(accountId, password, isAdmin, (result) => {
            DebugTool.debugLog("登录前端接收: " + JSON.stringify(result));
            // 更新网站验证信息
            setLoginInfo(result.message);
            // 重定向验证
            LoginNavigateVerify();
        });
        setPassword("");
    }

    // 管理员状态转换
    function administratorStateChange() {
        setadministrator(prev => !prev);
        DebugTool.debugLog("登录前端: 当前选择管理员状态: " + administrator);
    }

    // 登录跳转检验
    function LoginNavigateVerify() {
        var currentLoginState = InfomationSystem.getCurrentLoginState();
        // 登录状态跳转
        if (!currentLoginState) {
            return;
        }

        // 跳转用户网址
        var currentAccountInfo = InfomationSystem.getCurrentLoginInfo();
        if (!("accountId" in currentAccountInfo)) {
            return;
        }
        var userId = String(currentAccountInfo.accountId);
        navigate(CONSTPARAM.USERBASEURL + "/" + userId);
    }

    return (
        <div>
            <h1>请点击登录(普通/管理员)</h1>
            <div>
                <input
                    type="text"
                    maxLength={INPUTMAXLEN}
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    onKeyDown={enterPressed}
                    placeholder="请输入账号"
                    style={Theme.LoginSystemInputTheme}
                /><br />
                <input
                    type="text"
                    maxLength={INPUTMAXLEN}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={enterPressed}
                    placeholder="请输入密码"
                    style={Theme.LoginSystemInputTheme}
                />
                <p>{loginInfo}</p>
            </div>
            <div style={{ display: "flex", gap: "30px" }}>
                <button onClick={() => { LoginConfirm() }} style={{
                    inlineSize: '100px'
                }}>登录</button>
                <button onClick={() => { administratorStateChange() }}>管理员</button>
                <input
                    type="checkbox"
                    checked={administrator}
                    onChange={administratorStateChange}
                    style={{
                        marginLeft: "-20px"
                    }}
                />
            </div>
        </div>
    );
}

export default Login;