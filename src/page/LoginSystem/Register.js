import { useState } from "react";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem"
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import { useNavigate } from "react-router-dom";

//==========自定义工具组引入===================
import Theme from "../../Theme/theme";

//============================================

// 用户常量
const USERURL = "/user";

// 注册界面
function Register() {
    // =================进入界面初始化===================
    InfomationSystem.clearOnlineState();
    //==================================================

    const [accountId, setAccountId] = useState(""); // 绑定账号ID
    const [password, setPassword] = useState(""); // 绑定密码
    const [registerInfo, setRegisterInfo] = useState([]) // 显示登录状态

    // 重定向工具
    const navigate = useNavigate();

    // 检测回车执行
    const enterPressed = (e) => {
        if (e.key === 'Enter') {
            // 发送登录信息
            RegisterConfirm()
        }
    };

    // 注册确定(清空密码)
    function RegisterConfirm() {
        // 向信息管理器传送账号信息
        InfomationSystem.sentAccountInfo(accountId, password, 1, (result) => {
            DebugTool.debugLog("登录前端接收: " + JSON.stringify(result));
            // 更新网站验证信息
            setRegisterInfo([result.message]);
            // 重定向验证
            RegisterNavigateVerify();
        });

        setPassword("");
    }

    // 登录跳转检验
    function RegisterNavigateVerify() {
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
            <h1>请点击注册(仅有普通登录)</h1>
            <div>
                <input
                    type="text"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    onKeyDown={enterPressed}
                    placeholder="请输入账号"
                    style={Theme.LoginSystemInputTheme}
                /><br />
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={enterPressed}
                    placeholder="请输入密码"
                    style={Theme.LoginSystemInputTheme}
                />
                <p>{registerInfo}</p>
            </div>
            <button onClick={() => { RegisterConfirm() }} style={{
                inlineSize: "100px"
            }}>注册</button>
        </div>
    );
}

export default Register;