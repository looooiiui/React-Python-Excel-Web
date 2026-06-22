import { use, useState } from "react";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem"
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import { useNavigate } from "react-router-dom";

//==========自定义工具组引入===================
import Theme from "../../Theme/theme";
import CONSTPARAM from "../../Core/CONST/CONST";
import ThemedButton from "../../CustomComponents/OverrideCom/OverrideButton/ThemeButton";
//============================================

//================UI库引入=======================
import { Button, Card, Checkbox, Input, Space, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
// 用户常量
const INPUTMAXLEN = 20;

// 登录界面
function Login() {
    // =================进入界面初始化===================
    //InfomationSystem.clearOnlineState();
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
            LoginNavigateVerify(result);
        });
        setPassword("");
    }

    // 管理员状态转换
    function administratorStateChange() {
        setadministrator(prev => {
            DebugTool.debugLog("登录前端: 当前选择管理员状态: " + !prev);
            return !prev;
        });
    }

    // 登录跳转检验
    function LoginNavigateVerify(result) {
        var currentAccountInfo = InfomationSystem.getCurrentLoginInfo();
        var currentLoginState = InfomationSystem.getCurrentLoginState();
        DebugTool.debugLog("前端登录获得当前登录状态: " + currentLoginState);

        // 验证后端返回结果
        if (result.data != "0") {
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
            <Typography.Title level={2}>请点击登录(普通/管理员)</Typography.Title>
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

                    <Typography.Text type="danger" style={{ display: "block", marginBottom: 16 }}>
                        {loginInfo}
                    </Typography.Text>

                </div>
                <Space size="large" align="center">
                    <Button
                        type="primary"
                        onClick={LoginConfirm}
                        style={{
                            width: "100px",
                        }}>登录
                    </Button>

                    <Checkbox
                        checked={administrator}
                        onChange={(e) => administratorStateChange(e.target.checked)}
                    >
                        管理员
                    </Checkbox>
                </Space>
            </Card>
        </div>
    );
}

export default Login;