import './App.css';
import { useEffect, useState } from 'react';
// 页面路由相关组件引入
import Bbout from './page/Bbout'
import Login from './page/LoginSystem/Login'
import Register from './page/LoginSystem/Register';
import MainPage from './page/MainPage';
import UserMainPage from './page/UserPage/UserMainPage';
import UserProfile from './page/UserPage/UserProfile/UserProfile';

// 其他自定义组件引入
import { DebugTool } from './Util/DebugTool/DebugTool';
import { InfomationSystem } from './InfomationSystem/InfomationSystem';
import AuthRoute from './Util/DebugTool/AuthRoute/AuthRoute';
import Theme from './Theme/theme';
import './Theme/CSS/Header.css'
import CONSTPARAM from './Core/CONST/CONST';

// 自带组件引入
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function App() {

  // 路由跳转
  const navigate = useNavigate();

  // 页面不存在
  function NotFind() {
    return <h1>404页面不存在</h1>
  }

  // 头像点击
  function avatarClick() {
    var currentLoginState = InfomationSystem.getCurrentLoginState();
    DebugTool.debugLog("路由主界面: 头像点击登录状态: " + currentLoginState);
    // 用户登录状态判断
    if (currentLoginState) {
      var currentAccountInfo = InfomationSystem.getCurrentLoginInfo();
      var currentAccountId = currentAccountInfo.accountId;
      DebugTool.debugLog("路由主界面: 头像点击进入用户主页: " + currentAccountId);
      navigate(CONSTPARAM.USERBASEURL + "/" + currentAccountId + "/" + CONSTPARAM.USERPROFILE);
    } else {
      navigate(CONSTPARAM.LOGINURL);
    }
  }

  return (
    <div style={Theme.WrapAllTheme}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        backgroundImage: `url(${CONSTPARAM.MainBackgoundLogo})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: 'center',
      }}></div>

      <nav style={Theme.NavigateTheme}>
        <Link to={CONSTPARAM.MAINPAGEURL} style={Theme.NavigateFontTheme}>首页</Link>
        <Link to={CONSTPARAM.ABOUTURL} style={Theme.NavigateFontTheme}>关于</Link>
        <Link to={CONSTPARAM.LOGINURL} style={Theme.NavigateFontTheme}>登录</Link>
        <Link to={CONSTPARAM.REGISTERURL} style={Theme.NavigateFontTheme}>注册</Link>
        <img src="/logo512.png" alt="头像" style={Theme.AvatarTheme} onClick={avatarClick} />
      </nav>

      {/* 网站中间 */}
      <div style={Theme.ContentWrapTheme}>
        <Routes>
          <Route path='/' element={<Navigate to="/MainPage" replace />} />
          <Route path={CONSTPARAM.MAINPAGEURL} element={<MainPage />} />
          <Route path={CONSTPARAM.ABOUTURL} element={<Bbout />} />
          <Route path={CONSTPARAM.LOGINURL} element={<Login />} />
          <Route path={CONSTPARAM.REGISTERURL} element={<Register />} />
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
    </div>

  );
}

export default App;
