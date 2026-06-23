import { useParams, useSearchParams } from 'react-router-dom';
import { Card, Typography, Button, Layout, message, Spin, Space, Divider } from 'antd';
import { LeftOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
//=========================自定义工具引入=================
import { InfomationSystem } from '../../InfomationSystem/InfomationSystem';
import Theme from '../../Theme/theme';
import CONSTPARAM from '../../Core/CONST/CONST';
import { DebugTool } from '../../Util/DebugTool/DebugTool';

const { Title, Text } = Typography;
const { Sider, Content } = Layout;

function ArticleDetail() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const title = searchParams.get("title");

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const unmountRef = useRef(false); // 组件卸载标记，解决并发渲染警告

    // 1. 根据ID加载文章
    const fetchById = () => {
        setLoading(true);
        DebugTool.debugLog("文章详细: 查询文章ID: " + id);
        InfomationSystem.getArticleDetailOper(id, (res) => {
            if (unmountRef.current) return;
            setLoading(false);
            // 错误分支：不把错误res塞给article，直接置空null
            if (res === 99 || !res || res.code === "-2") {
                message.error("文章加载失败，跳转列表");
                setArticle(null); // 关键：清除脏数据，消除渲染降级
                navigate(`${CONSTPARAM.ARTICLEBASE}/list`);
                return;
            }
            setArticle(res);
        });
    };

    // 2. 根据标题加载文章（首页专用）
    const fetchByTitle = () => {
        setLoading(true);
        DebugTool.debugLog("文章详细: 查询文章标题: " + title);
        InfomationSystem.getArticleDetailByTitleOper(title, (res) => {
            if (unmountRef.current) return;
            setLoading(false);
            if (res.error || !res) {
                message.error("文章不存在，跳转列表");
                setArticle(null);
                navigate(`${CONSTPARAM.ARTICLEBASE}/list`);
                return;
            }
            setArticle(res);
        });
    };

    // 统一入口：判断用哪种方式查询
    const loadArticle = () => {
        if (id) fetchById();
        else if (title) fetchByTitle();
        else {
            navigate(`${CONSTPARAM.ARTICLEBASE}/list`);
        }
    };

    // 页面挂载 / id/title变化时重新加载
    useEffect(() => {
        unmountRef.current = false;
        loadArticle();
        // 组件卸载标记置为true，阻止卸载后setState
        return () => {
            unmountRef.current = true;
        };
    }, [id, title]);

    // 刷新按钮
    const refreshData = () => loadArticle();

    // 提取Markdown一级标题目录（只在article存在时计算一次）
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

    // 纯文字总字数
    const getWordCount = () => {
        if (!article?.content) return 0;
        return article.content.replace(/\s/g, '').length;
    };

    // 加载中
    if (loading) {
        return (
            <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" tip="文章加载中..." />
            </div>
        );
    }

    // 无文章数据（错误跳转兜底）
    if (!article) return null;

    return (
        <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: 16 }}>
            {/* 顶部操作栏 */}
            <Space style={{ marginBottom: 16 }}>
                <Button icon={<LeftOutlined />} onClick={() => navigate(`${CONSTPARAM.RESULTSHOWCASEURL}`)}>
                    返回成果列表
                </Button>
                <Button icon={<ReloadOutlined />} onClick={refreshData}>
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

                    <Card size="small" title="文章信息" bordered={false} style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 13, color: '#444' }}>
                            <p>文章ID：{article.id ?? "首页只读模式无ID"}</p>
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