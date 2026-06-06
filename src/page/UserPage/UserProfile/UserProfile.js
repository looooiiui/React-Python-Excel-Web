import { useState } from "react";
import { InfomationSystem } from "../../../InfomationSystem/InfomationSystem";
import LogoutButton from "../../../CustomComponents/CustomButton/LogoutButton";
import Theme from "../../../Theme/theme";

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
                <button onClick={() => setTab("profile")}
                    style={{ padding: "10px 16px", borderRadius: "8px", border: "none", background: tab === "profile" ? "#1677ff" : "#f5f5f5", color: tab === "profile" ? "#fff" : "#000" }}>
                    个人资料
                </button>
                <button onClick={() => setTab("setting")}
                    style={{ padding: "10px 16px", borderRadius: "8px", border: "none", background: tab === "setting" ? "#1677ff" : "#f5f5f5", color: tab === "setting" ? "#fff" : "#000" }}>
                    安全设置
                </button>

                {/* 管理员专用菜单 */}
                {isAdmin && (
                    <button onClick={() => setTab("admin")}
                        style={{ padding: "10px 16px", borderRadius: "8px", border: "none", background: tab === "admin" ? "#ff4d4f" : "#f5f5f5", color: tab === "admin" ? "#fff" : "#000" }}>
                        管理员后台
                    </button>
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
                        <h3>安全设置</h3>
                        <p>密码修改功能（可扩展）</p>
                    </div>
                )}

                {tab === "admin" && (
                    <div>
                        <h3>管理员后台</h3>
                        <p>只有管理员能看到这里！</p>
                    </div>
                )}
            </div>

        </div>
    );
}