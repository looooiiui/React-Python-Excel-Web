import { Form, Input, Button, Typography, Card, message, Layout, Space, Spin, Divider } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LeftOutlined, ReloadOutlined, SaveOutlined, DeleteOutlined, BookOutlined, InfoCircleOutlined } from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';

//=============自定义工具===========================
import Theme from '../../Theme/theme';
import { InfomationSystem } from '../../InfomationSystem/InfomationSystem';
import CONSTPARAM from '../../Core/CONST/CONST';
import NormalTool from '../../Util/NormalUtils/NormalTool';

const { Title, Text } = Typography;
const { Sider, Content } = Layout;
const { TextArea } = Input;

function ArticleEdit() {
    const { id } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const articleRef = useRef(null);
    const hasFetched = useRef(false);

    // 拉取文章详情回填表单
    const fetchArticleData = () => {
        if (!id) return;
        setLoading(true);
        InfomationSystem.getArticleDetailOper(id, (res) => {
            setLoading(false);
            if (res === 99) {
                message.error("文章加载失败，跳转列表");
                navigate(`${CONSTPARAM.ARTICLEBASE}/list`);
                return;
            }
            articleRef.current = res;
            form.setFieldsValue({
                title: res.title,
                content: res.content
            });
            hasFetched.current = true;
        });
    };

    // 初次加载数据
    useEffect(() => {
        if (!id || hasFetched.current) return;
        fetchArticleData();
    }, [id]);

    // 提取目录标题（左侧目录栏）
    const getCatalog = () => {
        const content = form.getFieldValue('content');
        if (!content) return [];
        const reg = /^#{1,6}\s(.+)$/gm;
        const list = [];
        let match;
        while ((match = reg.exec(content)) !== null) {
            list.push(match[1]);
        }
        return list;
    };

    // 提交更新
    const handleUpdate = (values) => {
        setSubmitLoading(true);
        InfomationSystem.updateArticleOper(id, values.title, values.content, (res) => {
            setSubmitLoading(false);
            if (res === 99) {
                message.error("修改失败，请重试");
                return;
            }
            if (res.code === "0") {
                message.success("文章修改完成，自动跳转列表");
                navigate(`${CONSTPARAM.ARTICLEBASE}/list`);
            }
        });
    };

    const onFinish = (values) => {
        console.log('编辑提交数据：', values, '文章ID:', id);
        handleUpdate(values);
    };

    // 删除当前文章
    const handleDelete = () => {
        InfomationSystem.delArticleOper(id, res => {
            if (res.success) {
                message.success("删除成功");
                navigate(`${CONSTPARAM.ARTICLEBASE}/list`);
            } else {
                message.error("删除失败");
            }
        });
    };

    // 加载中遮罩
    if (loading) {
        return (
            <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" tip="加载文章数据中..." />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: 16 }}>
            {/* 顶部操作栏 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Space size={12}>
                    <Button icon={<LeftOutlined />} onClick={() => navigate(`${CONSTPARAM.ARTICLEBASE}/list`)}>
                        返回列表
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={fetchArticleData}>
                        重载原文
                    </Button>
                    <Title level={4} style={{ margin: 0 }}>编辑文章</Title>
                </Space>
                <Space size={12}>
                    <Button>保存草稿</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        form="editArticleForm"
                        icon={<SaveOutlined />}
                        loading={submitLoading}
                    >
                        保存修改
                    </Button>
                </Space>
            </div>

            {/* 三栏主布局，和发布页完全统一 */}
            <Layout style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                {/* 左侧目录栏 */}
                <Sider width={220} style={{ background: '#fafafa', padding: 16 }}>
                    <div style={{ fontWeight: 600, marginBottom: 16, display: 'flex', gap: 6, alignItems: 'center' }}>
                        <BookOutlined /> 文章目录
                    </div>
                    {getCatalog().length === 0 ? (
                        <Text type="secondary">正文添加#标题自动生成目录</Text>
                    ) : (
                        getCatalog().map((title, idx) => (
                            <div
                                key={idx}
                                style={{ fontSize: 13, padding: '6px 8px', marginBottom: 4, borderRadius: 4, cursor: 'pointer' }}
                                onMouseEnter={e => e.target.style.background = '#e8f3ff'}
                                onMouseLeave={e => e.target.style.background = 'transparent'}
                            >
                                {title}
                            </div>
                        ))
                    )}
                </Sider>

                {/* 中间MD编辑主体 */}
                <Content style={{ padding: '24px 40px', minHeight: 700, maxWidth: 900 }}>
                    <Form
                        id="editArticleForm"
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        size="large"
                    >
                        {/* 文章标题输入框（仿CSDN无边框大标题） */}
                        <Form.Item
                            name="title"
                            rules={[
                                { required: true, message: '请输入文章标题' },
                                { max: 100, message: '标题不超过100字' },
                                { min: 5, message: '标题至少5个字' }
                            ]}
                        >
                            <Input
                                placeholder="请输入文章标题 (5 ~ 100个字)"
                                style={{ fontSize: 26, fontWeight: 500, padding: '12px 0', borderBottom: '1px solid #eee' }}
                                maxLength={100}
                                allowClear
                            />
                        </Form.Item>

                        {/* Markdown编辑器替换原TextArea */}
                        <Form.Item
                            name="content"
                            label="文章正文"
                            rules={[{ required: true, message: '文章内容不能为空' }]}
                        >
                            <MDEditor
                                onDrop={(e) => (NormalTool.uploadByDrop(e, form, "content"))}
                                onPaste={(e) => (NormalTool.uploadByPaste(e, form, "content"))}
                                value={form.getFieldValue('content')}
                                onChange={(val) => form.setFieldsValue({ content: val })}
                                height={620}
                                placeholder="使用Markdown语法修改文章内容..."
                            />
                        </Form.Item>
                    </Form>
                </Content>

                {/* 右侧信息操作栏 */}
                <Sider width={280} style={{ background: '#fafafa', padding: 16 }}>
                    <Card title={<Space><InfoCircleOutlined />文章信息</Space>} size="small" bordered={false}>
                        <div style={{ fontSize: 13, color: '#444' }}>
                            <p>文章ID：{articleRef.current?.id}</p>
                            <p>作者ID：{articleRef.current?.author_id}</p>
                            <p>原发布时间：{articleRef.current?.create_time}</p>
                        </div>
                    </Card>

                    <Card title="快捷操作" size="small" bordered={false} style={{ marginTop: 16 }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button block danger icon={<DeleteOutlined />} onClick={handleDelete}>
                                删除此文章
                            </Button>
                            <Button block onClick={() => navigate(`${CONSTPARAM.ARTICLEBASE}/detail/${id}`)}>
                                预览文章
                            </Button>
                            <Button block onClick={() => navigate(`${CONSTPARAM.ARTICLEBASE}/list`)}>
                                取消编辑
                            </Button>
                        </Space>
                    </Card>
                </Sider>
            </Layout>
        </div>
    );
}

export default ArticleEdit;