import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
// 页面路由相关组件引入
import Bbout from './page/Bbout'
import Login from './page/LoginSystem/Login'
import Register from './page/LoginSystem/Register';
import MainPage from './page/MainPage';
// 其他自定义组件引入
import { DebugTool } from './Util/DebugTool/DebugTool';
// 自带组件引入
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';

//==========================路由区==========================//
function App() {

  // 页面不存在
  function NotFind() {
    return <h1>404页面不存在</h1>
  }

  return (
    <div style={{
      padding: 100,
      backgroundImage: "url('/logo512.png')",
      backgroundColor: "pink",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat"
    }}>
      <nav style={{
        margin: '20px 0',
        fontSize: 42
      }}>
        <Link to="/MainPage" style={{ marginRight: 10 }}>首页</Link>
        <Link to="/Bbout" style={{ marginRight: 10 }}>关于</Link>
        <Link to="/Login" style={{ marginRight: 10 }}>登录</Link>
        <Link to="/Register" style={{ marginRight: 10 }}>注册</Link>
      </nav>
      <Routes>
        <Route path='/' element={<Navigate to="/MainPage" replace />} />
        <Route path='/MainPage' element={<MainPage />} />
        <Route path='/Bbout' element={<Bbout />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Register' element={<Register />} />
        <Route path="*" element={<NotFind />} />
      </Routes>

    </div>
  );
}

export default App;
