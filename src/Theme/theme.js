

// 主题类
class Theme {
    // 导航栏主题
    static NavigateTheme = {
        "padding": "16px 30px",
        "backgroundColor": "rgba(255, 255, 255, 0.9)",
        "backdropFilter": "blur(10px)",
        "margin": '20px 0',
        "display": "flex",
        "gap": "18px",
        "fontSize": '18px',
        "boxShadow": "0 0px 20px rgba(0, 0, 0, 0.5)",
        "position": "relative",
        "alignItems": "center",
    }

    // 导航字体主题
    static NavigateFontTheme = {
        "color": "#333",
        "textDecoration": "none",
        "padding": '6px 0',
    }

    // 登录系统输入框主题
    static LoginSystemInputTheme = {
        "padding": "10px 15px",
        "borderRadius": "10px",
        "border": "1px solid #ddd",
        "fontSize": "15px",
        "outline": "none",
    }

    // 总入口主题(主要主题)
    static AppMainTheme = {
        width: "100%",
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundColor: "rgba(143, 38, 134, 0.21)",
        fontFamily: "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif",
        fontSize: '16px',
        color: '#333',
    }

    // 头像主题
    static AvatarTheme = {
        "position": "absolute",
        "top": "12px",
        "right": "20px",
        "width": "36px",
        "height": "36px",
        "borderRadius": "50%",
        "objectFit": "cover",
        "cursor": "pointer"
    }


}

export default Theme;