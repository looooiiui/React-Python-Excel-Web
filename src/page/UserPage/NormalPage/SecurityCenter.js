import Theme from "../../../Theme/theme";
import ChangePassword from "../../../CustomComponents/CustomIntegration/ChangePassword";
import ThemedButton from "../../../CustomComponents/OverrideCom/OverrideButton/ThemeButton";

function SecurityCenter() {
    return (
        <div style={{ width: "90%", margin: "40px auto" }}>
            {/* 页面标题栏 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <h1 style={{ color: Theme.theme.primary, margin: 0 }}>安全中心</h1>
            </div>

            {/* 内容卡片容器，和管理页面卡片风格统一 */}
            <div style={{
                background: "#fff",
                padding: "32px",
                borderRadius: 6,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                maxWidth: 600
            }}>
                {/* 修改密码组件 */}
                <ChangePassword />

                {/* 分割线 */}
                <div style={{ height: 1, background: "#eee", margin: "32px 0" }} />

                {/* 后续可扩展：绑定手机、邮箱、注销账号、登录记录等模块预留 */}
                <div>
                    <h3 style={{ color: Theme.theme.primary, marginBottom: 16 }}>账号安全提示</h3>
                    <ul style={{ color: "#666", lineHeight: 2 }}>
                        <li>密码长度建议大于6位，组合字母+数字提升安全性</li>
                        <li>请勿使用生日、手机号等简单信息作为登录密码</li>
                        <li>定期更换密码，降低账号被盗风险</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default SecurityCenter;