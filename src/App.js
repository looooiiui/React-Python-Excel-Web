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
// 自带组件引入
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';

//==========================路由区==========================//
function App() {

  // 页面不存在
  function NotFind() {
    return <h1>404页面不存在</h1>
  }

  // 存储旋转角度
  const [rotateDeg, setRotateDeg] = useState(0);

  useEffect(() => {
    const rotateTimer = setInterval(() => {
      setRotateDeg(prev => (prev + 1) % 360);
    }, 6);

    // 页面关闭时自动清理定时器
    return () => clearInterval(rotateTimer);
  }, []);

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundColor: "rgba(143, 38, 134, 0.21)",
      fontFamily: "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif",
      fontSize: '16px',
      color: '#333',
    }}>
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
        transform: `rotate(${rotateDeg}deg)`,
      }}></div>

      <nav style={{
        padding: "16px 30px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        margin: '20px 0',
        display: "flex",
        gap: "18px",
        fontSize: '18px',
        boxShadow: "0 0px 20px rgba(0, 0, 0, 0.5)"
      }}>
        <Link to="/MainPage" style={{
          color: "#333",
          textDecoration: "none",
          padding: '6px 0',
        }}>首页</Link>

        <Link to="/Bbout" style={{
          color: "#333",
          textDecoration: "none",
          padding: '6px 0'
        }}>关于</Link>
        <Link to="/Login" style={{
          color: "#333",
          textDecoration: "none",
          padding: '6px 0'
        }}>登录</Link>
        <Link to="/Register" style={{
          color: "#333",
          textDecoration: "none",
          padding: '6px 0'
        }}>注册</Link>
      </nav>
      <div style={{
        padding: "30px"
      }}>
        <Routes>
          <Route path='/' element={<Navigate to="/MainPage" replace />} />
          <Route path='/MainPage' element={<MainPage />} />
          <Route path='/Bbout' element={<Bbout />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/user/:id' element={<UserMainPage />} />
          <Route path="*" element={<NotFind />} />
        </Routes>
      </div>

    </div>

  );
}

export default App;
