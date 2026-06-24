import { useState } from "react";
import Theme from "../../Theme/theme";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";
import CONSTPARAM from "../../Core/CONST/CONST";
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import ThemedButton from "../OverrideCom/OverrideButton/ThemeButton";
import Toast from "./Toast/Toast";

export default function ChangePassword() {
    const [newPwd, setNewPwd] = useState("");
    const [toast, setToast] = useState({ show: false, type: "", message: "" });

    // 关闭弹窗提示
    const closeToast = () => {
        setToast({ show: false, type: "", message: "" });
    };

    // 校验密码格式
    const validatePwd = (pwd) => {
        if (!pwd || pwd.trim() === "") return { ok: false, msg: "密码不能为空" };
        if (pwd.length < 4) return { ok: false, msg: "密码长度不能小于4位" };
        return { ok: true };
    };

    // 提交修改密码
    const submitChange = () => {
        const check = validatePwd(newPwd);
        if (!check.ok) {
            setToast({ show: true, type: "error", message: check.msg });
            return;
        }

        InfomationSystem.sendChangeOperator(newPwd, CONSTPARAM.PASSWORDCHANGE, (res) => {
            DebugTool.debugLog("修改密码回调：" + JSON.stringify(res));
            if (res.data === "0") {
                setToast({ show: true, type: "success", message: "密码修改成功！" });
                setNewPwd("");
            } else {
                setToast({ show: true, type: "error", message: res.message || "密码修改失败" });
            }
        });
    };

    // 回车触发提交
    const handleKeyEnter = (e) => {
        if (e.key === "Enter") submitChange();
    };

    return (
        <div style={{ width: "100%" }}>
            <h3 style={{ color: Theme.theme.primary, marginBottom: 16 }}>修改登录密码</h3>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <input
                    type="password"
                    style={Theme.LoginSystemInputTheme}
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    onKeyDown={handleKeyEnter}
                    placeholder="请输入新登录密码"
                />
                <ThemedButton onClick={submitChange}>确认修改</ThemedButton>
            </div>
            <Toast {...toast} onClose={closeToast} />
        </div>
    );
}