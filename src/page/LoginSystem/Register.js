import { useState } from "react";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem"
import { DebugTool } from "../../Util/DebugTool/DebugTool";

// 注册界面
function Register() {
    const [accountId, setAccountId] = useState(""); // 绑定账号ID
    const [password, setPassword] = useState(""); // 绑定密码
    const [registerInfo, setRegisterInfo] = useState([]) // 显示登录状态

    // 检测回车执行
    const enterPressed = (e) => {
        if (e.key === 'Enter') {
            // 发送登录信息
            LoginConfirm()
        }
    };

    // 注册确定(清空密码)
    function LoginConfirm() {
        // 向信息管理器传送账号信息
        InfomationSystem.sentAccountInfo(accountId, password, 1, (result) => {
            DebugTool.debugLog("登录前端接收: " + JSON.stringify(result));
            // 更新网站验证信息
            setRegisterInfo([result.message]);
        });

        setPassword("");
    }

    return (
        <div>
            <h1 style={{ color: "blue" }}>请点击注册</h1>
            <div>
                <input
                    type="text"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    onKeyDown={enterPressed}
                    placeholder="请输入账号"
                /><br />
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={enterPressed}
                    placeholder="请输入密码"
                />
                <p>{registerInfo}</p>
            </div>
            <button onClick={() => { LoginConfirm() }}>注册</button>
        </div>
    );
}

export default Register;