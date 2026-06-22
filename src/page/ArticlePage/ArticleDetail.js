import { useParams } from 'react-router-dom';
import { Card, Typography, Button, Layout, message, Spin, Space, Divider } from 'antd';
import { LeftOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
//=========================自定义工具引入=================
import { InfomationSystem } from '../../InfomationSystem/InfomationSystem';
import Theme from '../../Theme/theme';
import CONSTPARAM from '../../Core/CONST/CONST';
import MDEditor from '@uiw/react-md-editor';

const { Title, Text } = Typography;
const { Sider, Content } = Layout;

function ArticleDetail() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const hasLoaded = useRef(false);

    // 请求文章详情
    const fetchArticle = () => {
        if (!id) return;
        setLoading(true);
        InfomationSystem.getArticleDetailOper(id, (res) => {
            setLoading(false);
            if (res === 99 || !res) {
                message.error("文章加载失败，跳转列表");
                navigate(`${CONSTPARAM.ARTICLEBASE}/list`);
                return;
            }
            setArticle(res);
            hasLoaded.current = true;
        });
    };

    useEffect(() => {
        if (!id || hasLoaded.current) return;
        fetchArticle();
    }, [id]);

    // 提取Markdown目录标题 # 一级标题
    const getCatalogList = () => {
        if (!article?.content) return [];
        const reg = /^#{1,6}\s(.+)$/gm;
        const catalog = [];
        let match;
        while ((match = reg.exec(article.content)) !== null) {
            catalog.push(match[1]);
        }
        return catalog;
    };
    const catalogList = getCatalogList();

    // 计算总字数
    const getWordCount = () => {
        if (!article?.content) return 0;
        return article.content.replace(/\s/g, '').length;
    };

    // 编辑当前文章
    const goEdit = () => {
        navigate(`${CONSTPARAM.ARTICLEBASE}/edit/${id}`);
    };

    // 删除文章
    const delArticle = () => {
        // 你自行对接删除接口
        InfomationSystem.deleteArticleOper(id, res => {
            if (res.success) {
                message.success("删除成功");
                navigate(`${CONSTPARAM.ARTICLEBASE}/list`);
            } else {
                message.error("删除失败");
            }
        })
    };

    // 加载中
    if (loading) {
        return (
            <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" tip="文章加载中..." />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: 16 }}>
            {/* 顶部操作栏 */}
            <Space style={{ marginBottom: 16 }}>
                <Button icon={<LeftOutlined />} onClick={() => navigate(`${CONSTPARAM.ARTICLEBASE}/list`)}>
                    返回文章列表
                </Button>
                <Button icon={<ReloadOutlined />} onClick={fetchArticle}>
                    重新加载
                </Button>
            </Space>

            {/* 三栏阅读布局 */}
            <Layout style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                {/* 左侧文章目录 */}
                <Sider width={220} style={{ background: '#fafafa', padding: 16 }}>
                    <Title level={5} style={{ marginBottom: 16 }}>文章目录</Title>
                    {catalogList.length === 0 ? (
                        <Text type="secondary">文章无标题目录</Text>
                    ) : (
                        catalogList.map((item, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: '6px 8px',
                                    marginBottom: 4,
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    fontSize: 13
                                }}
                                onMouseOver={(e) => e.target.style.background = '#e8f3ff'}
                                onMouseOut={(e) => e.target.style.background = 'transparent'}
                            >
                                {item}
                            </div>
                        ))
                    )}
                </Sider>

                {/* 中间正文阅读区 */}
                <Content style={{ padding: '32px 48px', maxWidth: 900, minHeight: 700 }}>
                    <Title level={2} style={{ marginBottom: 12 }}>{article.title}</Title>
                    <div style={{ color: '#666', marginBottom: 30 }}>
                        <Text>作者：{article.author_id}</Text>
                        <Divider type="vertical" />
                        <Text>发布时间：{article.create_time}</Text>
                        <Divider type="vertical" />
                        <Text>总字数：{getWordCount()}</Text>
                    </div>

                    {/* Markdown正文渲染 */}
                    <div style={{ fontSize: 16, lineHeight: 2.1, color: '#222' }}>
                        <MDEditor.Markdown
                            source={article.content || ""}
                            style={{ padding: "16px" }}
                        />
                    </div>
                </Content>

                {/* 右侧信息栏 */}
                <Sider width={260} style={{ background: '#fafafa', padding: 16 }}>
                    <Card size="small" title="文章操作" bordered={false}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button block type="primary" icon={<EditOutlined />} onClick={goEdit}>
                                编辑文章
                            </Button>
                            <Button block danger icon={<DeleteOutlined />} onClick={delArticle}>
                                删除文章
                            </Button>
                        </Space>
                    </Card>

                    <Card size="small" title="文章信息" bordered={false} style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 13, color: '#444' }}>
                            <p>文章ID：{article.id}</p>
                            <p>作者ID：{article.author_id}</p>
                            <p>发布日期：{article.create_time}</p>
                            <p>总字数：{getWordCount()}</p>
                        </div>
                    </Card>
                </Sider>
            </Layout>
        </div>
    );
}

export default ArticleDetail;