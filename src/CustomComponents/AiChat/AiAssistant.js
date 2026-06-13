import { useEffect, useState, useRef } from "react";

//========自定义工具引入===========================
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import Theme from "../../Theme/theme";
// CSS样式
import "../../Theme/CSS/AiChat/AiChat.css"
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";
// Ai渲染样式
import MarkdownWithMath from "./MarkDown";

// AI助手列表
function AiAssistant() {
    const [aiChatMessage, setAiChatMessage] = useState([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);


    // 自动滚动到底部
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [aiChatMessage]);

    // 向ai发送信息
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

        // 添加用户消息(异步)
        addMessage('user', content);

        // 本次临时发送
        var sendMessage = [...aiChatMessage, { role: 'user', content }];

        DebugTool.debugLog(`用户当前送(未切割): ${sendMessage}`);

        setInputText('');
        setLoading(true);

        const validList = sendMessage.filter(item => item.content && item.content.trim());
        DebugTool.debugLog(`前端AI助手:尝试向AI发送有效聊天信息: ${validList}`)
        try {
            const response = await new Promise((resolve, reject) => {
                InfomationSystem.chatMessageToAi(sendMessage, (res) => {
                    if (res.error) reject(new Error(res.error));
                    else resolve(res);
                });
            });

            addMessage("assistant", response.response);
        } catch (err) {
            addMessage('assistant', "服务异常,请稍后重试");
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
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="ai-chat-wrapper">
            <div className="ai-chat-header">AI助手</div>

            <div className="ai-chat-content" id="chatContent">
                <div className="ai-chat-content">
                    {aiChatMessage.map((msg, idx) => (
                        <div key={idx} className={`chat-msg ${msg.role === 'user' ? 'msg-user' : 'msg-ai'}`}>
                            <div className="msg-bubble"><MarkdownWithMath content={msg.content} /></div>
                        </div>
                    ))}
                    {loading && <div className="chat-loading">AI 思考中...</div>}
                    <div ref={chatEndRef} />
                </div>
            </div>

            <div className="ai-chat-input-area">
                <textarea className="chat-textarea"
                    placeholder="请输入聊天内容"
                    value={inputText}
                    onChange={(e) => { setInputText(e.target.value) }}
                    onKeyDown={handleKeyDown}
                />
                <div className="chat-btn-group">
                    <button className="chat-btn btn-clear" onClick={handleClear}>清空</button>
                    <button className="chat-btn btn-send" onClick={handleSend}>发送</button>
                </div>
            </div>
        </div>

    );
}

export default AiAssistant;