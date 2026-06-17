import { Form, Input, Button, Typography, Card, message, Space, Layout } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, ReloadOutlined, SendOutlined, BookOutlined, RobotOutlined } from '@ant-design/icons';
//=====================文本编辑器======================
import MDEditor from '@uiw/react-md-editor';
//===================自定义工具=======================
import Theme from '../../Theme/theme';
import { InfomationSystem } from '../../InfomationSystem/InfomationSystem';

const { Title } = Typography;
const { TextArea } = Input;
const { Sider, Content } = Layout;

function ArticlePublish() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [subLoading, setSubLoading] = useState(false);

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
    };

    const goBack = () => {
        navigate('/article/list');
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
                        输入带#标题后，自动生成目录
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
                        {/* 标题输入框（仿CSDN大输入框） */}
                        <Form.Item
                            name="title"
                            rules={[
                                { required: true, message: '请输入文章标题' },
                                { min: 5, max: 100, message: '标题需5~100字' }
                            ]}
                        >
                            <Input
                                placeholder="请输入文章标题 (5 ~ 100个字)"
                                bordered={false}
                                style={{ fontSize: 24, fontWeight: 500, padding: '12px 0', borderBottom: '1px solid #eee' }}
                                maxLength={100}
                            />
                        </Form.Item>

                        {/* 正文编辑区 */}
                        <Form.Item name="content" rules={[{ required: true }]}>
                            <MDEditor
                                value={form.getFieldValue('content')}
                                onChange={(val) => form.setFieldsValue({ content: val })}
                                height={600}
                                placeholder="编写Markdown文章..."
                            />
                        </Form.Item>
                    </Form>
                </Content>

                {/* 右侧AI助手侧边栏 */}
                <Sider width={280} style={{ background: '#fafafa', padding: 16 }}>
                    <div style={{ fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <RobotOutlined /> AI写作助手
                    </div>
                    <div style={{ background: '#fff', padding: 12, borderRadius: 6, marginBottom: 16 }}>
                        <div style={{ fontSize: 13, color: "#666" }}>创作热点推荐</div>
                        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ background: '#f0f2f5', padding: 6, borderRadius: 4, fontSize: 12 }}>浏览器HTML头部底层逻辑</div>
                            <div style={{ background: '#f0f2f5', padding: 6, borderRadius: 4, fontSize: 12 }}>每日算法快闪</div>
                        </div>
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                        <Input placeholder="输入需求生成文章" allowClear />
                        <Button block style={{ marginTop: 8 }}>AI生成内容</Button>
                    </div>
                </Sider>
            </Layout>
        </div>
    );
}

export default ArticlePublish;