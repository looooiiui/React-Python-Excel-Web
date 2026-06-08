import { useState } from "react";
//==========自定义组件(核心)引入===============
import Theme from "../../Theme/theme";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";
import CONSTPARAM from "../../Core/CONST/CONST";
import { DebugTool } from "../../Util/DebugTool/DebugTool";
//====================其他组件====================
import ThemedButton from "../OverrideCom/OverrideButton/ThemeButton";
import Toast from "./Toast/Toast";

// 刚刚密码输入栏以及框
function ChangePassword() {
    const [password, setPassword] = useState(""); // 绑定密码
    const [resMessage, setResMessage] = useState("");
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    // 检测回车执行
    const enterPressed = (e) => {
        if (e.key === 'Enter') {
            // 发送登录信息
            ChangeConfirm()
        }
    };

    // 登录确认
    function ChangeConfirm() {
        InfomationSystem.sendChangeOperator(password, CONSTPARAM.PASSWORDCHANGE, (result) => {
            DebugTool.debugLog("密码修改前端接收: " + JSON.stringify(result));
            setResMessage(result.message);
            if (result.data == "0") {
                setToast({
                    show: true,
                    type: 'success',
                    message: '密码修改成功！',
                });
            } else {
                setToast({
                    show: true,
                    type: 'error',
                    message: '密码修改失败，请重试',
                });
            }
        });
        setPassword("")
    }

    return (
        <div>
            <div>
                <h3>修改密码</h3>
                <input
                    type="text"
                    style={Theme.LoginSystemInputTheme}
                    value={password}
                    onKeyDown={enterPressed}
                    onChange={(e) => { setPassword(e.target.value) }}
                    placeholder="修改密码"
                ></input>
                <ThemedButton onClick={ChangeConfirm}>修改密码</ThemedButton>
                <Toast {...toast} onClose={() => setToast({ show: false, type: '', message: '' })} />
                <p>{resMessage}</p>
            </div>
        </div>
    );
}

export default ChangePassword;