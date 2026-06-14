import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Table, Button, Space, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
//===================自定义工具=================
import Theme from '../../Theme/theme';
import { InfomationSystem } from '../../InfomationSystem/InfomationSystem';
import CONSTPARAM from '../../Core/CONST/CONST';
import { DebugTool } from '../../Util/DebugTool/DebugTool';

const { Title } = Typography;
const { Sider, Content } = Layout;

function ArticleList() {
    const navigate = useNavigate();
    const [articleData, setArticleData] = useState([]);
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
    const fetchArticleList = async () => {
        // 获取列表

        InfomationSystem.getAllArticleOper((res) => {
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
            });
            setArticleData(useList);
        })


    };

    // 表格列配置
    const columns = [
        { title: '文章标题', dataIndex: 'title', key: 'title' },
        { title: '作者ID', dataIndex: 'author_id', key: 'author' },
        { title: '发布时间', dataIndex: 'create_time', key: 'createTime' },
        { title: '阅读量', dataIndex: 'views', key: 'views' },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EyeOutlined />} onClick={() => navigate(`/article/detail/${record.id}`)}>查看</Button>
                    <Button icon={<EditOutlined />} onClick={() => navigate(`/article/edit/${record.id}`)}>编辑</Button>
                    <Popconfirm title="确定删除这篇文章？" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<DeleteOutlined />}>删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    // 页面挂载加载列表
    useEffect(() => {
        fetchArticleList();
    }, []);

    return (
        <Layout style={{ minHeight: '400px', background: 'transparent' }}>
            <Sider width={200} theme="light" style={{ background: Theme.defalutColor, borderRadius: 8 }}>
                <Menu
                    mode="inline"
                    selectedKeys={['list']}
                    items={menuItems}
                    onClick={handleMenuClick}
                    style={{ height: '100%', borderRight: 0 }}
                />
            </Sider>

            <Content style={{ padding: '0 24px' }}>
                <Title level={4}>文章列表</Title>
                <Table
                    rowKey="id"
                    dataSource={articleData}
                    columns={columns}
                    pagination={{ pageSize: 10 }}
                />
            </Content>
        </Layout>
    );
}

export default ArticleList;