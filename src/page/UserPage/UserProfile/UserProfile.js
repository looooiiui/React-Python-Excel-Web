import { useState } from "react";
import { useNavigate } from "react-router-dom";
//===============自定义组件引入============================
import { InfomationSystem } from "../../../InfomationSystem/InfomationSystem";
import LogoutButton from "../../../CustomComponents/CustomButton/LogoutButton";
import Theme from "../../../Theme/theme";
import ThemedButton from "../../../CustomComponents/OverrideCom/OverrideButton/ThemeButton";

// 分栏页面组件
import SelectionBar from "../../../CustomComponents/SelectionBar/SelectionBar";
import SecurityCenterBar from "../../../CustomComponents/SelectionBar/SecurityCenterBar";
import ProjectCenterBar from "../../../CustomComponents/SelectionBar/ProjectCenterBar";
import AiSelectBar from "../../../CustomComponents/SelectionBar/AiSelectBar";
import TrainingCenterBar from "../../../CustomComponents/SelectionBar/TrainingCenterBar";
//========================================================

//===================Ant Design UI=======================
import { Typography, Card, Tag, Avatar, Layout, Menu, Space, Divider } from "antd";
import {
    SolutionOutlined,
    UserOutlined,
    SafetyOutlined,
    UsergroupAddOutlined,
    ProjectOutlined,
    RobotOutlined,
    SettingOutlined,
    BookOutlined,
    LockOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    BarChartOutlined
} from "@ant-design/icons";
import CONSTPARAM from "../../../Core/CONST/CONST";

const { Title, Text, Paragraph } = Typography;
const { Sider, Content } = Layout;


