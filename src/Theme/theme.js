import CONSTPARAM from "../Core/CONST/CONST"

// 主题类
class Theme {
    static defalutColor = "#5565b1cb";

    // 导航栏主题
    static NavigateTheme = {
        padding: "0 18px",
        backgroundImage: `
        url(${CONSTPARAM.NavLogo}),
        linear-gradient(to right,#3c457a 0%,#3c457a7e 100%)`,
        backgroundSize: "contain, 100% 90%",
        backgroundPosition: "center,center",
        backgroundRepeat: "no-repeat,no-repeat",
        backdropFilter: "blur(10px)",
        display: "flex",
        gap: "18px",
        fontSize: '18px',
        boxShadow: "0 0px 20px rgba(0, 0, 0, 0.5)",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 999,
        margin: 0,
        height: "80px",
    }

    // 导航字体主题
    static NavigateFontTheme = {
        color: "#ffffff",
        fontSize: 24,
        textDecoration: "none",
        padding: '6px 0',
    }

    // 登录系统输入框主题
    static LoginSystemInputTheme = {
        padding: "10px 15px",
        borderRadius: "10px",
        border: "1px solid #ddd",
        fontSize: "15px",
        outline: "none",
    }

    // 总入口主题(主要主题)
    static AppMainTheme = {
        flex: 1,
        width: "100%",
        minHeight: "100vh",
        paddingTop: "80px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        fontFamily: "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif",
        fontSize: '16px',
        color: '#3b3838ff', // 全局默认文字白色（匹配原图字体）
    }

    // 头像主题
    static AvatarTheme = {
        position: "absolute",
        top: "20px",
        right: "80px",
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        objectFit: "cover",
        cursor: "pointer"
    }

    // Theme类内部追加
    // 最外层全局flex容器
    static WrapAllTheme = {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        paddingTop: "80px",
    }
    // 路由主体容器
    static ContentWrapTheme = {
        flex: 1,
        paddingTop: "80px",
        padding: "30px",
        boxSizing: "border-box"
    }
    // 底部大footer
    static FooterBigTheme = {
        width: "100%",
        backgroundColor: "#0052ccd5",
        color: "#fff",
        padding: "15px 15%",
        boxSizing: "border-box"
    }


    static FooterCopyrightTheme = {
        width: "100%",
        backgroundColor: "#0048b3ce",
        textAlign: "center",
        padding: "12px 0",
        fontSize: "13px",
        color: "#ffffff"
    }

}

export default Theme;