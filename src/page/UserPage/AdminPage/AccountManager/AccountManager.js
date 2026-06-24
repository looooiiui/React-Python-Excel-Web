import { useState } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, UserAddOutlined } from "@ant-design/icons";
//====================自定义组件引入============================
import AddAccountPage from "../../../../CustomComponents/AccountList/AddAccountPage";
import AccountLists from "../../../../CustomComponents/AccountList/AccountList";
import CONSTPARAM from "../../../../Core/CONST/CONST";
import Theme from "../../../../Theme/theme";

const { Sider, Content } = Layout;

function AccountManger() {
    // 当前激活页面 key: list / add
    const [activePage, setActivePage] = useState("list");

    // 菜单切换
    const handleMenuClick = ({ key }) => {
        setActivePage(key);
    };

    return (
        <Layout style={{ minHeight: "calc(100vh - 64px)" }}>
            <div style={Theme.ManagerBackendTheme}></div>
            {/* 左侧侧边栏菜单 */}
            <Sider width={200} style={{ background: "#fff" }}>
                <div style={{ padding: "16px", fontSize: 16, fontWeight: 600, borderBottom: "1px solid #eee" }}>
                    用户管理
                </div>
                <Menu
                    mode="vertical"
                    selectedKeys={[activePage]}
                    onClick={handleMenuClick}
                    style={{ borderRight: 0 }}
                >
                    <Menu.Item key="list" icon={<UserOutlined />}>
                        用户列表（查看/删除/切换封禁）
                    </Menu.Item>
                    <Menu.Item key="add" icon={<UserAddOutlined />}>
                        新增系统用户
                    </Menu.Item>
                </Menu>
            </Sider>

            {/* 右侧主内容区域 */}
            <Content style={{ padding: 16 }}>
                <h1 style={{ marginBottom: 16 }}>
                    {activePage === "list" ? "用户列表管理" : "新增系统账号"}
                </h1>
                {/* 根据菜单key切换页面组件 */}
                {activePage === "list" && <AccountLists />}
                {activePage === "add" && <AddAccountPage />}
            </Content>
        </Layout>
    );
}

export default AccountManger;