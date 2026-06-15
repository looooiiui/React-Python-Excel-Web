import CONSTPARAM from "../../Core/CONST/CONST";
import ThemedButton from "../OverrideCom/OverrideButton/ThemeButton";

function clickTrainingCenter() {
    window.location.href = `${CONSTPARAM.TRAININGCENTERURL}`;
}

function TrainingCenterBar() {
    return (
        <div>
            <h3>培训管理</h3>
            <ThemedButton onClick={clickTrainingCenter}>培训中心</ThemedButton>
        </div >
    );
}

export default TrainingCenterBar;