import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Ant Design 组件
import { Carousel, Typography, Row, Col, Card, Space, Tag, Layout, Spin, Empty } from "antd";
import dayjs from "dayjs";

//=================自定义组件==============================
import { DebugTool } from "../Util/DebugTool/DebugTool";
import Theme from "../Theme/theme";
import CONSTPARAM from "../Core/CONST/CONST";
import { InfomationSystem } from "../InfomationSystem/InfomationSystem";

const { Title, Paragraph } = Typography;
function MainPage() {
    const navigate = useNavigate();
    const unmountRef = useRef(false);

    // 轮播图片数组（后续对接Info-Server接口替换）
    const bannerList = [
        `${CONSTPARAM.MAINPAGEIMGURL}/第19页-19.PNG`,
        `${CONSTPARAM.MAINPAGEIMGURL}/第20页-20.PNG`,
        `${CONSTPARAM.MAINPAGEIMGURL}/第21页-21.PNG`,
        `${CONSTPARAM.MAINPAGEIMGURL}/第22页-22.PNG`
    ];

    // 页面状态
    const [loading, setLoading] = useState(true);
    const [articleAll, setArticleAll] = useState([]);

    // 跳转成果详情页（统一方法，全页面共用）
    const goShowCaseDetail = (title) => {
        navigate({
            pathname: `${CONSTPARAM.RESULTSHOWCASEURL}/detail`,
            search: `?title=${encodeURIComponent(title)}`
        });
    };

    // 跳转成果展示列表主页
    const goShowCaseList = () => {
        navigate(CONSTPARAM.RESULTSHOWCASEURL);
    };

    // 拉取全部文章数据
    const loadAllArticle = () => {
        setLoading(true);
        InfomationSystem.getAllArticleOper((res) => {
            if (unmountRef.current) return;
            setLoading(false);
            if (res === 99 || !res) {
                setArticleAll([]);
                return;
            }
            // 格式化文章列表
            const formatList = Object.entries(res).map(([id, info]) => {
                const createTime = dayjs(info.create_time).format("MM/DD");
                const fullDate = dayjs(info.create_time).format("YYYY-MM-DD");
                // 截取正文前72字作为简介
                const shortDesc = info.content.length > 72
                    ? info.content.replace(/[#*`\n]/g, "").slice(0, 72) + "..."
                    : info.content.replace(/[#*`\n]/g, "");
                return {
                    id,
                    title: info.title,
                    desc: shortDesc,
                    fullContent: info.content,
                    dateShort: createTime,
                    dateFull: fullDate,
                    views: info.views,
                    authorId: info.author_id
                };
            });
            setArticleAll(formatList);
        });
    };

    useEffect(() => {
        unmountRef.current = false;
        loadAllArticle();
        return () => unmountRef.current = true;
    }, []);

    // 数据分片：取前2条大图新闻、5条右侧短新闻、6条媒体报道
    const topTwoNews = articleAll.slice(0, 2);
    const rightShortNews = articleAll.slice(2, 7);
    const mediaReportList = articleAll.slice(7, 13);

    // 快捷功能入口（点击统一跳成果列表）
    const funcList = [
        { bg: "#285dadff", text: "研究院党建专栏" },
        { bg: "#f70202ff", text: "90周年校庆AI成果专题" },
        { bg: "#285dadff", text: "主题教育学习专区" },
        { bg: "#f70202ff", text: "科研经费预决算公开" },
        { bg: "#285dadff", text: "信息公开公示" },
        { bg: "#f70202ff", text: "AI学术期刊投稿入口" },
        { bg: "#285dadff", text: "教学培养质量年报" },
        { bg: "#f70202ff", text: "图灵学堂在线课程" },
    ];

    // 底部图文招生板块（点击跳转成果列表）
    const recruitList = [
        { img: `${CONSTPARAM.MAINPAGEIMGURL}/第19页-19.png`, title: "本科AI方向招生" },
        { img: `${CONSTPARAM.MAINPAGEIMGURL}/第20页-20.png`, title: "研究生人工智能招生" },
        { img: `${CONSTPARAM.MAINPAGEIMGURL}/第21页-21.png`, title: "科研岗位招聘" },
        { img: `${CONSTPARAM.MAINPAGEIMGURL}/第22页-22.png`, title: "国际AI交流项目" },
        { img: `${CONSTPARAM.MAINPAGEIMGURL}/MainPageD.png`, title: "继续教育AI实训班" },
    ];

    // 加载中
    if (loading) {
        return (
            <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Spin size="large" description="成果数据加载中..." />
            </div>
        );
    }

    // 无文章数据兜底
    if (articleAll.length === 0) {
        return (
            <div style={{ width: "100%", boxSizing: "border-box" }}>
                {/* 顶部轮播不变 */}
                <Carousel autoplay dots={{ className: "banner-dot" }} autoplaySpeed={5000} effect="slide">
                    {bannerList.map((banner, idx) => (
                        <div key={idx}>
                            <div
                                style={{
                                    width: "100%",
                                    height: "420px",
                                    backgroundImage: `url(${banner})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#fff",
                                    textAlign: "center",
                                }}
                            >
                                <Title level={1} style={{ color: "#fff", margin: 0, lineHeight: 1.7 }}>
                                    深耕人工智能前沿研究<br />服务温州数字产业发展
                                </Title>
                                <Title level={2} style={{ color: "#fff", margin: "12px 0 0 0" }}>
                                    ——温州市图灵人工智能高等研究院
                                </Title>
                                <Paragraph style={{ color: "rgba(255,255,255,0.9)", fontSize: 16, margin: "24px 0 0 0" }}>
                                    聚焦大模型、智能视觉、多模态Agent三大核心研究方向
                                </Paragraph>
                                <Space size={0} style={{ position: "absolute", bottom: 30, right: 120, background: "rgba(0,0,0,0.5)", padding: 0 }}>
                                    <div style={{ padding: "8px 14px", cursor: "pointer", color: "#fff" }} onClick={goShowCaseList}>研究院通知</div>
                                    <div style={{ padding: "8px 14px", cursor: "pointer", color: "#fff" }} onClick={goShowCaseList}>科研招标</div>
                                    <div style={{ padding: "8px 14px", cursor: "pointer", color: "#fff" }} onClick={goShowCaseList}>学术活动</div>
                                </Space>
                            </div>
                        </div>
                    ))}
                </Carousel>
                <Empty description="暂无发布成果文章" style={{ margin: "60px 0" }} />
            </div>
        );
    }

    return (
        <div style={{ width: "100%", boxSizing: "border-box" }}>
            {/* 1. 顶部研究院宣传轮播横幅 */}
            <Carousel autoplay dots={{ className: "banner-dot" }} autoplaySpeed={5000} effect="slide">
                {bannerList.map((banner, idx) => (
                    <div key={idx}>
                        <div
                            style={{
                                width: "100%",
                                height: "420px",
                                backgroundImage: `url(${banner})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#fff",
                                textAlign: "center",
                                position: "relative"
                            }}
                        >
                            <Title level={1} style={{ color: "#fff", margin: 0, lineHeight: 1.7 }}>
                                深耕人工智能前沿研究<br />服务温州数字产业发展
                            </Title>
                            <Title level={2} style={{ color: "#fff", margin: "12px 0 0 0" }}>
                                ——温州市图灵人工智能高等研究院
                            </Title>
                            <Paragraph style={{ color: "rgba(255,255,255,0.9)", fontSize: 16, margin: "24px 0 0 0" }}>
                                聚焦大模型、智能视觉、多模态Agent三大核心研究方向
                            </Paragraph>
                            {/* 右下角悬浮快捷栏 全部点击跳转成果列表 */}
                            <Space size={0} style={{ position: "absolute", bottom: 30, right: 120, background: "rgba(0,0,0,0.5)", padding: 0 }}>
                                <div style={{ padding: "8px 14px", cursor: "pointer", color: "#fff" }} onClick={goShowCaseList}>研究院通知</div>
                                <div style={{ padding: "8px 14px", cursor: "pointer", color: "#fff" }} onClick={goShowCaseList}>科研招标</div>
                                <div style={{ padding: "8px 14px", cursor: "pointer", color: "#fff" }} onClick={goShowCaseList}>学术活动</div>
                            </Space>
                        </div>
                    </div>
                ))}
            </Carousel>

            {/* 2. 研究院新闻板块 宽度90%居中 */}
            <div style={{ width: "90%", margin: "40px auto" }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                    <Title level={3} style={{ color: Theme.theme.primary, margin: 0 }}>研究院新闻</Title>
                    {/* 更多新闻：跳转成果列表 */}
                    <span style={{ color: Theme.theme.primary, cursor: "pointer" }} onClick={goShowCaseList}>更多新闻</span>
                </Row>
                <Row gutter={24}>
                    {/* 左侧两张图文新闻，取自文章前两条，简介为正文截取 */}
                    {topTwoNews.map(item => (
                        <Col span={8} key={item.id}>
                            <Card
                                hoverable
                                cover={
                                    <div style={{ width: "100%", height: 200, backgroundImage: `url(${CONSTPARAM.MAINPAGEIMGURL}/MainPageA.png)`, backgroundSize: "cover", backgroundPosition: "center" }} />
                                }
                                styles={{ body: { padding: "12px" } }}
                                onClick={() => goShowCaseDetail(item.title)}
                            >
                                <Card.Meta title={item.title} description={item.desc} />
                            </Card>
                        </Col>
                    ))}
                    {/* 右侧短新闻列表 取自文章3~7条 */}
                    <Col span={8}>
                        {rightShortNews.map((item, idx) => (
                            <div
                                key={idx}
                                style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #eee", cursor: "pointer" }}
                                onClick={() => goShowCaseDetail(item.title)}
                            >
                                <Tag color="default" style={{ width: 40, height: 40, textAlign: "center", lineHeight: "40px", padding: 0, borderColor: Theme.theme.primary, color: Theme.theme.primary }}>
                                    {item.dateShort}
                                </Tag>
                                <div style={{ flex: 1, fontSize: 14, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {item.title}
                                </div>
                            </div>
                        ))}
                    </Col>
                </Row>
            </div>

            {/* 3. 快捷功能彩色入口栏 8等分栅格 全部点击跳转成果列表 */}
            <div style={{ width: "90%", margin: "0 auto 40px" }}>
                <Row gutter={0}>
                    {funcList.map((item, idx) => (
                        <Col span={3} key={idx}>
                            <div
                                style={{
                                    background: item.bg,
                                    color: "#fff",
                                    padding: "30px 12px",
                                    textAlign: "center",
                                    fontSize: 14,
                                    cursor: "pointer",
                                    minHeight: 120,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onClick={goShowCaseList}
                            >
                                {item.text}
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* 4. 媒体报道板块 三列均分 取自文章7~13条 */}
            <div style={{ width: "90%", margin: "0 auto 40px" }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                    <Title level={3} style={{ color: Theme.theme.primary, margin: 0 }}>媒体报道</Title>
                    <span style={{ color: Theme.theme.primary, cursor: "pointer" }} onClick={goShowCaseList}>更多</span>
                </Row>
                <Row gutter={20}>
                    {mediaReportList.map((item, idx) => (
                        <Col span={8} key={idx}>
                            <div
                                style={{ display: "flex", gap: 12, padding: "8px 0", cursor: "pointer" }}
                                onClick={() => goShowCaseDetail(item.title)}
                            >
                                <Tag color="default" style={{ width: 40, height: 40, textAlign: "center", lineHeight: "40px", padding: 0, borderColor: Theme.theme.primary, color: Theme.theme.primary }}>
                                    {item.dateShort}
                                </Tag>
                                <div style={{ flex: 1, fontSize: 14, color: "#333" }}>{item.title}</div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* 5. 底部招生/科研图文区域 全部点击跳转成果列表 */}
            <div style={{ width: "90%", margin: "0 auto 60px" }}>
                <div style={{ textAlign: "center", marginBottom: 30 }}>
                    <Title level={2} style={{ color: Theme.theme.primary, margin: 0 }}>求真致远 智绘未来</Title>
                    <Paragraph style={{ color: "#666", marginTop: 8 }}>立足温州、深耕AI、产研融合、育人为本</Paragraph>
                </div>
                <Row gutter={12}>
                    {recruitList.map((item, idx) => (
                        <Col span={idx < 2 ? 6 : 3} key={idx}>
                            <div
                                style={{
                                    height: idx < 2 ? 220 : 108,
                                    backgroundImage: `url(${item.img})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#fff",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    textShadow: "0 0 6px rgba(0,0,0,0.6)",
                                }}
                                onClick={goShowCaseList}
                            >
                                {item.title}
                            </div>
                        </Col>
                    ))}
                    {/* 预留两块成果展示大图位 */}
                    <Col span={12}>
                        <div style={{ height: 220, background: "#f0f4f8", display: "flex", alignItems: "center", justifyContent: "center", color: Theme.theme.primary, cursor: "pointer" }} onClick={goShowCaseList}>
                            AI科研成果展厅
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{ height: 220, background: "#f0f4f8", display: "flex", alignItems: "center", justifyContent: "center", color: Theme.theme.primary, cursor: "pointer" }} onClick={goShowCaseList}>
                            校企联合实验室实拍
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default MainPage;