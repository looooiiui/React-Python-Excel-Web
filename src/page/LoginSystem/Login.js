import { useState } from "react";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem"
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import { useNavigate } from "react-router-dom";

// 用户常量
const USERURL = "/user";

// 登录界面
function Login() {
    const [accountId, setAccountId] = useState(""); // 绑定账号ID
    const [password, setPassword] = useState(""); // 绑定密码
    const [loginInfo, setLoginInfo] = useState([]) // 显示登录状态

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
        // 向信息管理器传送账号信息
        InfomationSystem.sentAccountInfo(accountId, password, 0, (result) => {
            DebugTool.debugLog("登录前端接收: " + JSON.stringify(result));
            // 更新网站验证信息
            setLoginInfo(result.message);
            // 重定向验证
            LoginNavigateVerify();
        });
        setPassword("");
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
        navigate(USERURL + "/" + userId);
    }

    return (
        <div>
            <h1>请点击登录</h1>
            <div>
                <input
                    type="text"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    onKeyDown={enterPressed}
                    placeholder="请输入账号"
                    style={{
                        padding: "10px 15px",
                        borderRadius: "10px",
                        border: "1px solid #ddd",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s ease",
                    }}
                /><br />
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={enterPressed}
                    placeholder="请输入密码"
                    style={{
                        padding: "10px 15px",
                        borderRadius: "10px",
                        border: "1px solid #ddd",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s ease",
                    }}
                />
                <p>{loginInfo}</p>
            </div>
            <button
                onClick={() => { LoginConfirm() }}>登录</button>
        </div>
    );
}

export default Login;