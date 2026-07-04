import { useState, useEffect, useRef }              from 'react';
import { useNavigate, useSearchParams }             from 'react-router-dom';
import { Layout, Typography, Spin, Empty, Divider } from 'antd';
import { LeftOutlined }         from '@ant-design/icons';
import { message }              from 'antd';
import dayjs                    from 'dayjs';
import MDEditor                 from '@uiw/react-md-editor';

//==========================自定义工具==========================
import { InfomationSystem }     from '../../InfomationSystem/InfomationSystem';
import CONSTPARAM               from '../../Core/CONST/CONST';
import { DebugTool }            from '../../Util/DebugTool/DebugTool';
import Theme                    from '../../Theme/theme';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

function ResultShowNormal() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const articleTitle = searchParams.get("title");

    const [articleInfo, setArticleInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const unmountRef = useRef(false);

    // 侧边分类菜单
    const sideMenuList = [
        { key: "news", label: "研究院新闻" },
        { key: "paper", label: "学术成果" },
        { key: "project", label: "项目通知" },
        { key: "recruit", label: "招标信息" },
        { key: "academic", label: "学术公告" },
    ];

    // 根据标题请求文章详情（复用你已调通的标题查询接口）
    const loadArticleData = () => {
        if (!articleTitle) {
            navigate(CONSTPARAM.RESULTSHOWCASEURL);
            return;
        }
        setLoading(true);
        DebugTool.debugLog("成果详情页：请求文章标题：" + articleTitle);
        InfomationSystem.getArticleDetailByTitleOper(articleTitle, (res) => {
            if (unmountRef.current) return;
            setLoading(false);
            if (!res || res.error || res.code === "-2") {
                message.error("该成果文章不存在，返回成果列表");
                setArticleInfo(null);
                navigate(CONSTPARAM.RESULTSHOWCASEURL);
                return;
            }
            setArticleInfo(res);
        });
    };

    useEffect(() => {
        unmountRef.current = false;
        loadArticleData();
        return () => unmountRef.current = true;
    }, [articleTitle]);

    // 返回成果展示首页
    const goBackShowcase = () => {
        navigate(CONSTPARAM.RESULTSHOWCASEURL);
    };

    // 加载中
    if (loading) {
        return (
            <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Spin size="large" description="成果内容加载中..." />
            </div>
        );
    }

    if (!articleInfo) return null;

    // 格式化时间
    const formatTime = dayjs(articleInfo.create_time).format("YYYY-MM-DD");

    return (
        <div style={{ width: "100%" }}>
            {/* 顶部全屏横幅大图 可替换为资源系统banner图 */}
            <div style={{
                width: "100%",
                backgroundImage: `url(${CONSTPARAM.MainBackgoundLogo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}></div>

            {/* 主体双栏布局 复刻温大新闻左右分栏 */}
            <Layout style={{ background: "#eef2f7" }}>
                {/* 左侧蓝色侧边分类栏 */}
                <Sider width={260} style={{ background: Theme.defaultColor, padding: "30px 0" }}>
                    <div style={{ padding: "0 24px", marginBottom: 30 }}>
                        <Title level={3} style={{ color: "#fff", margin: 0 }}>成果中心</Title>
                    </div>
                    {sideMenuList.map(item => (
                        <div
                            key={item.key}
                            style={{
                                padding: "12px 24px",
                                color: "#e0eaff",
                                cursor: "pointer",
                                fontSize: 15,
                            }}
                        >
                            ○ {item.label}
                        </div>
                    ))}
                    {/* 底部就业/风采小模块预留 */}
                    <div style={{ margin: "40px 24px 0", background: "#24c8f7", padding: "14px", textAlign: "center", borderRadius: 4 }}>
                        <Text style={{ color: "#fff", fontWeight: 500 }}>内容详细</Text>
                    </div>
                </Sider>

                {/* 右侧正文区域 */}
                <Content style={{ padding: "40px 50px", background: "#fff", minHeight: "60vh" }}>
                    {/* 返回按钮 */}
                    <div style={{ marginBottom: 20 }}>
                        <span
                            onClick={goBackShowcase}
                            style={{ display: "flex", alignItems: "center", gap: 6, color: Theme.defaultColor, cursor: "pointer" }}
                        >
                            <LeftOutlined />
                            返回全部成果
                        </span>
                    </div>

                    {/* 文章大标题 */}
                    <Title level={2} style={{ color: "#0f3070", marginBottom: 12 }}>
                        {articleInfo.title}
                    </Title>

                    {/* 来源、作者、浏览量、发布时间 一行小字 */}
                    <div style={{ color: "#888", fontSize: 14, marginBottom: 30 }}>
                        <Text>作者：{articleInfo.author_id}</Text>
                        <Divider type="vertical" />
                        <Text>浏览次数：{articleInfo.views}</Text>
                        <Divider type="vertical" />
                        <Text>发布时间：{formatTime}</Text>
                    </div>

                    <Divider style={{ marginBottom: 30 }} />

                    {/* Markdown正文渲染，支持图片、表格、段落 */}
                    <div style={{ fontSize: 16, lineHeight: 2.2, color: "#222" }}>
                        <MDEditor.Markdown
                            source={articleInfo.content || ""}
                            style={{ padding: "0 10px" }}
                        />
                    </div>
                </Content>
            </Layout>

            {/* 底部：最新成果推荐区域（预留，和温大最新动态对应） */}
            <div style={{ padding: "40px 5%", background: "#fff" }}>
                <Title level={4} style={{ color: Theme.defaultColor, borderBottom: "2px solid " + Theme.defaultColor, paddingBottom: 10 }}>
                    最新成果动态
                </Title>
                <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
                    {/* 后续可循环渲染成果卡片，复用ResultShow的卡片组件 */}
                </div>
            </div>
        </div>
    );
}

export default ResultShowNormal;