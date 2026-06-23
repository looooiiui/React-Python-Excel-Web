import CONSTPARAM from "../Core/CONST/CONST"

// 主题类
class Theme {
    static defaultColor = "#154299";

    // 导航栏主题（修复fixed+flex冲突，移除固定height，适配双层Header）
    static NavigateTheme = {
        padding: "0 30px",
        backgroundColor: "#154299",
        backgroundSize: "auto 60px, 100% 100%",
        backgroundRepeat: "no-repeat,no-repeat",
        backdropFilter: "blur(10px)",
        boxShadow: "0 0px 20px rgba(0, 0, 0, 0.5)",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 999,
        margin: 0,
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
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        fontFamily: "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif",
        fontSize: '16px',
        color: '#3b3838ff',
    }

    // 头像主题（移除absolute，交给内部flex布局控制，避免遮挡Tab）
    static AvatarTheme = {
        right: "25px",
        borderRadius: "50%",
        objectFit: "cover",
        cursor: "pointer",
    }

    // 最外层全局flex容器：只预留顶部固定导航高度80px，不重复叠加
    static WrapAllTheme = {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        paddingTop: "110px",
    }

    // 路由主体容器：删除多余 paddingTop:80px，只留左右下内边距
    static ContentWrapTheme = {
        flex: 1,
        paddingTop: "60px",
        boxSizing: "border-box"
    }

    // 底部大footer
    static FooterBigTheme = {
        width: "100%",
        backgroundColor: "#154299",
        color: "#fff",
        padding: "15px 15%",
        boxSizing: "border-box"
    }

    // 底部导航栏
    static FooterCopyrightTheme = {
        width: "100%",
        backgroundColor: "#154299",
        textAlign: "center",
        padding: "12px 0",
        fontSize: "13px",
        color: "#ffffff"
    }

    // 管理后台页面容器主题（修复fixed全屏脱离文档流问题，改为相对背景层）
    static ManagerBackendTheme = {
        position: "relative",
        minHeight: "calc(100vh - 80px)",
        padding: "16px",
    }
    // 管理页面背景层（单独抽离给内层div使用，不污染外层布局）
    static ManagerBgOverlay = {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${CONSTPARAM.ManagerBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#154299",
        zIndex: -1,
    }

    // 主题色(按钮)
    static theme = {
        primary: "#0047AB",         // 主色
        primaryHover: "#003580",    // hover 加深
        primaryActive: "#002455",   // 点击更深
        default: "#e5e7eb",         // 次要按钮背景
        defaultText: "#1f2937",     // 次要按钮文字
        disabled: "#94a3b8",        // 禁用色
        radius: "6px",
        transition: "all 0.2s ease"
    };

    // ========== 表格相关样式 ==========
    static TableMainTheme = {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px",
        textAlign: "center",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    }

    static TableCellTheme = {
        border: "1px solid #e5e7eb",
        padding: "12px 8px",
        color: "#374151"
    }

    static TableHeadRowTheme = {
        backgroundColor: "#f3f4f6"
    }

    static TableBodyRowTheme = {
        backgroundColor: "#ffffff"
    }

    static TableRowHoverBg = "#f9fafb"

    static TableBtnTheme = {
        padding: "5px 12px",
        fontSize: "13px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        backgroundColor: Theme.theme.primary,
        color: "#fff",
        transition: Theme.theme.transition
    }
}

export default Theme;