//=================自定义工具引入================================
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";
import CONSTPARAM from "../../Core/CONST/CONST";
import NormalTool from "../../Util/NormalUtils/NormalTool";
//==========================UI布局=========================
import { Layout, Typography, Menu, Form } from "antd";
import { HomeOutlined, InfoOutlined, UserAddOutlined, LoginOutlined, ReadOutlined } from "@ant-design/icons";

//====================编辑器======================
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";

const { Title } = Typography;
function TempTest() {

    const [form] = Form.useForm();

    const topChooseNav = [
        {
            key: "/1",
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
            label: "关于",
        },
        {
            key: "/3",
            label: "登录",
        },
        {
            key: "/4",
            label: "注册",
        },
        {
            key: "/5",
            label: "文章中心",
        },
    ]

    return (
        <Layout style={{ backgroundColor: "#2ca70dff" }}>
            <Title>测试各种功能</Title>
            <Menu
                mode="horizontal"
                theme="dark"
                items={topChooseNav}
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
            <Form form={form}>
                <Form.Item name="content" rules={[{ required: true }]}>
                    <MDEditor
                        onDrop={(e) => (NormalTool.uploadByDrop(e, form, "content"))}
                        onPaste={(e) => (NormalTool.uploadByPaste(e, form, "content"))}
                        value={form.getFieldValue('content')}
                        onChange={(val) => form.setFieldsValue({ content: val })}
                        height={600}
                        placeholder="编写Markdown文章..."
                    />
                </Form.Item>
            </Form>
        </Layout>
    );
}

export default TempTest;