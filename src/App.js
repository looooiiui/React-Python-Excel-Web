import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
// 页面路由相关组件引入
import Bbout from './page/Bbout'
import Login from './page/LoginSystem/Login'
import Register from './page/LoginSystem/Register';
import MainPage from './page/MainPage';
import UserMainPage from './UserPage/UserMainPage';

// 其他自定义组件引入
import { DebugTool } from './Util/DebugTool/DebugTool';
import { InfomationSystem } from './InfomationSystem/InfomationSystem';
import Theme from './Theme/theme';
import './Theme/CSS/Header.css'

// 自带组件引入
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

//=============路由使用常量============================
const MAINPAGEURL = "/MainPage"; // 主页面
const LOGINURL = "/Login"; // 登录页面
const ABOUTURL = "/Bbout"; // 关于
const REGISTERURL = "/Register"; // 注册
const USERBASEURL = "/user"; // 用户基址
//==========================路由区==========================
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
      DebugTool.debugLog("路由主界面: 头像点击进入用户主页: " + currentAccountInfo.accountId);
      navigate(USERBASEURL + "/" + currentAccountInfo.accountId);
    } else {
      navigate(LOGINURL);
    }
  }

  return (
    <div style={Theme.AppMainTheme}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,

        backgroundImage: "url('/logo512.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: 'center',
      }}></div>

      <nav style={Theme.NavigateTheme}>
        <Link to={MAINPAGEURL} style={Theme.NavigateFontTheme}>首页</Link>
        <Link to={ABOUTURL} style={Theme.NavigateFontTheme}>关于</Link>
        <Link to={LOGINURL} style={Theme.NavigateFontTheme}>登录</Link>
        <Link to={REGISTERURL} style={Theme.NavigateFontTheme}>注册</Link>
        <img src="/logo512.png" alt="头像" style={Theme.AvatarTheme}
          onClick={avatarClick} />
      </nav>
      <div style={{
        padding: "30px",
      }}>
        <Routes>
          <Route path='/' element={<Navigate to="/MainPage" replace />} />
          <Route path={MAINPAGEURL} element={<MainPage />} />
          <Route path={ABOUTURL} element={<Bbout />} />
          <Route path={LOGINURL} element={<Login />} />
          <Route path={REGISTERURL} element={<Register />} />
          <Route path='/user/:id' element={<UserMainPage />} />
          <Route path="*" element={<NotFind />} />
        </Routes>
      </div>

    </div>

  );
}

export default App;
