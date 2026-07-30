import CONSTPARAM       from "../../Core/CONST/CONST";
import ThemedButton     from "../OverrideCom/OverrideButton/ThemeButton";

function clickProjectCenter() {
    window.location.href = `${CONSTPARAM.AIASSISTANTURL}`;
}

function AiSelectBar() {
    return (
        <div>
            <h3>选择管理</h3>
            <ThemedButton onClick={clickProjectCenter}>AI中心(组件式)</ThemedButton>
        </div >
    );
}

export default AiSelectBar;