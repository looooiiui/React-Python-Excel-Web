import { useState } from "react";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem"
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import { useNavigate } from "react-router-dom";

//==========自定义工具组引入===================
import Theme from "../../Theme/theme";
import CONSTPARAM from "../../Core/CONST/CONST";
//============================================

//=============自定义组件引入================
import ThemedButton from "../../CustomComponents/OverrideCom/OverrideButton/ThemeButton";

//================UI库引入=======================
import { Button, Input, Card, Typography, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

// 用户常量
const INPUTMAXLEN = 20;

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
        DebugTool.debugLog("前端注册获得当前登录状态: " + currentLoginState);
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
        const targetUrl = `${CONSTPARAM.USERBASEURL}/${userId}`;
        DebugTool.debugLog("跳转用户网址: " + targetUrl);

        // 替换 navigate整页重载防渲染顺序问题
        window.location.href = targetUrl;
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "80px",
            minHeight: "55vh"
        }}>
            <Typography.Title level={2}>请点击注册(仅有普通登录)</Typography.Title>
            <Card>
                <div>
                    <Input
                        prefix={<UserOutlined />}
                        type="text"
                        maxLength={INPUTMAXLEN}
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        onKeyDown={enterPressed}
                        placeholder="请输入账号"
                        style={{ marginBottom: 16 }}
                        size="large"
                    /><br />
                    <Input
                        prefix={<LockOutlined />}
                        type="password"
                        maxLength={INPUTMAXLEN}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={enterPressed}
                        placeholder="请输入密码"
                        style={{ marginBottom: 16 }}
                        size="large"
                    />
                    <Typography.Text type="danger" style={{ display: "block", marginBottom: 20 }}>
                        {registerInfo}
                    </Typography.Text>
                </div>
                <Button
                    type="primary"
                    onClick={RegisterConfirm}
                    style={{ width: "100px" }}
                    size="large"
                >注册
                </Button>
            </Card>
        </div>
    );
}

export default Register;