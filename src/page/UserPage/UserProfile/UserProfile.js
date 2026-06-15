import { useState } from "react";
//===============自定义组件引入============================
import { InfomationSystem } from "../../../InfomationSystem/InfomationSystem";
import LogoutButton from "../../../CustomComponents/CustomButton/LogoutButton";
import Theme from "../../../Theme/theme";
import ThemedButton from "../../../CustomComponents/OverrideCom/OverrideButton/ThemeButton";
// 选择栏
import SelectionBar from "../../../CustomComponents/SelectionBar/SelectionBar";
import SecurityCenterBar from "../../../CustomComponents/SelectionBar/SecurityCenterBar";
import ProjectCenterBar from "../../../CustomComponents/SelectionBar/ProjectCenterBar";
import AiSelectBar from "../../../CustomComponents/SelectionBar/AiSelectBar";
import TrainingCenterBar from "../../../CustomComponents/SelectionBar/TrainingCenterBar";
//========================================================

//===================UI=======================
import { Typography, Card, Tag, Avatar, Layout, Menu } from "antd";
import { SolutionOutlined, UserOutlined, SafetyOutlined, UsergroupAddOutlined, ProjectOutlined, RobotOutlined, SettingOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Sider, Content } = Layout;

export default function UserProfile() {
    const userInfo = InfomationSystem.getCurrentLoginInfo();
    const isAdmin = InfomationSystem.getAdminState();
    const accountId = userInfo.accountId;

    // 当前选中菜单key
    const [activeKey, setActiveKey] = useState("profile");

    // 左侧菜单配置
    const menuItems = [
        {
            key: "profile",
            icon: <UserOutlined />,
            label: "个人资料"
        },
        {
            key: "setting",
            icon: <SafetyOutlined />,
            label: "安全设置"
        },
        {
            key: "personalCenter",
            icon: <UsergroupAddOutlined />,
            label: "个人中心"
        },
        {
            key: "projectionCenter",
            icon: <ProjectOutlined />,
            label: "项目中心"
        },
        {
            key: "training",
            icon: <SolutionOutlined />,
            label: "培训中心"
        },
        {
            key: "aiAssistant",
            icon: <RobotOutlined />,
            label: "AI助手"
        },

        // 管理员专属菜单
        ...(isAdmin ? [{
            key: "admin",
            icon: <SettingOutlined />,
            label: "管理员后台"
        }] : [])
    ];

    // 根据选中key渲染右侧内容
    const renderRightContent = () => {
        switch (activeKey) {
            case "profile":
                return (
                    <div style={{ padding: "16px" }}>
                        <Title level={4}>个人资料</Title>
                        <p>账号：{accountId}</p>
                        <p>权限：{isAdmin ? "管理员" : "普通用户"}</p>
                    </div>
                );
            case "setting":
                return <SecurityCenterBar />;
            case "personalCenter":
                return (
                    <div style={{ padding: "16px" }}>
                        <Title level={4}>个人中心</Title>
                    </div>
                );
            case "projectionCenter":
                return <ProjectCenterBar />;
            case "aiAssistant":
                return <AiSelectBar />;
            case "admin":
                return <SelectionBar />;
            case "training":
                return <TrainingCenterBar />
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: "100vh", backgroundColor: "#3d3bc7ff" }}>
            {/* 左侧栏：用户信息 + 导航菜单 */}
            <Sider
                width={240}
                style={{
                    background: Theme.defalutColor,
                    padding: "20px 16px"
                }}
            >
                {/* 用户信息卡片，整合原顶部面板 */}
                <Card
                    style={{
                        marginBottom: "24px",
                        backdropFilter: "blur(10px)",
                        textAlign: "center"
                    }}
                >
                    <Avatar
                        size={70}
                        src="/logo512.png"
                        icon={<UserOutlined />}
                        style={{ marginBottom: 12 }}
                    />
                    <Title level={5} style={{ margin: 0 }}>{accountId}</Title>
                    {isAdmin && <Tag color="red" style={{ marginTop: 8 }}>管理员</Tag>}
                    <div style={{ marginTop: 16 }}>
                        <LogoutButton />
                    </div>
                </Card>

                {/* 左侧导航菜单 */}
                <Menu
                    mode="vertical"
                    selectedKeys={[activeKey]}
                    onClick={({ key }) => setActiveKey(key)}
                    items={menuItems}
                    style={{
                        borderRight: "none",
                        borderRadius: "8px",  // 统一圆角大小
                        overflow: "hidden"
                    }}
                />
            </Sider>

            {/* 右侧内容区域 */}
            <Content style={{ margin: "20px", background: "#fff" }}>
                <Card
                    style={{
                        minHeight: "calc(100vh - 40px)",
                        backdropFilter: "blur(10px)",
                        background: Theme.defalutColor
                    }}
                >
                    {renderRightContent()}
                </Card>
            </Content>
        </Layout>
    );
}