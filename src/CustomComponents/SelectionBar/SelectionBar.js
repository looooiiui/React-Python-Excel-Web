import { DebugTool }            from "../../Util/DebugTool/DebugTool";
import CONSTPARAM               from "../../Core/CONST/CONST";
//=============自定义组件===============
import ThemedButton             from "../OverrideCom/OverrideButton/ThemeButton";

function clickTraineeManager() {
    window.location.href = `${CONSTPARAM.TRAINEEMANAGERURL}`;
}

// ======选择栏,提供管理的选择================
function SelectionBar() {
    return (
        <div>
            <h3>选择管理</h3>
            <ThemedButton onClick={clickTraineeManager}>学员管理</ThemedButton>
        </div >
    );
}

export default SelectionBar;