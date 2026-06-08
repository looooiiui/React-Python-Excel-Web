import AccountLists from "../../../../CustomComponents/AccountList/AccountList"
import CONSTPARAM from "../../../../Core/CONST/CONST";
import Theme from "../../../../Theme/theme";

function AccountManger() {
    return (
        <div>
            <div style={Theme.ManagerBackendTheme}></div>
            <h1>学员管理</h1>
            <AccountLists />
        </div>
    );
}

export default AccountManger;