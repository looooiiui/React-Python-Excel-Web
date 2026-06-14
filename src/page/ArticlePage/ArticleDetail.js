import { useParams } from 'react-router-dom';
import { Card, Typography, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useRef } from 'react';
//=========================自定义工具引入=================
import { InfomationSystem } from '../../InfomationSystem/InfomationSystem';
import Theme from '../../Theme/theme';
import CONSTPARAM from '../../Core/CONST/CONST';

const { Title, Paragraph } = Typography;

function ArticleDetail() {
    const { id } = useParams(); // 获取路由上的文章ID
    const [article, setArticle] = useState({})
    const navigate = useNavigate();
    const hasLoaded = useRef(false);

    useEffect(() => {
        if (!id || hasLoaded.current) return; // 已请求过，直接退出
        hasLoaded.current = true; // 标记已请求

        InfomationSystem.getArticleDetailOper(id, (res) => {
            if (res === 99) {
                message.error("加载失败");
                navigate(`${CONSTPARAM.ARTICLEBASE}/list`);
                return;
            }
            setArticle(res);
        })
    }, [id])

    return (
        <Card style={{ maxWidth: 800, margin: '0 auto', background: Theme.defalutColor }}>
            <Button icon={<LeftOutlined />} onClick={() => navigate('/article/list')} style={{ marginBottom: 16 }}>
                返回列表
            </Button>
            <Title level={3}>{article.title}</Title>
            <p style={{ color: '#666' }}>作者：{article.author_id} &nbsp;&nbsp; 发布时间：{article.create_time}</p>
            <Paragraph style={{ fontSize: 16, lineHeight: 2 }}>
                {article.content}
            </Paragraph>
        </Card>
    );
}

export default ArticleDetail;