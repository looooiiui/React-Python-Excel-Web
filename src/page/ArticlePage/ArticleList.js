import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Space, Popconfirm, message, Typography, Card, Row, Col, Empty, Spin, Tag } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
//===================自定义工具=================
import Theme from '../../Theme/theme';
import { InfomationSystem } from '../../InfomationSystem/InfomationSystem';
import CONSTPARAM from '../../Core/CONST/CONST';
import { DebugTool } from '../../Util/DebugTool/DebugTool';

const { Title, Text, Paragraph } = Typography;
const { Sider, Content } = Layout;

function ArticleList() {
    const navigate = useNavigate();
    const [articleData, setArticleData] = useState([]);
    const [loading, setLoading] = useState(false);
    // 接口基础地址
    const baseUrl = `${CONSTPARAM.ARTICLESYSTEMIP}${CONSTPARAM.ARTICLEBASE}`;

    // 左侧菜单
    const menuItems = [
        { key: 'list', icon: <FileTextOutlined />, label: '文章列表' },
        { key: 'publish', icon: <PlusOutlined />, label: '发布新文章' }
    ];

    // 菜单点击跳转
    const handleMenuClick = ({ key }) => {
        if (key === 'publish') navigate(`${CONSTPARAM.ARTICLEBASE}/publish`);
    };

    // 删除文章
    const handleDelete = (id) => {
        InfomationSystem.deleteArticleOper(id, (res) => {
            if (res === 99) {
                message.error("删除失败");
                return;
            }
            if (res.success) {
                message.success("删除成功");
                fetchArticleList();
            }
        })
    };

    // 封装列表请求（删除后复用刷新）
    const fetchArticleList = () => {
        setLoading(true);
        InfomationSystem.getAllArticleOper((res) => {
            setLoading(false);
            if (res === 99) {
                message.error("加载列表失败");
                return;
            }
            const useList = Object.entries(res).map(([id, info]) => ({
                id,
                ...info
            }));
            // 更改时间格式
            useList.forEach(element => {
                element.create_time = dayjs(element.create_time).format('YYYY-MM-DD HH:mm');
                // 截取正文前60字做简介预览
                element.shortContent = element.content.length > 60
                    ? element.content.slice(0, 60) + "..."
                    : element.content;
            });

            setArticleData(useList);
        })
    };

    // 页面挂载加载列表
    useEffect(() => {
        fetchArticleList();
    }, []);

    return (
        <Layout style={{ minHeight: 'calc(100vh - 40px)', background: '#f5f7fa' }}>
            {/* 左侧侧边菜单 */}
            <Sider width={200} theme="light" style={{ background: Theme.defalutColor, borderRadius: 8, margin: 16 }}>
                <Menu
                    mode="inline"
                    selectedKeys={['list']}
                    items={menuItems}
                    onClick={handleMenuClick}
                    style={{ height: '100%', borderRight: 0 }}
                />
            </Sider>

            {/* 主内容卡片区域 */}
            <Content style={{ padding: '24px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Title level={4} style={{ margin: 0 }}>全部文章</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`${CONSTPARAM.ARTICLEBASE}/publish`)}>
                        发布新文章
                    </Button>
                </div>

                {/* 加载状态 */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <Spin size="large" tip="加载文章中..." />
                    </div>
                ) : articleData.length === 0 ? (
                    <Empty description="暂无发布的文章，点击右上角发布第一篇" style={{ padding: '80px 0' }} />
                ) : (
                    // 网格卡片布局，一行4块
                    <Row gutter={[20, 24]}>
                        {articleData.map((article) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={article.id}>
                                <Card
                                    hoverable
                                    bordered={false}
                                    style={{ height: '100%' }}
                                    bodyStyle={{ padding: 16 }}
                                >
                                    {/* 文章标题 */}
                                    <Title level={5} style={{ marginBottom: 12, minHeight: 44 }} ellipsis={{ rows: 2 }}>
                                        {article.title}
                                    </Title>

                                    {/* 简介预览 */}
                                    <Paragraph style={{ color: '#666', fontSize: 13, marginBottom: 16 }} ellipsis={{ rows: 3 }}>
                                        {article.shortContent}
                                    </Paragraph>

                                    {/* 元信息：作者、时间、阅读量 */}
                                    <div style={{ marginBottom: 16, fontSize: 12, color: '#888' }}>
                                        <Space size={12}>
                                            <span><UserOutlined /> 作者:{article.author_id}</span>
                                            <span><ClockCircleOutlined /> {article.create_time}</span>
                                        </Space>
                                        <div style={{ marginTop: 6 }}>
                                            <Tag color="blue">阅读 {article.views}</Tag>
                                        </div>
                                    </div>

                                    {/* 操作按钮组 */}
                                    <Space size={8} wrap style={{ width: '100%' }}>
                                        <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`${CONSTPARAM.ARTICLEBASE}/detail/${article.id}`)}>
                                            查看
                                        </Button>
                                        <Button size="small" icon={<EditOutlined />} onClick={() => navigate(`${CONSTPARAM.ARTICLEBASE}/edit/${article.id}`)}>
                                            编辑
                                        </Button>
                                        <Popconfirm title="确定删除该文章？" onConfirm={() => handleDelete(article.id)}>
                                            <Button danger size="small" icon={<DeleteOutlined />}>删除</Button>
                                        </Popconfirm>
                                    </Space>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Content>
        </Layout>
    );
}

export default ArticleList;