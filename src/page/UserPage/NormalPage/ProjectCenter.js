import Theme from "../../../Theme/theme";
//=============自定义组件引入===============//
import ThemedButton from "../../../CustomComponents/OverrideCom/OverrideButton/ThemeButton";

// 普通用户页
function ProjectCenter() {
    return (
        <div style={{
            display: "flex",
            gap: "50px",
        }}>
            <div style={Theme.ManagerBackendTheme}></div>
            <table>
                <tbody>
                    <tr><td><h1>安全中心</h1></td></tr>
                    <tr><td><ThemedButton>当前项目管理</ThemedButton></td></tr>
                    <tr><td><ThemedButton>加入项目</ThemedButton></td></tr>
                </tbody>
            </table>
        </div >
    );
}

export default ProjectCenter;