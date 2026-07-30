import { InfomationSystem }     from "../../InfomationSystem/InfomationSystem";
import { useNavigate }          from "react-router-dom";
import CONSTPARAM               from "../../Core/CONST/CONST";

function LogoutButton() {
    const navigate = useNavigate();

    // 退出登录
    const handleLogout = () => {
        InfomationSystem.logout();
        navigate(CONSTPARAM.MAINPAGEURL);
    }

    return (
        <button
            onClick={handleLogout}
            style={{
                padding: "6px 14px",
                backgroundColor: "#ff4444",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
            }}>退出登录</button>
    );

}

export default LogoutButton;
