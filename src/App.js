import './App.css';
import { useEffect, useState, useCallback } from 'react';
// 页面路由相关组件引入
import Bbout from './page/Bbout'
import Login from './page/LoginSystem/Login'
import Register from './page/LoginSystem/Register';
import MainPage from './page/MainPage';
import UserMainPage from './page/UserPage/UserMainPage';
import UserProfile from './page/UserPage/UserProfile/UserProfile';
import AccountManger from './page/UserPage/AdminPage/AccountManager/AccountManager';
import SecurityCenter from './page/UserPage/NormalPage/SecurityCenter';
import ProjectCenter from './page/UserPage/NormalPage/ProjectCenter';
import AiAssistantCenter from './page/UserPage/NormalPage/AiAssistantCenter';
import TrainingCenter from './page/UserPage/NormalPage/TrainingPage';

//=============================成果展示组件===========================
import ResultShowPage from './page/ResultShowcase/ResultShowPage';
import ResultShow from './page/ResultShowcase/ResultShow';
import ResultShowNormal from './page/ResultShowcase/ResultShowNormal';
import TempTest from './page/UserPage/TempTest';
// 文章组件
import ArticleList from './page/ArticlePage/ArticleList';
import ArticlePublish from './page/ArticlePage/ArticlePublish';
import ArticleDetailNormal from './page/ArticlePage/ArticleDetailNormal';
import ArticleDetail from './page/ArticlePage/ArticleDetail';
import ArticleEdit from './page/ArticlePage/ArticleEdit';

// 其他自定义组件引入
import { DebugTool } from './Util/DebugTool/DebugTool';
import NormalTool from './Util/NormalUtils/NormalTool';
import { InfomationSystem } from './InfomationSystem/InfomationSystem';
import AuthRoute from './Util/AuthRoute/AuthRoute';
import Theme from './Theme/theme';
import './Theme/CSS/Header.css'
import CONSTPARAM from './Core/CONST/CONST';

// 自带组件引入
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

//=================UI=======================
import { Layout, Menu, Avatar, Space, Tabs, Button, Dropdown } from 'antd';
import {
  HomeOutlined, InfoOutlined, LoginOutlined, UserAddOutlined, ReadOutlined,
  CloseOutlined, PlusOutlined, CompressOutlined, ClearOutlined, UserOutlined,
  FontColorsOutlined, LogoutOutlined
} from '@ant-design/icons';
import { Color } from 'antd/es/color-picker';
import { CONTAINER_MAX_OFFSET } from 'antd/es/_util/hooks';


// 导航栏
const { Header } = Layout;

// 页面标题映射（路由->显示文字）
const ROUTE_TITLE_MAP = {
  [CONSTPARAM.MAINPAGEURL]: "首页",
  [CONSTPARAM.ABOUTURL]: "关于我们",
  [CONSTPARAM.LOGINURL]: "登录",
  [CONSTPARAM.REGISTERURL]: "注册",
  [CONSTPARAM.TRAINEEMANAGERURL]: "用户管理",
  [CONSTPARAM.SECURITYCENTERURL]: "安全中心",
  [CONSTPARAM.PROJECTIONCENTERURL]: "项目中心",
  [CONSTPARAM.AIASSISTANTURL]: "AI助手",
  [CONSTPARAM.TRAININGCENTERURL]: "培训管理",
  [`${CONSTPARAM.FRONTARTICLE}/list`]: "文章列表",
  [`${CONSTPARAM.FRONTARTICLE}/publish`]: "发布文章",
  [`${CONSTPARAM.FRONTARTICLE}/detail`]: "文章详情",
  [`${CONSTPARAM.FRONTARTICLE}/edit`]: "编辑文章",
  "/user": "个人主页",
  "/user/profile": "个人资料"
};

