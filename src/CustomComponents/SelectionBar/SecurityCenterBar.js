import CONSTPARAM           from "../../Core/CONST/CONST";
import ThemedButton         from "../OverrideCom/OverrideButton/ThemeButton";

function clickSecurityCenter() {
    window.location.href = `${CONSTPARAM.SECURITYCENTERURL}`;
}

function SecurityCenterBar() {
    return (
        <div>
            <h3>选择管理</h3>
            <ThemedButton onClick={clickSecurityCenter}>安全中心</ThemedButton>
        </div >
    );
}

export default SecurityCenterBar;