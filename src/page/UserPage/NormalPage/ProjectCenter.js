import Theme from "../../../Theme/theme";
import { useState } from "react";
//=============自定义组件引入=======================
import ThemedButton from "../../../CustomComponents/OverrideCom/OverrideButton/ThemeButton";
import { InfomationSystem } from "../../../InfomationSystem/InfomationSystem";
import ProjectionList from "../../../CustomComponents/ProjectionList/ProjectionList";
import ProjectionListNormal from "../../../CustomComponents/ProjectionList/ProjectionListNormal";
import SpecificProjectionList from "../../../CustomComponents/ProjectionList/SpecificProjectionList";

//================UI库引入=======================
import { Layout, Menu, Typography } from "antd";
import { FolderOpenOutlined, PlusOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Title } = Typography;

// 普通用户页
function ProjectCenter() {
    // 菜单切换
    const [selectedKey, setSelectedKey] = useState("ProjectionManager");
    const isAdmin = InfomationSystem.getAdminState();
    // 左侧菜单配置
    const menuItems = [
        {
            key: "ProjectionManager",
            icon: <FolderOpenOutlined />,
            label: "当前项目管理"
        },
        {
            key: "JoinProjection",
            icon: <PlusOutlined />,
            label: "加入项目"
        }
    ];

    // 右侧内容映射
    const contentMap = {
        "ProjectionManager": (
            <div>
                <Title level={4}>当前加入项目</Title>
                <SpecificProjectionList />
            </div>
        ),
        "JoinProjection": (
            <div>
                <Title level={4}>当前所有项目</Title>
                {isAdmin ? <ProjectionList /> : <ProjectionListNormal />}
            </div>
        )
    };

    return (
        <Layout style={{ minHeight: "400px", background: "transparent" }}>
            <div style={Theme.ManagerBackendTheme}></div>
            {/* 左侧导航菜单 */}
            <Sider width={200} theme="light" style={{ background: "#fff", borderRadius: "8px" }}>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={({ key }) => setSelectedKey(key)}
                    items={menuItems}
                    style={{ height: "100%", borderRight: 0 }}
                />
            </Sider>

            {/* 右侧内容区域 */}
            <Content style={{ padding: "0 24px", background: "transparent" }}>
                {contentMap[selectedKey]}
            </Content>
        </Layout>
    );
}

export default ProjectCenter;