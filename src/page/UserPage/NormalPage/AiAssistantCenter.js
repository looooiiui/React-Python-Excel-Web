//=============自定义工具===================
import Theme from "../../../Theme/theme";
//=============其他页面=================
import AiAssistant from "../../../CustomComponents/AiChat/AiAssistant";
//=============Ant Design 组件=============
import { Layout, Card, Typography } from "antd";

const { Content } = Layout;
const { Title } = Typography;

// 普通用户页
function AiAssistantCenter() {
    return (
        <Layout style={{ backgroundColor: "#3d3bc7ff", minHeight: "100%" }}>
            <Content style={{ padding: "24px" }}>
                <Card
                    style={{
                        borderRadius: "10px",
                        backdropFilter: "blur(10px)",
                        background: Theme.defalutColor
                    }}
                >
                    {/* 页面标题 */}
                    <Title level={4} style={{ margin: "0 0 20px 0" }}>
                        AI 助手中心
                    </Title>

                    {/* AI 聊天组件 */}
                    <AiAssistant />
                </Card>
            </Content>
        </Layout>
    );
}

export default AiAssistantCenter;