//===============自定义工具引入===================
import { DebugTool } from "../../../Util/DebugTool/DebugTool";
import { InfomationSystem } from "../../../InfomationSystem/InfomationSystem";
import Theme from "../../../Theme/theme";
import { useState } from "react";

//=============自定义组件引入=======================
import ThemedButton from "../../../CustomComponents/OverrideCom/OverrideButton/ThemeButton";
import TrainingList from "../../../CustomComponents/TrainingList/TrainingList";
import TrainingNormalList from "../../../CustomComponents/TrainingList/TrainingNormalList";
import MyTrainingList from "../../../CustomComponents/TrainingList/MyTrainingList";
// 新增班次管理组件
import TrainClassList from "../../../CustomComponents/TrainingList/TrainClassList";

//================UI库引入=======================
import { Layout, Menu, Typography } from "antd";
import { BookOutlined, PlusOutlined, TeamOutlined, ScheduleOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Title } = Typography;

// 培训中心中转主页
function TrainingCenter() {
    // 侧边菜单选中key
    const [selectedKey, setSelectedKey] = useState("MyTraining");
    // 获取管理员权限状态
    const isAdmin = InfomationSystem.getAdminState();

    // 左侧侧边栏菜单配置
    const menuItems = [
        {
            key: "MyTraining",
            icon: <TeamOutlined />,
            label: "我的培训课程"
        },
        {
            key: "AllTraining",
            icon: <BookOutlined />,
            label: "全部培训课程"
        },
        // 管理员专属：班次管理
        ...(isAdmin ? [
            {
                key: "ClassManage",
                icon: <ScheduleOutlined />,
                label: "培训班次管理"
            },
            {
                key: "CreateTraining",
                icon: <PlusOutlined />,
                label: "创建培训课程"
            }
        ] : [])
    ];

    // 菜单对应右侧内容映射
    const contentMap = {
        // 本人已报名/参与的培训
        "MyTraining": (
            <div>
                <Title level={4}>我的培训课程</Title>
                <MyTrainingList />
            </div>
        ),
        // 全部课程，管理员完整列表，普通用户精简列表
        "AllTraining": (
            <div>
                <Title level={4}>全部公开培训课程</Title>
                {isAdmin ? <TrainingList /> : <TrainingNormalList />}
            </div>
        ),
        // 班次管理页面
        "ClassManage": (
            <div>
                <Title level={4}>培训班次管理</Title>
                <TrainClassList />
            </div>
        ),
        // 管理员创建课程入口
        "CreateTraining": (
            <div style={{ paddingBottom: 16 }}>
                <Title level={4}>新建培训课程</Title>
                <ThemedButton type="primary" onClick={() => setSelectedKey("CreateTraining")}>新增培训课程</ThemedButton>
                <TrainingList />
            </div>
        )
    };

    return (
        <Layout style={{ minHeight: "400px", background: "transparent" }}>
            {/* 全局后台主题样式挂载 */}
            <div style={Theme.ManagerBackendTheme}></div>

            {/* 左侧导航侧边栏 */}
            <Sider width={200} theme="light" style={{ background: "#fff", borderRadius: "8px" }}>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={({ key }) => setSelectedKey(key)}
                    items={menuItems}
                    style={{ height: "100%", borderRight: 0 }}
                />
            </Sider>

            {/* 右侧主内容区 */}
            <Content style={{ padding: "0 24px", background: "transparent" }}>
                {contentMap[selectedKey]}
            </Content>
        </Layout>
    );
}

export default TrainingCenter;