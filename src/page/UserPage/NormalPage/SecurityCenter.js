import Theme from "../../../Theme/theme";

//==================自定义组件引入===============
import ChangePassword from "../../../CustomComponents/CustomIntegration/ChangePassword";
import ThemedButton from "../../../CustomComponents/OverrideCom/OverrideButton/ThemeButton";

// 安全中心
function SecurityCenter() {
    return (
        <div style={{
            display: "flex",
            gap: "50px",
        }}>
            <div style={Theme.ManagerBackendTheme}></div>
            <table>
                <tbody>
                    <tr><td><h1>安全中心</h1></td></tr>
                    <tr>
                        <td><ThemedButton>修改密码</ThemedButton></td>
                    </tr>
                </tbody>
            </table>
            <ChangePassword />
        </div>
    );
}

export default SecurityCenter;