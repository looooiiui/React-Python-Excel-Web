import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Typography, Spin, Empty, Row, Col, Card, Space, Tag } from 'antd';
import { FileTextOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
// 你的全局工具
import { InfomationSystem } from '../../InfomationSystem/InfomationSystem';
import CONSTPARAM from '../../Core/CONST/CONST';
import { DebugTool } from '../../Util/DebugTool/DebugTool';
import Theme from '../../Theme/theme';

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

function ResultShow() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [articleList, setArticleList] = useState([]);
    const unmountRef = useRef(false);

    // 侧边菜单分类（可后续加分类字段过滤）
    const siderMenu = [
        { key: 'all', label: '全部成果', icon: <FileTextOutlined /> },
        { key: 'paper', label: '学术论文' },
        { key: 'project', label: '项目成果' },
        { key: 'event', label: '活动新闻' },
    ];
    const [activeKey, setActiveKey] = useState('all');

    // 获取全部文章成果
    const fetchArticleData = () => {
        setLoading(true);
        InfomationSystem.getAllArticleOper((res) => {
            if (unmountRef.current) return;
            setLoading(false);
            // 接口异常兜底
            if (res === 99 || !res) {
                setArticleList([]);
                return;
            }
            // 格式化列表数据
            const formatList = Object.entries(res).map(([id, info]) => {
                const createTime = dayjs(info.create_time).format('YYYY-MM-DD');
                const shortDesc = info.content.length > 72
                    ? info.content.slice(0, 72) + '...'
                    : info.content;
                return {
                    id,
                    ...info,
                    createTime,
                    shortDesc
                };
            });
            setArticleList(formatList);
        });
    };

    useEffect(() => {
        unmountRef.current = false;
        fetchArticleData();
        return () => unmountRef.current = true;
    }, []);

    // 跳转到只读文章详情（标题传参）
    const goDetail = (title) => {
        navigate({
            pathname: `${CONSTPARAM.FRONTARTICLE}/detailnormal`,
            search: `?title=${encodeURIComponent(title)}`
        });
    };

    // 加载中
    if (loading) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin size="large" description="成果加载中..." />
            </div>
        );
    }

    return (
        <Layout style={{ minHeight: 'calc(100vh - 40px)', background: '#eef2f7' }}>
            {/* 左侧蓝色侧边分类栏（复刻温大新闻侧边） */}
            <Sider width={240} style={{ background: Theme.defalutColor, margin: 16, borderRadius: 6 }}>
                <div style={{ padding: '24px 16px 16px' }}>
                    <Title level={4} style={{ color: '#fff', margin: 0 }}>成果展示</Title>
                </div>
                {siderMenu.map(item => (
                    <div
                        key={item.key}
                        onClick={() => setActiveKey(item.key)}
                        style={{
                            padding: '12px 20px',
                            color: activeKey === item.key ? '#fff' : '#e0eaff',
                            background: activeKey === item.key ? 'rgba(255,255,255,0.15)' : 'transparent',
                            cursor: 'pointer',
                            fontSize: 14,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}
                    >
                        {item.icon ?? <span style={{ width: 14 }} />}
                        {item.label}
                    </div>
                ))}
            </Sider>

            {/* 右侧主内容区 */}
            <Content style={{ padding: '24px 16px 24px 0' }}>
                <div style={{ background: '#fff', padding: '20px 32px', borderRadius: 6, minHeight: 'calc(100vh - 32px)' }}>
                    <Title level={3} style={{ borderBottom: '2px solid #165dff', paddingBottom: 12, marginBottom: 24 }}>
                        全部成果新闻
                    </Title>

                    {articleList.length === 0 ? (
                        <Empty description="暂无发布成果文章" style={{ padding: '80px 0' }} />
                    ) : (
                        <Row gutter={[24, 28]}>
                            {articleList.map(article => (
                                <Col xs={24} md={12} lg={8} key={article.id}>
                                    <Card
                                        hoverable
                                        variant="borderless"
                                        style={{ height: '100%', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
                                        onClick={() => goDetail(article.title)}
                                    >
                                        <Title level={5} ellipsis={{ rows: 2 }} style={{ marginBottom: 10 }}>
                                            {article.title}
                                        </Title>
                                        <Paragraph ellipsis={{ rows: 3 }} style={{ color: '#555', fontSize: 13, marginBottom: 16 }}>
                                            {article.shortDesc}
                                        </Paragraph>
                                        <div style={{ fontSize: 12, color: '#888' }}>
                                            <Space size={10}>
                                                <span><UserOutlined /> 作者:{article.author_id}</span>
                                                <span><ClockCircleOutlined /> {article.createTime}</span>
                                            </Space>
                                            <Tag color="blue" style={{ marginTop: 6 }}>阅读 {article.views}</Tag>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            </Content>
        </Layout>
    );
}

export default ResultShow;