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
//========================================================

//===================UI=======================
import { Button, Typography, Card, Tag, Avatar, Tabs } from "antd";
import { UserOutlined, SafetyOutlined, UsergroupAddOutlined, ProjectOutlined, RobotOutlined, SettingOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function UserProfile() {
    const userInfo = InfomationSystem.getCurrentLoginInfo();
    const isAdmin = InfomationSystem.getAdminState();
    const accountId = userInfo.accountId;

    // 菜单切换（改用 antd Tabs 的 activeKey）
    const [activeTab, setActiveTab] = useState("profile");

    // Tabs 配置
    const tabItems = [
        {
            key: "profile",
            label: "个人资料",
            icon: <UserOutlined />,
            children: (
                <div>
                    <Title level={4}>个人资料</Title>
                    <p>账号：{accountId}</p>
                    <p>权限：{isAdmin ? "管理员" : "普通用户"}</p>
                </div>
            )
        },
        {
            key: "setting",
            label: "安全设置",
            icon: <SafetyOutlined />,
            children: <SecurityCenterBar />
        },
        {
            key: "personalCenter",
            label: "个人中心",
            icon: <UsergroupAddOutlined />,
            children: (
                <div>
                    <Title level={4}>个人中心</Title>
                    {/* 后续可以加内容 */}
                </div>
            )
        },
        {
            key: "projectionCenter",
            label: "项目中心",
            icon: <ProjectOutlined />,
            children: <ProjectCenterBar />
        },
        {
            key: "aiAssistant",
            label: "AI助手",
            icon: <RobotOutlined />,
            children: <AiSelectBar />
        },
        // 管理员专用标签
        ...(isAdmin ? [{
            key: "admin",
            label: "管理员后台",
            icon: <SettingOutlined />,
            children: <SelectionBar />
        }] : [])
    ];

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
            <Card
                style={{
                    marginBottom: "20px",
                    background: Theme.defalutColor,
                    backdropFilter: "blur(10px)"
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                        <Avatar
                            size={60}
                            src="/logo512.png"
                            icon={<UserOutlined />}
                        />
                        <div>
                            <Title level={4} style={{ margin: 0 }}>{accountId}</Title>
                            {isAdmin && <Tag color="red">管理员</Tag>}
                        </div>

                    </div>
                    <LogoutButton />
                </div>
            </Card>
            <Card
                style={{
                    marginBottom: "20px",
                    backgroundColor: Theme.defalutColor,
                    backdropFilter: "blur(10px)"
                }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems} />
            </Card>
        </div>
    );
}