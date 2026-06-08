import Theme from "../../../Theme/theme";

var theme = Theme.theme

// 主题按钮组件
const ThemedButton = ({
    children,
    type = "primary", // primary / default
    disabled = false,
    onClick
}) => {
    const baseStyle = {
        padding: "8px 18px",
        fontSize: "15px",
        fontWeight: 600,
        borderRadius: theme.radius,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: theme.transition,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    };

    const typeStyle = {
        primary: {
            backgroundColor: disabled ? theme.disabled : theme.primary,
            color: "#fff"
        },
        default: {
            backgroundColor: theme.default,
            color: theme.defaultText
        }
    };

    const hoverStyle = !disabled && type === "primary"
        ? { ":hover": { backgroundColor: theme.primaryHover } }
        : {};

    return (
        <button
            style={{ ...baseStyle, ...typeStyle[type] }}
            disabled={disabled}
            onClick={onClick}
            onMouseOver={(e) => {
                if (!disabled && type === "primary") {
                    e.target.style.backgroundColor = theme.primaryHover;
                }
            }}
            onMouseOut={(e) => {
                if (!disabled && type === "primary") {
                    e.target.style.backgroundColor = theme.primary;
                }
            }}
            onMouseDown={(e) => {
                if (!disabled && type === "primary") {
                    e.target.style.backgroundColor = theme.primaryActive;
                }
            }}
        >
            {children}
        </button>
    );
};

export default ThemedButton;