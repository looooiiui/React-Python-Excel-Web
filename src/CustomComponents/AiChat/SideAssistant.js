import { useEffect, useState, useRef } from "react";

//========自定义工具引入===========================
import { DebugTool }    from "../../Util/DebugTool/DebugTool";
import Theme            from "../../Theme/theme";
// CSS样式
import "../../Theme/CSS/AiChat/AiChat.css";
import { InfomationSystem }     from "../../InfomationSystem/InfomationSystem";
// Ai渲染样式
import MarkdownWithMath         from "../../Util/NormalUtils/MarkDown";

// ========== Ant Design 组件 ==========
import { Input, Button, Space, Typography, Drawer }                     from "antd";
import { SendOutlined, ClearOutlined, RobotOutlined, LeftOutlined }     from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;

/**
 * 侧边悬浮AI助手组件
 * @param {boolean} visible 外部控制抽屉显示/隐藏
 * @param {boolean} isFold 抽屉折叠状态
 * @param {Function} onClose 关闭抽屉回调
 * @param {Array} initMessages 初始对话数组 [{role:"user/assistant", content:"xxx"}] 仅首次渲染初始化，不覆盖用户消息
 * @param {number} width 抽屉自定义宽度 默认420
 * @param {number} height 聊天区域自定义高度 默认450
 * @param {number} useWidth 使用时宽度
 */
const SideAssistant = ({
    visible = false,
    onClose,
    initMessages = [],
    width = 420,
    height = 450
}) => {
    // 本地会话记录：仅组件第一次挂载用initMessages填充，用户发送消息永久保存
    const [aiChatMessage, setAiChatMessage] = useState(() => {
        // 兜底确保一定是数组，防止 not iterable
        return Array.isArray(initMessages) ? [...initMessages] : [];
    });

    // 折叠状态
    const [isFold, setIsFold] = useState(false);
    const [useWidth, setUseWidth] = useState(width)

    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);
    // 标记是否已经完成初始化，避免initMessages重复覆盖会话
    const isInitComplete = useRef(false);

    // 自动滚动到底部，仅抽屉打开时执行
    useEffect(() => {
        if (visible) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [aiChatMessage, visible, isFold]);

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

    // 清空对话（仅清空本地，不重置初始默认对话）
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
        <Drawer
            title={
                <Space>
                    <RobotOutlined />
                    <span>AI 智能助手</span>
                </Space>
            }
            placement="right"
            open={visible}
            onClose={onClose}
            size={useWidth}
            mask={false}
            closable={false}
            styles={{
                body: { padding: "12px 0" }
            }}
        >
            {isFold ? (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                    <Button
                        icon={<RobotOutlined />}
                        onClick={() => { setIsFold(false); setUseWidth(width) }}
                        shape="circle"
                        title="展开AI助手"
                    />
                    <Button
                        danger
                        icon={<ClearOutlined />}
                        onClick={handleClear}
                        shape="circle"
                        title="清空对话"
                    />
                    <Button
                        icon={<LeftOutlined />}
                        onClick={onClose}
                        shape="circle"
                        title="完全关闭抽屉"
                    />
                </div>
            ) : (
                <>
                    {/* 完整聊天区域 */}
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
                        <Button onClick={() => { setIsFold(true); setUseWidth(100) }}>折叠AI聊天</Button>
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
                        {loading && (
                            <div style={{ textAlign: "center", color: "#999", padding: "8px" }}>
                                AI 思考中...
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* 输入区域 */}
                    <TextArea
                        rows={4}
                        placeholder="Enter发送，Shift+Enter换行"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ borderRadius: "8px", marginBottom: "12px" }}
                    />

                    {/* 底部按钮 */}
                    <Space size="middle">
                        <Button icon={<ClearOutlined />} onClick={handleClear}>清空对话</Button>
                        <Button type="primary" icon={<SendOutlined />} onClick={handleSend} loading={loading}>发送</Button>
                    </Space>
                </>
            )}
        </Drawer>
    );
};

export default SideAssistant;