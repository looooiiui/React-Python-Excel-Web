import { Form, Input, Button, Typography, Card, message, Space, Layout, Modal } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, ReloadOutlined, SendOutlined, BookOutlined, RobotOutlined, FileTextOutlined } from '@ant-design/icons';
//=====================文本编辑器======================
import MDEditor from '@uiw/react-md-editor';

//===================自定义工具=======================
import Theme from '../../Theme/theme';
import { InfomationSystem } from '../../InfomationSystem/InfomationSystem';
import NormalTool from '../../Util/NormalUtils/NormalTool';
import SideAssistant from '../../CustomComponents/AiChat/SideAssistant';

const { Title } = Typography;
const { TextArea } = Input;
const { Sider, Content } = Layout;

function ArticlePublish() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [subLoading, setSubLoading] = useState(false);
    const [aiClose, setAiClose] = useState(true);

    // AI相关状态
    const [aiPromptText, setAiPromptText] = useState("");
    const [aiRequestLoading, setAiRequestLoading] = useState(false);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [aiGenerateResult, setAiGenerateResult] = useState("");

    // 自动同步表单标题到AI输入框
    const articleTitle = form.getFieldValue('title');
    useEffect(() => {
        // 仅当输入框为空时，自动填充标题，不覆盖用户手动输入内容
        if (!aiPromptText && articleTitle) {
            setAiPromptText(articleTitle);
        }
    }, [articleTitle]);

    // 表单提交发布文章
    const handleSubmit = (values) => {
        setSubLoading(true);
        InfomationSystem.addArticleOper(values.title, values.content, (res) => {
            setSubLoading(false);
            if (res === 99 || res.success == false) {
                message.error("发布失败，请稍后重试");
                return;
            }
            if (res.success) {
                message.success("文章发布成功，自动跳转列表");
                navigate('/article/list');
            }
        })
    };

    const onFinish = (values) => {
        console.log('文章表单数据：', values);
        handleSubmit(values);
    };

    const resetForm = () => {
        form.resetFields();
        setAiPromptText("");
    };

    const goBack = () => {
        navigate('/article/list');
    };

    // 通用AI单次请求函数（不记录对话，单次独立调用）
    const requestAiSingle = async (prompt) => {
        if (!prompt.trim()) {
            message.warning("请输入标题/创作需求");
            return null;
        }
        setAiRequestLoading(true);
        try {
            // 单次对话数组，无历史缓存，用完即弃
            const singleMsgList = [
                {
                    role: "user",
                    content: prompt
                }
            ];
            const response = await new Promise((resolve, reject) => {
                InfomationSystem.chatMessageToAi(singleMsgList, (res) => {
                    if (res.error) reject(new Error(res.error));
                    else resolve(res);
                });
            });
            return response.response;
        } catch (err) {
            message.error(`AI请求失败：${err.message}`);
            return null;
        } finally {
            setAiRequestLoading(false);
        }
    };

    // 功能1：生成完整文章（包含标题+正文）
    const handleGenerateFullArticle = async () => {
        const userPrompt = aiPromptText.trim();
        const fullPrompt = `根据需求生成一篇完整正式文章，包含标题与Markdown格式正文，需求：${userPrompt}。仅输出文章内容，不要多余解释。`;
        const result = await requestAiSingle(fullPrompt);
        if (result) {
            setAiGenerateResult(result);
            setPreviewModalOpen(true);
        }
    };

    // 功能2：润色已有正文
    const handlePolishContent = async () => {
        const originContent = form.getFieldValue('content');
        if (!originContent?.trim()) {
            message.warning("请先在编辑器输入需要润色的原文");
            return;
        }
        const polishPrompt = `润色下面这篇文章，优化语句逻辑、文笔流畅度，保留原有全部核心信息，输出Markdown格式，原文：
        ${originContent}`;
        const result = await requestAiSingle(polishPrompt);
        if (result) {
            setAiGenerateResult(result);
            setPreviewModalOpen(true);
        }
    };

    // 预览弹窗：确认将AI生成内容放入正文编辑器
    const handleInsertToEditor = () => {
        form.setFieldsValue({
            content: aiGenerateResult
        });
        setPreviewModalOpen(false);
        message.success("已将AI生成内容填入编辑器");
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '16px' }}>
            {/* 顶部操作栏 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Space>
                    <Button icon={<LeftOutlined />} onClick={goBack}>返回文章列表</Button>
                    <Title level={4} style={{ margin: 0 }}>发布新文章</Title>
                </Space>
                <Space size={12}>
                    <Button>保存草稿</Button>
                    <Button>定时发布</Button>
                    <Button type="primary" htmlType="submit" form="articleForm" loading={subLoading}>发布文章</Button>
                </Space>
            </div>

            {/* 核心三栏布局 Layout */}
            <Layout style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                {/* 左侧目录栏 */}
                <Sider width={220} style={{ background: '#fafafa', padding: 16 }}>
                    <div style={{ fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <BookOutlined /> 文章目录
                    </div>
                    <div style={{ color: '#999', fontSize: 13, marginTop: 20 }}>
                        输入带#标题后，自动生成目录(当然不会生成了)
                    </div>
                </Sider>

                {/* 中间主编辑区 */}
                <Content style={{ padding: '24px 40px', minHeight: 700, maxWidth: 900 }}>
                    <Form
                        id="articleForm"
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{ title: '', content: '' }}
                    >
                        {/* 标题输入框 */}
                        <Form.Item
                            name="title"
                            rules={[
                                { required: true, message: '请输入文章标题' },
                                { min: 5, max: 100, message: '标题需5~100字' }
                            ]}
                        >
                            <Input
                                placeholder="请输入文章标题 (5 ~ 100个字)"
                                style={{ fontSize: 24, fontWeight: 500, padding: '12px 0', borderBottom: '1px solid #eee' }}
                                maxLength={100}
                            />
                        </Form.Item>

                        {/* 正文编辑区 */}
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
                </Content>

                {/* 右侧AI助手侧边栏 */}
                <Sider width={280} style={{ background: '#fafafa', padding: 16, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <RobotOutlined /> AI写作助手
                    </div>
                    <div style={{ background: '#fff', padding: 12, borderRadius: 6, marginBottom: 16 }}>
                        <div style={{ fontSize: 13, color: "#666" }}>创作热点推荐</div>
                        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ background: '#f0f2f5', padding: 6, borderRadius: 4, fontSize: 12 }}>待开发</div>
                            <div style={{ background: '#f0f2f5', padding: 6, borderRadius: 4, fontSize: 12 }}>待开发</div>
                        </div>
                    </div>

                    {/* AI输入与功能按钮区域 */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <Input
                            placeholder="按照标题生成文章"
                            allowClear
                            value={aiPromptText}
                            onChange={(e) => setAiPromptText(e.target.value)}
                            style={{ marginBottom: 10 }}
                        />

                        <Space direction="vertical" size={10} style={{ width: "100%" }}>
                            <Button
                                block
                                icon={<FileTextOutlined />}
                                loading={aiRequestLoading}
                                onClick={handleGenerateFullArticle}
                            >
                                生成完整文章
                            </Button>
                            <Button
                                block
                                loading={aiRequestLoading}
                                onClick={handlePolishContent}
                            >
                                润色现有正文
                            </Button>
                        </Space>
                    </div>
                </Sider>
            </Layout>

            {/* AI生成内容预览弹窗 */}
            <Modal
                title="AI生成内容预览"
                open={previewModalOpen}
                width={800}
                maskClosable={false}
                footer={
                    <Space>
                        <Button onClick={() => setPreviewModalOpen(false)}>取消</Button>
                        <Button type="primary" onClick={handleInsertToEditor}>放入正文</Button>
                    </Space>
                }
            >
                <div style={{ minHeight: 400, background: "#fafafa", padding: 16, borderRadius: 6, whiteSpace: "pre-wrap" }}>
                    {aiGenerateResult}
                </div>
            </Modal>
        </div>
    );
}

export default ArticlePublish;