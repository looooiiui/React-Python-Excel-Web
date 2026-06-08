import { useState } from "react";
//===============自定义组件引入============================
import { InfomationSystem } from "../../../InfomationSystem/InfomationSystem";
import LogoutButton from "../../../CustomComponents/CustomButton/LogoutButton";
import Theme from "../../../Theme/theme";
// 选择栏
import SelectionBar from "../../../CustomComponents/SelectionBar/SelectionBar";
import SecurityCenterBar from "../../../CustomComponents/SelectionBar/SecurityCenterBar";
import ThemedButton from "../../../CustomComponents/OverrideCom/OverrideButton/ThemeButton";
//========================================================

export default function UserProfile() {
    const userInfo = InfomationSystem.getCurrentLoginInfo();
    const isAdmin = InfomationSystem.getAdminState();
    const accountId = userInfo.accountId;

    // 菜单切换
    const [tab, setTab] = useState("profile");

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>

            {/* ======================
                顶部用户卡片 
            ====================== */}
            <div style={{
                backgroundColor: Theme.defalutColor,
                padding: "20px 30px",
                borderRadius: "12px",
                boxShadow: "0 0 10px #0000006b",
                display: "flex",
                justifyContent: "space-between",
                backdropFilter: "blur(10px)",
                alignItems: "center",
                marginBottom: "20px"
            }}>
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <img
                        src="/logo512.png"
                        style={{ width: "60px", height: "60px", borderRadius: "50%" }}
                    />
                    <div>
                        <h2 style={{ margin: 0 }}>{accountId}</h2>
                        {isAdmin && <p style={{ color: "red", margin: "5px 0 0 0" }}>【管理员】</p>}
                    </div>
                </div>

                {/* 退出按钮 */}
                <LogoutButton />
            </div>

            {/* ======================
                菜单 
            ====================== */}
            <div style={{
                backgroundColor: Theme.defalutColor,
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
                flexWrap: "wrap",
                borderRadius: "16px",
                backgroundClip: "padding-box",
                backdropFilter: "blur(10px)",
                overflow: "hidden",
            }}>
                <ThemedButton onClick={() => setTab("profile")}>
                    个人资料
                </ThemedButton>
                <ThemedButton onClick={() => setTab("setting")}>
                    安全设置
                </ThemedButton>
                <ThemedButton onClick={() => setTab("personalCenter")}>
                    个人中心
                </ThemedButton>

                {/* 管理员专用菜单 */}
                {isAdmin && (
                    <ThemedButton onClick={() => setTab("admin")}>
                        管理员后台
                    </ThemedButton>
                )}
            </div>

            {/* ======================
                内容区域 
            ====================== */}
            <div style={{
                backdropFilter: "blur(10px)",
                backgroundColor: Theme.defalutColor,
                padding: "25px 30px",
                borderRadius: "12px",
                boxShadow: "0 0 10px #0000006b",
                minHeight: "300px"
            }}>
                {tab === "profile" && (
                    <div>
                        <h3>个人资料</h3>
                        <p>账号：{accountId}</p>
                        <p>权限：{isAdmin ? "管理员" : "普通用户"}</p>
                    </div>
                )}

                {tab === "setting" && (
                    <div>
                        <SecurityCenterBar />
                    </div>
                )}

                {tab === "personalCenter" && (
                    <div>
                        <h3>个人中心</h3>
                    </div>
                )}

                {tab === "admin" && (
                    <div>
                        <SelectionBar />
                    </div>
                )}
            </div>

        </div>
    );
}