export default function UserProfile() {
    const userInfo = InfomationSystem.getCurrentLoginInfo();
    const isAdmin = InfomationSystem.getAdminState();
    const accountId = userInfo.accountId;
    const navigate = useNavigate();

    // 当前侧边菜单选中key
    const [activeKey, setActiveKey] = useState("profile");

    // 左侧导航菜单配置
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
            icon: <BookOutlined />,
            label: "个人文章"
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

    // 右侧主内容渲染分发（全部填充完整业务内容，不空白）
    const renderRightContent = () => {
        switch (activeKey) {
            // 1. 个人资料页
            case "profile":
                return (
                    <div style={{ padding: "8px 12px" }}>
                        <Title level={3} style={{ color: Theme.theme.primary, marginBottom: 24 }}>个人资料</Title>
                        <Space size={24} direction="vertical">
                            <Card style={{ width: "100%" }}>
                                <Space size={16} align="start">
                                    <Avatar size={90} src="/logo512.png" icon={<UserOutlined />} />
                                    <div>
                                        <Title level={4} style={{ margin: 0 }}>账号：{accountId}</Title>
                                        <Space style={{ marginTop: 8 }}>
                                            <Tag color={isAdmin ? "#f5222d" : "#1890ff"}>
                                                {isAdmin ? "系统管理员" : "普通用户"}
                                            </Tag>
                                            <Tag color="#52c41a">账号正常可用</Tag>
                                        </Space>
                                        <Paragraph style={{ marginTop: 12, color: "#666" }}>
                                            该账号用于访问研究院官网、文章发布、项目协作、AI对话、培训报名等全部系统功能。
                                            {isAdmin ? " 管理员拥有用户管理、文章审核、项目配置、培训数据管理全部权限。" : " 仅拥有个人信息修改、自有文章管理、参与项目、AI基础对话权限。"}
                                        </Paragraph>
                                    </div>
                                </Space>
                            </Card>

                            <Card title="账号基础信息" bordered={false}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <Text type="secondary">登录账号ID</Text>
                                        <Paragraph style={{ fontSize: 16, margin: 0 }}>{accountId}</Paragraph>
                                    </div>
                                    <div>
                                        <Text type="secondary">账号权限等级</Text>
                                        <Paragraph style={{ fontSize: 16, margin: 0 }}>{isAdmin ? "管理员 Admin" : "普通用户 User"}</Paragraph>
                                    </div>
                                    <div>
                                        <Text type="secondary">账号状态</Text>
                                        <Paragraph style={{ fontSize: 16, margin: 0 }}>正常 未封禁</Paragraph>
                                    </div>
                                    <div>
                                        <Text type="secondary">功能权限</Text>
                                        <Paragraph style={{ fontSize: 16, margin: 0 }}>
                                            {isAdmin ? "全系统管理权限" : "个人基础访问权限"}
                                        </Paragraph>
                                    </div>
                                </div>
                            </Card>

                            <Card title="快捷操作" bordered={false}>
                                <Space size={12}>
                                    <ThemedButton icon={<LockOutlined />} onClick={() => setActiveKey("setting")}>
                                        修改登录密码
                                    </ThemedButton>
                                    {isAdmin && (
                                        <ThemedButton icon={<TeamOutlined />} onClick={() => setActiveKey("admin")}>
                                            进入用户管理后台
                                        </ThemedButton>
                                    )}
                                </Space>
                            </Card>
                        </Space>
                    </div>
                );

            // 2. 安全设置页面（复用你写好的安全中心组件）
            case "setting":
                return (
                    <div style={{ padding: "8px 12px" }}>
                        <Title level={3} style={{ color: Theme.theme.primary }}>账号安全设置</Title>
                        <Divider />
                        <SecurityCenterBar />
                        <Divider style={{ margin: "32px 0" }} />
                        <Card title="安全须知" bordered={false}>
                            <ul style={{ color: "#666", lineHeight: 2 }}>
                                <li>登录密码长度建议大于6位，字母+数字组合提升账号安全性</li>
                                <li>请勿向他人泄露账号、密码，避免异地异常登录</li>
                                <li>若账号出现异常访问，可联系管理员协助重置密码</li>
                                <li>退出登录会清除本地存储登录身份，公共设备使用后务必登出</li>
                            </ul>
                        </Card>
                    </div>
                );

            // 3. 个人文章中心
            case "personalCenter":
                return (
                    <div style={{ padding: "8px 12px" }}>
                        <Title level={3} style={{ color: Theme.theme.primary }}>个人成果文章</Title>
                        <Paragraph type="secondary">查看、编辑、发布本人创建的研究院新闻、学术成果、技术随笔</Paragraph>
                        <Divider />
                        <Space size={16} direction="vertical" style={{ width: "100%" }}>
                            <Card>
                                <Space size={12} align="center">
                                    <BookOutlined style={{ fontSize: 28, color: Theme.theme.primary }} />
                                    <div>
                                        <Title level={5} style={{ margin: 0 }}>成果文章管理</Title>
                                        <Text type="secondary">可新建图文成果、修改已发布文章、删除废弃内容，首页自动展示已公开文章</Text>
                                    </div>
                                    <ThemedButton
                                        style={{ marginLeft: "auto" }}
                                        onClick={() => { navigate(`${CONSTPARAM.ARTICLEURL}/list`) }}
                                    >
                                        进入文章管理
                                    </ThemedButton>
                                </Space>
                            </Card>
                            <Card>
                                <Space size={12} align="center">
                                    <BarChartOutlined style={{ fontSize: 28, color: "#13c2c2" }} />
                                    <div>
                                        <Title level={5} style={{ margin: 0 }}>文章浏览统计</Title>
                                        <Text type="secondary">查看本人所有文章总访问量、单篇阅读数据、发布时间排行</Text>
                                    </div>
                                    <ThemedButton style={{ marginLeft: "auto" }}>查看数据</ThemedButton>
                                </Space>
                            </Card>
                        </Space>
                    </div>
                );

            // 4. 项目协作中心
            case "projectionCenter":
                return (
                    <div style={{ padding: "8px 12px" }}>
                        <Title level={3} style={{ color: Theme.theme.primary }}>项目协作中心</Title>
                        <Paragraph type="secondary">查看你参与/创建的AI科研项目、团队分工、项目文档、协作成员</Paragraph>
                        <Divider />
                        <ProjectCenterBar />
                    </div>
                )
            // 5. 培训报名与课程中心
            case "training":
                return (
                    <div style={{ padding: "8px 12px" }}>
                        <Title level={3} style={{ color: Theme.theme.primary }}>AI培训中心</Title>
                        <Paragraph type="secondary">浏览培训课程、报名班次、查看考勤记录、个人成绩、往期培训资料</Paragraph>
                        <Divider />
                        <TrainingCenterBar />
                    </div>
                )
            // 6. AI智能助手
            case "aiAssistant":
                return (
                    <div style={{ padding: "8px 12px" }}>
                        <Title level={3} style={{ color: Theme.theme.primary }}>AI智能助手</Title>
                        <Paragraph type="secondary">大模型对话，支持学术咨询、文案生成、代码辅助、方案撰写、数据思路梳理</Paragraph>
                        <Divider />
                        <AiSelectBar />
                    </div>
                )
            // 7. 管理员后台
            case "admin":
                return (
                    <div style={{ padding: "8px 12px" }}>
                        <Title level={3} style={{ color: Theme.theme.primary }}>系统管理员后台</Title>
                        <Paragraph type="secondary">仅管理员账号可见，管理全部系统用户、配置账号权限、查看全量文章、培训数据、项目总览</Paragraph>
                        <Divider />
                        <SelectionBar />
                    </div>
                )
            default:
                return <div style={{ padding: 20 }}>功能页面加载中...</div>;
        }
    };

    return (
        <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
            {/* 左侧侧边栏 */}
            <Sider
                width={260}
                style={{
                    background: Theme.defaultColor,
                    padding: "24px 16px",
                    boxShadow: "2px 0 8px rgba(0,0,0,0.06)"
                }}
            >
                {/* 用户信息卡片 */}
                <Card
                    style={{
                        marginBottom: "32px",
                        textAlign: "center",
                        background: "rgba(255,255,255,0.12)",
                        border: "none",
                        borderRadius: 12
                    }}
                >
                    <Avatar
                        size={80}
                        src="/logo512.png"
                        icon={<UserOutlined />}
                        style={{ marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                    />
                    <Title level={5} style={{ margin: 0, color: "#fff" }}>{accountId}</Title>
                    {isAdmin && <Tag color="#ff4d4f" style={{ marginTop: 10 }}>系统管理员</Tag>}
                    <Divider style={{ margin: "16px 0", borderColor: "rgba(255,255,255,0.2)" }} />
                    <LogoutButton />
                </Card>

                {/* 侧边导航菜单 */}
                <Menu
                    mode="vertical"
                    selectedKeys={[activeKey]}
                    onClick={({ key }) => setActiveKey(key)}
                    items={menuItems}
                    style={{
                        background: "transparent",
                        borderRight: "none"
                    }}
                    theme="dark"
                />
            </Sider>

            {/* 右侧主内容区域 */}
            <Content style={{ margin: "24px", overflow: "auto" }}>
                <Card
                    style={{
                        minHeight: "calc(100vh - 48px)",
                        borderRadius: 12,
                        boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
                        background: "#ffffff",
                        border: "none"
                    }}
                >
                    {renderRightContent()}
                </Card>
            </Content>
        </Layout>
    );
}