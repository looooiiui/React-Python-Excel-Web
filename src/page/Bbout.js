import { useEffect, useState, useRef }      from "react";
import { useNavigate }                      from "react-router-dom";
// Ant Design 组件
import { Typography, Row, Col, Card, Space, Divider } from "antd";

//=================全局公共工具/常量==============================
import { DebugTool }        from "../Util/DebugTool/DebugTool";
import Theme                from "../Theme/theme";
import CONSTPARAM           from "../Core/CONST/CONST";

const { Title, Paragraph } = Typography;
export default function Bbout() {
    const navigate = useNavigate();
    const unmountRef = useRef(false);
    const [loading, setLoading] = useState(true);

    // 页面初始化模拟加载，和主页加载逻辑对齐
    useEffect(() => {
        unmountRef.current = false;
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);
        return () => {
            unmountRef.current = true;
            clearTimeout(timer);
        };
    }, []);

    // 返回文章列表
    const backArticleList = () => {
        navigate("/article/list");
    };

    // 系统功能介绍卡片数据
    const featureList = [
        {
            title: "Markdown富文本编辑器",
            desc: "支持标准Markdown语法编写文章，粘贴/拖拽图片自动上传，实时预览排版效果，适配学术论文、科普文稿、新闻通知多类场景。"
        },
        {
            title: "AI辅助创作工具",
            desc: "内置大模型写作接口，支持一键生成完整文章、润色优化现有正文，独立单次对话不存储上下文，弹窗预览确认后再填入编辑器，防止原文误覆盖。"
        },
        {
            title: "完整文章业务闭环",
            desc: "实现文章发布、列表浏览、详情预览、在线编辑、删除全套功能，自动格式化发布时间、字数统计、侧边目录解析，贴合研究院科研文稿管理需求。"
        },
        {
            title: "工程化分层架构",
            desc: "全局统一请求、日志调试工具封装，组件分层管理，页面逻辑轻量化拆分；可拓展全局事件总线解耦高耦合业务组件，兼顾开发效率与长期可维护性。"
        }
    ];

    // 技术栈说明
    const techStackArr = [
        "React18", "React Router", "Ant Design", "MDEditor",
        "Axios", "原生JS异步封装", "大模型AI接口集成"
    ];

    if (loading) {
        return (
            <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 16, color: Theme.theme.primary }}>页面加载中...</div>
            </div>
        );
    }

    return (
        <div style={{ width: "100%", boxSizing: "border-box", background: "#f5f7fa", minHeight: "calc(100vh - 64px)", padding: "40px 0" }}>
            {/* 页面整体容器，宽度90%居中，和主页统一 */}
            <div style={{ width: "90%", margin: "0 auto" }}>
                {/* 顶部标题+返回按钮栏 */}
                <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
                    <Title level={2} style={{ color: Theme.theme.primary, margin: 0 }}>
                        关于文章管理系统
                    </Title>
                    <span
                        style={{ color: Theme.theme.primary, cursor: "pointer", fontSize: 15 }}
                        onClick={backArticleList}
                    >
                        ← 返回文章列表
                    </span>
                </Row>

                {/* 头部简介大卡片 */}
                <Card style={{ marginBottom: 40 }} styles={{ body: { padding: "36px 40px" } }}>
                    <Title level={3} style={{ margin: "0 0 16px 0" }}>系统简介</Title>
                    <Paragraph style={{ fontSize: 16, lineHeight: 1.8, color: "#444" }}>
                        温州市图灵人工智能高等研究院文章管理系统，是配套研究院官网自研的轻量化文稿发布平台，专为科研人员、学生、行政人员打造。
                        平台整合Markdown富文本编辑与AI大模型辅助创作能力，完整支撑院内新闻、学术论文、科研成果、活动通知等内容的线上撰写、发布与展示，
                        整套前端项目基于React独立开发，架构分层清晰，工具统一封装，兼顾易用性、拓展性与工程规范。
                    </Paragraph>
                    <Divider style={{ margin: "24px 0" }} />
                    <div>
                        <Title level={4} style={{ margin: "0 0 12px 0" }}>开发初衷</Title>
                        <Paragraph style={{ fontSize: 15, lineHeight: 1.8, color: "#555" }}>
                            为解决传统Word文档分发、静态页面维护繁琐的痛点，实现院内文稿线上统一管理；
                            同时借助AI能力降低写作门槛，辅助快速产出、优化学术内容，适配研究院数字化科研宣传的长期需求。
                        </Paragraph>
                    </div>
                </Card>

                {/* 四大核心功能板块 四列栅格卡片 */}
                <Title level={3} style={{ color: Theme.theme.primary, margin: "0 0 24px 0" }}>核心功能</Title>
                <Row gutter={24} style={{ marginBottom: 40 }}>
                    {featureList.map((item, idx) => (
                        <Col span={6} key={idx}>
                            <Card hoverable styles={{ body: { padding: "20px" }, header: { background: Theme.theme.primary, color: "#fff" } }} title={item.title}>
                                <Paragraph style={{ fontSize: 14, color: "#444", lineHeight: 1.7, margin: 0 }}>
                                    {item.desc}
                                </Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* 技术栈说明 + 底部开发说明卡片 */}
                <Row gutter={24}>
                    <Col span={12}>
                        <Card styles={{ body: { padding: "28px" } }} title="项目技术栈">
                            <Space wrap size={10}>
                                {techStackArr.map((tech, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            background: Theme.theme.primary,
                                            color: "#fff",
                                            padding: "6px 14px",
                                            borderRadius: 4,
                                            fontSize: 14
                                        }}
                                    >
                                        {tech}
                                    </div>
                                ))}
                            </Space>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card styles={{ body: { padding: "28px" } }} title="开发说明">
                            <Paragraph style={{ fontSize: 14, lineHeight: 1.8, color: "#444", margin: 0 }}>
                                本系统为大一独立全栈开发项目，全程自主规划页面架构、封装全局工具、设计业务流程；
                                开发过程平衡交付进度与代码规范，强耦合业务页面优先保证完整闭环，预留事件总线、组件抽离等后期重构优化方案。
                                项目完整配套后台接口服务，可长期迭代拓展更多科研配套功能。
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}