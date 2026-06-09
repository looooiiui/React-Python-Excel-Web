import CONSTPARAM from "../../Core/CONST/CONST";
import ThemedButton from "../OverrideCom/OverrideButton/ThemeButton";

function clickProjectCenter() {
    window.location.href = `${CONSTPARAM.PROJECTIONCENTERURL}`;
}

function ProjectCenterBar() {
    return (
        <div>
            <h3>选择管理</h3>
            <ThemedButton onClick={clickProjectCenter}>项目中心</ThemedButton>
        </div >
    );
}

export default ProjectCenterBar;