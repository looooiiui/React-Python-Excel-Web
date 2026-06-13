
//=============自定义工具===================
import Theme from "../../../Theme/theme";
//=============其他页面=================
import AiAssistant from "../../../CustomComponents/AiChat/AiAssistant";


// 普通用户页
function AiAssistantCenter() {
    return (
        <div style={{
            display: "flex",
            gap: "50px",
        }}>
            <div style={Theme.ManagerBackendTheme}></div>
            <h1>AI中心</h1>
            <AiAssistant />
        </div>
    );
}

export default AiAssistantCenter;