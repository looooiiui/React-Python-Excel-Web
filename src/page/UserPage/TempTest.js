//=================自定义工具引入================================
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";
import CONSTPARAM from "../../Core/CONST/CONST";
//==========================UI布局=========================
import { Layout, Typography, Menu } from "antd";
import { HomeOutlined, InfoOutlined, UserAddOutlined, LoginOutlined, ReadOutlined } from "@ant-design/icons";

const { Title } = Typography;
function TempTest() {

    const topMenuItems = [
        {
            key: "/1",
            icon: <HomeOutlined />,
            label: "首页",
            children: [
                {
                    key: CONSTPARAM.TRAINEEMANAGERURL,
                    label: "账号列表",
                },
                {
                    key: "/user/security",
                    label: "安全中心",
                }
            ]
        },
        {
            key: "/2",
            icon: <InfoOutlined />,
            label: "关于",
        },
        {
            key: "/3",
            icon: <LoginOutlined />,
            label: "登录",
        },
        {
            key: "/4",
            icon: <UserAddOutlined />,
            label: "注册",
        },
        {
            key: "/5",
            icon: <ReadOutlined />,
            label: "文章中心",
        },
    ]

    return (
        <Layout style={{ backgroundColor: "#14be30ff" }}>
            <Title>测试哦</Title>
            <Menu
                mode="horizontal"
                theme="dark"
                items={topMenuItems}
                popupRender={(menus) => (
                    <div style={{
                        fontSize: "14px",
                        background: "#0047AB",
                    }}>
                        {menus}
                    </div>
                )}
                style={{
                    flex: 1,
                    background: "transparent",
                    borderBottom: "none",
                    lineHeight: "80px",
                    fontSize: "20px",
                }}
            >
            </Menu>
        </Layout>
    );
}

export default TempTest;