function App() {
  // 路由钩子
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // ========== 多标签页状态 ==========
  // 标签列表 [{ path:路由, title:标题, key:唯一标识 }]
  const [tabList, setTabList] = useState([
    { path: CONSTPARAM.MAINPAGEURL, title: "首页", key: CONSTPARAM.MAINPAGEURL }
  ]);
  // 当前激活标签key
  const [activeTabKey, setActiveTabKey] = useState(CONSTPARAM.MAINPAGEURL);

  // 根据路由获取页面标题
  const getPageTitle = useCallback((path) => {
    // 动态路由匹配（文章详情/编辑、用户主页）
    if (path.startsWith(`${CONSTPARAM.FRONTARTICLE}/detail`)) return "文章详情";
    if (path.startsWith(`${CONSTPARAM.FRONTARTICLE}/edit`)) return "编辑文章";
    if (path.startsWith(`${CONSTPARAM.RESULTSHOWCASEURL}`)) return "成果展示";
    if (path.startsWith("/user/") && path.includes("/profile")) return "个人资料";
    if (path.startsWith("/user/")) return "个人主页";
    if (path.startsWith("/tempTest")) return "测试网址";
    return ROUTE_TITLE_MAP[path] || "未知页面";
  }, []);

  // 监听路由变化：自动新增标签、切换激活状态
  useEffect(() => {
    const title = getPageTitle(currentPath);
    const existTab = tabList.find(item => item.path === currentPath);
    setActiveTabKey(currentPath);
    if (!existTab) {
      // 不存在则新增标签
      setTabList(prev => [...prev, {
        path: currentPath,
        title,
        key: currentPath
      }]);
    }
  }, [currentPath, getPageTitle, tabList]);

  // 打开新标签（全局通用函数，任意组件可调用跳转新开页面）
  const openNewTab = (targetPath) => {
    navigate(targetPath);
  };

  // 切换标签
  const handleTabChange = (key) => {
    navigate(key);
  };

  // 关闭单个标签
  const handleCloseTab = (targetKey, e) => {
    e.stopPropagation();
    let newTabs = tabList.filter(item => item.key !== targetKey);
    // 至少保留一个首页标签，不能全部关闭
    if (newTabs.length === 0) {
      newTabs = [{ path: CONSTPARAM.MAINPAGEURL, title: "首页", key: CONSTPARAM.MAINPAGEURL }];
      navigate(CONSTPARAM.MAINPAGEURL);
    }
    // 如果关闭的是当前激活页，自动切换到最后一个标签
    if (targetKey === activeTabKey) {
      const lastTab = newTabs[newTabs.length - 1];
      navigate(lastTab.path);
    }
    setTabList(newTabs);
  };

  // 标签右键下拉菜单操作
  const tabContextMenuItems = [
    {
      key: "closeOther",
      label: "关闭其他标签",
      icon: <CompressOutlined />
    },
    {
      key: "closeAll",
      label: "关闭全部标签",
      icon: <ClearOutlined />
    }
  ];
  const handleTabMenuClick = (menuKey, tabKey) => {
    if (menuKey === "closeOther") {
      // 只保留当前标签 + 首页
      const keepTabs = tabList.filter(item => item.key === tabKey || item.key === CONSTPARAM.MAINPAGEURL);
      setTabList(keepTabs);
      navigate(tabKey);
    } else if (menuKey === "closeAll") {
      // 只保留首页
      setTabList([{ path: CONSTPARAM.MAINPAGEURL, title: "首页", key: CONSTPARAM.MAINPAGEURL }]);
      navigate(CONSTPARAM.MAINPAGEURL);
    }
  };

  // 对tabList根据path去重，保留第一个
  const uniqueTabList = Array.from(new Map(tabList.map(item => [item.path, item])).values());
  // 组装Tabs标签渲染项（带关闭按钮+右键菜单）
  const tabItems = uniqueTabList.map(tab => ({
    key: tab.key,
    label: (
      <Dropdown
        menu={{
          items: tabContextMenuItems,
          onClick: (info) => handleTabMenuClick(info.key, tab.key)
        }}
        trigger={["contextMenu"]}
      >
        <Space size={6}>
          <span>{tab.title}</span>
          {tab.key !== CONSTPARAM.MAINPAGEURL && (
            <CloseOutlined
              size={12}
              onClick={(e) => handleCloseTab(tab.key, e)}
              style={{ color: "#999" }}
            />
          )}
        </Space>
      </Dropdown>
    )
  }));

  // 下拉菜单选项
  const avatarMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人主页",
      onClick: () => {
        const info = InfomationSystem.getCurrentLoginInfo();
        openNewTab(`/user/${info.accountId}`);
      }
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      onClick: () => {
        InfomationSystem.logout();
        openNewTab(CONSTPARAM.LOGINURL);
      }
    }
  ];
  // 顶部左侧系统一级菜单（点击直接新开标签）
  const topMenuItems = [
    {
      key: CONSTPARAM.MAINPAGEURL,
      icon: <HomeOutlined />,
      label: "首页",
      onClick: () => openNewTab(CONSTPARAM.MAINPAGEURL)
    },
    {
      key: CONSTPARAM.ABOUTURL,
      icon: <InfoOutlined />,
      label: "关于",
      onClick: () => openNewTab(CONSTPARAM.ABOUTURL)
    },
    ...(InfomationSystem.getCurrentLoginState() ? [] : [{
      key: CONSTPARAM.LOGINURL,
      icon: <LoginOutlined />,
      label: "登录",
      onClick: () => openNewTab(CONSTPARAM.LOGINURL)
    }]),
    ...(InfomationSystem.getCurrentLoginState() ? [] : [{
      key: CONSTPARAM.REGISTERURL,
      icon: <UserAddOutlined />,
      label: "注册",
      onClick: () => openNewTab(CONSTPARAM.REGISTERURL)
    }]),
    {
      key: `${CONSTPARAM.FRONTARTICLE}/list`,
      icon: <ReadOutlined />,
      label: "文章中心",
      onClick: () => openNewTab(`${CONSTPARAM.FRONTARTICLE}/list`)
    },
    {
      key: "/tempTest",
      label: "测试网址",
      onClick: () => openNewTab("/tempTest")
    }
  ].filter(Boolean);

  // 导航顶部其他展示框
  const topChooseNav = [
    {
      key: "/showcase1",
      label: "成果展示主页",
      onClick: () => openNewTab(`${CONSTPARAM.RESULTSHOWCASEURL}`)
    },
    {
      key: "/showcase2",
      label: "研究院介绍",
      onClick: () => openNewTab(`${CONSTPARAM.RESULTSHOWCASEURL}`)
    },
    {
      key: "/showcase3",
      label: "成果展示",
      onClick: () => openNewTab(`${CONSTPARAM.RESULTSHOWCASEURL}`)
    },
    {
      key: "/showcase4",
      label: "风采展示",
      onClick: () => openNewTab(`${CONSTPARAM.RESULTSHOWCASEURL}`)
    },
  ].filter(Boolean);


  return (
    <div style={Theme.WrapAllTheme}>
      {/* 全屏背景图 */}

      {/* 顶部Header区域：左侧主菜单 + 中间多标签Tab栏 + 右侧头像 */}
      <Header style={{
        ...Theme.NavigateTheme,
        padding: "0 16px",
        height: "auto",
      }}>
        {/* 第一行：左侧LOGO + 一级文字菜单 + 头像 */}
        <div style={{ display: "flex", alignItems: "center", width: "100%", height: 80, gap: 24 }}>
          {/* 固定左侧LOGO区块（温大同款布局） */}
          <div style={{
            width: 280,
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}>
            <img
              src={CONSTPARAM.NavLogo}
              alt="研究院LOGO"
              style={{
                height: 50,
                width: "auto",
              }}
            />
          </div>

          {/* 中间横向文字导航菜单 */}
          <Menu
            mode="horizontal"
            items={topMenuItems}
            style={{
              flex: 1,
              background: "transparent",
              borderBottom: "none",
              lineHeight: "80px",
              fontSize: "16px",
              paddingLeft: "200px"
            }}
            theme='dark'
          />

          {/* 右侧头像 */}
          <Dropdown
            menu={{ items: avatarMenuItems }}
            trigger={["hover"]}
          >
            <Avatar
              size={56}
              src="/logo512.png"
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                right: 30
              }}
            />
          </Dropdown>
        </div>

        {/* 第二行：成果展示次级导航菜单*/}
        <Menu
          mode="horizontal"
          theme="dark"
          items={topChooseNav}
          style={{
            background: "transparent",
            borderBottom: "none",
            lineHeight: "40px",
            fontSize: "15px",
          }}
        />

        {/* 第三行：多页面Tab标签栏 */}
        <div style={{ background: "#f5f7fa", padding: "4px 8px" }}>
          <Space size={8} align="center">
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => openNewTab(CONSTPARAM.MAINPAGEURL)}
            >
              新页面
            </Button>
            <div style={{ flex: 1, overflowX: "auto" }}>
              <Tabs
                size="small"
                hideAdd
                items={tabItems}
                activeKey={activeTabKey}
                onChange={handleTabChange}
                tabBarStyle={{ marginBottom: 0 }}
              />
            </div>
          </Space>
        </div>
      </Header>
      {/* 网站中间页面内容区域 */}
      <div style={Theme.ContentWrapTheme}>
        <Routes>
          <Route path='/' element={<Navigate to="/MainPage" replace />} />
          <Route path={CONSTPARAM.MAINPAGEURL} element={<MainPage />} />
          <Route path={CONSTPARAM.ABOUTURL} element={<Bbout />} />
          <Route path={CONSTPARAM.LOGINURL} element={<Login />} />
          <Route path={CONSTPARAM.REGISTERURL} element={<Register />} />
          <Route path={CONSTPARAM.TRAINEEMANAGERURL} element={<AuthRoute requireAdmin={true}><AccountManger /></AuthRoute>} />
          <Route path={CONSTPARAM.SECURITYCENTERURL} element={<AuthRoute><SecurityCenter /></AuthRoute>} />
          <Route path={CONSTPARAM.PROJECTIONCENTERURL} element={<AuthRoute><ProjectCenter /></AuthRoute>} />
          <Route path={CONSTPARAM.AIASSISTANTURL} element={<AuthRoute><AiAssistantCenter /></AuthRoute>} />
          <Route path={CONSTPARAM.RESULTSHOWCASEURL} element={<AuthRoute><ResultShow /></AuthRoute>} />
          <Route path={`${CONSTPARAM.RESULTSHOWCASEURL}/detail?`} element={<AuthRoute><ResultShowNormal /></AuthRoute>} />
          <Route path={`${CONSTPARAM.FRONTARTICLE}/list`} element={<AuthRoute requireAdmin={true}><ArticleList /></AuthRoute>} />
          <Route path={`${CONSTPARAM.FRONTARTICLE}/publish`} element={<AuthRoute requireAdmin={true}><ArticlePublish /></AuthRoute>} />
          <Route path={`${CONSTPARAM.FRONTARTICLE}/detailnormal/:id?`} element={<AuthRoute><ArticleDetailNormal /></AuthRoute>} />
          <Route path={`${CONSTPARAM.FRONTARTICLE}/detail/:id?`} element={<AuthRoute requireAdmin={true}><ArticleDetail /></AuthRoute>} />
          <Route path={`${CONSTPARAM.FRONTARTICLE}/edit/:id`} element={<AuthRoute requireAdmin={true}><ArticleEdit /></AuthRoute>} />
          <Route path={`${CONSTPARAM.TRAININGCENTERURL}`} element={<AuthRoute><TrainingCenter /></AuthRoute>} />
          <Route path='/tempTest' element={<TempTest />} />
          <Route path='/user/:id' element={<AuthRoute><UserMainPage /></AuthRoute>} />
          <Route path='/user/:id/profile' element={<AuthRoute><UserProfile /></AuthRoute>} />
          <Route path="*" element={<NotFind />} />
        </Routes>
      </div>

      {/* 底部信息栏 */}
      <footer>
        <div style={Theme.FooterBigTheme}>
          <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 16, marginBottom: 10, borderBottom: "1px solid #ffffff55", paddingBottom: 6 }}>站点导航</div>
              <div style={{ fontSize: 13, lineHeight: "26px", opacity: 0.9 }}>首页 · 关于我们 · 登录注册</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 16, marginBottom: 10, borderBottom: "1px solid #ffffff55", paddingBottom: 6 }}>联系方式</div>
            <div style={{ fontSize: 13, lineHeight: "26px", opacity: 0.9 }}>地址：我不知道</div>
          </div>
        </div>
        <div style={Theme.FooterCopyrightTheme}>
          ©2026 项目后台管理系统 版权所有 | 浙ICP备XXXX号
        </div>
      </footer>
    </div >

  );
}

// 404页面组件
function NotFind() {
  return <h1>404页面不存在</h1>
}

export default App;