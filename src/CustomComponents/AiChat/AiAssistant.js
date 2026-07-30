import { useEffect, useState, useRef } from "react";

//========自定义工具引入===========================
import { DebugTool }            from "../../Util/DebugTool/DebugTool";
import Theme                    from "../../Theme/theme";
// CSS样式
import { InfomationSystem }     from "../../InfomationSystem/InfomationSystem";
// Ai渲染样式
import MarkdownWithMath         from "../../Util/NormalUtils/MarkDown";
import "../../Theme/CSS/AiChat/AiChat.css";

// ========== Ant Design 组件 ==========
import { Card, Input, Button, Space, Typography }   from "antd";
import { SendOutlined, ClearOutlined }              from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;

// AI助手列表
function AiAssistant() {
    const [aiChatMessage, setAiChatMessage] = useState([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    // 自动滚动到底部
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [aiChatMessage]);

    // 新增消息
    const addMessage = (role, content) => {
        setAiChatMessage(prev => [...prev, {
            id: Date.now() + Math.random(),
            role,
            content
        }]);
    };

    // 发送消息
    const handleSend = async () => {
        const content = inputText.trim();
        DebugTool.debugLog(`用户发送(单句计入总对话): ${content}`);
        if (!content || loading) return;

        addMessage("user", content);
        const sendMessage = [...aiChatMessage, { role: "user", content }];
        DebugTool.debugLog(`用户当前送(未切割): ${sendMessage}`);

        setInputText("");
        setLoading(true);

        const validList = sendMessage.filter(item => item.content && item.content.trim());
        DebugTool.debugLog(`前端AI助手:尝试向AI发送有效聊天信息: ${validList}`);
        try {
            const response = await new Promise((resolve, reject) => {
                InfomationSystem.chatMessageToAi(sendMessage, (res) => {
                    if (res.error) reject(new Error(res.error));
                    else resolve(res);
                });
            });
            addMessage("assistant", response.response);
        } catch (err) {
            addMessage("assistant", "服务异常,请稍后重试");
        } finally {
            setLoading(false);
        }
    };

    // 清空对话
    const handleClear = () => {
        setAiChatMessage([]);
    };

    // 回车发送，Shift+Enter 换行
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{ width: "100%" }}>
            {/* 整体卡片容器，统一圆角、背景，不再使用 bordered */}
            <Card
                style={{
                    borderRadius: "10px",
                    background: Theme.defalutColor,
                    overflow: "hidden"
                }}
            >
                {/* 头部标题 */}
                <Title level={5} style={{ margin: "0 0 16px 0" }}>
                    AI 助手对话
                </Title>

                {/* 聊天内容区域 */}
                <div
                    style={{
                        height: "450px",
                        overflowY: "auto",
                        padding: "12px",
                        background: "#fafafa",
                        borderRadius: "8px",
                        marginBottom: "16px"
                    }}
                >
                    {aiChatMessage.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                display: "flex",
                                marginBottom: "12px",
                                justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: "70%",
                                    padding: "8px 12px",
                                    borderRadius: "12px",
                                    background: msg.role === "user" ? "#1677ff" : "#ffffff",
                                    color: msg.role === "user" ? "#fff" : "#333",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                                }}
                            >
                                <MarkdownWithMath content={msg.content} />
                            </div>
                        </div>
                    ))}

                    {/* 加载提示 */}
                    {loading && (
                        <div style={{ textAlign: "center", color: "#999", padding: "8px" }}>
                            AI 思考中...
                        </div>
                    )}

                    {/* 滚动锚点 */}
                    <div ref={chatEndRef} />
                </div>

                {/* 输入区域 */}
                <TextArea
                    rows={4}
                    placeholder="请输入聊天内容,Enter 发送,Shift+Enter 换行"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ borderRadius: "8px", marginBottom: "12px" }}
                />

                {/* 按钮组 */}
                <Space size="middle">
                    <Button
                        icon={<ClearOutlined />}
                        onClick={handleClear}
                    >
                        清空对话
                    </Button>
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSend}
                        loading={loading}
                    >
                        发送
                    </Button>
                </Space>
            </Card>
        </div>
    );
}

export default AiAssistant;