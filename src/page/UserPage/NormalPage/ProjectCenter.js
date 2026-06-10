import Theme from "../../../Theme/theme";
import { useState } from "react";
//=============自定义组件引入=======================
import ThemedButton from "../../../CustomComponents/OverrideCom/OverrideButton/ThemeButton";
//==============信息组件
import ProjectionList from "../../../CustomComponents/ProjectionList/ProjectionList";


// 普通用户页
function ProjectCenter() {
    // 菜单切换
    const [tab, setTab] = useState("ProjectionManager");

    return (
        <div style={{
            display: "flex",
            gap: "50px",
        }}>
            <div style={Theme.ManagerBackendTheme}></div>
            <table>
                <tbody>
                    <tr><td><h1>项目中心</h1></td></tr>
                    <tr><td><ThemedButton onClick={() => { setTab("ProjectionManager") }}>当前项目管理</ThemedButton></td></tr>
                    <tr><td><ThemedButton onClick={() => { setTab("JoinProjection") }}>加入项目</ThemedButton></td></tr>
                </tbody>
            </table>
            {/*内容区域*/}
            <div>
                {tab == "ProjectionManager" && (
                    <div>
                        <h1>当前加入项目</h1>
                    </div>
                )}
                {tab == "JoinProjection" && (
                    <div>
                        <ProjectionList />
                    </div>
                )}
            </div>
        </div >
    );
}

export default ProjectCenter;