import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import CONSTPARAM from "../../Core/CONST/CONST";

function UserMainPage() {
    const { id } = useParams(); // 路由里的用户ID
    const navigate = useNavigate();
    const [currentAccountInfo, setCurrentAccountInfo] = useState({ accountId: "" });
    const [currentLoginState, setCurrentLoginState] = useState(false);

    // 初始化：进入页面就获取登录状态
    useEffect(() => {
        const loginInfo = InfomationSystem.getCurrentLoginInfo();
        const loginState = InfomationSystem.getCurrentLoginState();

        setCurrentAccountInfo(loginInfo);
        setCurrentLoginState(loginState);

        DebugTool.debugLog("用户主页面: 当前捕获用户ID => " + id);
        DebugTool.debugLog("用户主页面: 当前登录账号 => " + loginInfo.accountId);
    }, []);

    // 每次状态变化，验证是否是本人访问
    useEffect(() => {
        if (!currentLoginState) return;

        // 安全验证：只能访问自己的主页
        if (currentAccountInfo.accountId !== id) {
            DebugTool.debugLog("用户主页面: 越权访问，跳回登录");
            navigate(CONSTPARAM.LOGINURL);
        }
    }, [currentLoginState, currentAccountInfo, id, navigate]);

    // 未登录
    if (!currentLoginState) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h1>您还未登录，请先登录！</h1>
            </div>
        );
    }

    // 已登录 → 显示主页
    return (
        <div style={{
            maxWidth: "800px",
            margin: "50px auto",
            textAlign: "center",
            padding: "0 20px"
        }}>
            {/* 顶部用户卡片 */}
            <div style={{
                background: "#fff",
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0 0 12px rgba(0,0,0,0.1)"
            }}>
                <img
                    src="/logo512.png"
                    style={{ width: "80px", height: "80px", borderRadius: "50%" }}
                />
                <h1>欢迎回来，{currentAccountInfo.accountId}</h1>
                <p style={{ fontSize: "16px", color: "#666" }}>
                    这是你的个人主页
                </p>

                {/* 快速入口 */}
                <div style={{ marginTop: "20px", display: "flex", gap: "15px", justifyContent: "center" }}>
                    <button
                        onClick={() => navigate(`/user/${id}/profile`)}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#1677ff",
                            color: "#fff"
                        }}
                    >
                        个人中心
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserMainPage;