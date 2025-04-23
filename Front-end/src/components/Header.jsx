import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import UserMenu from "./usermenu";  
function Header() {
  const [user, setUser] = useState(null);  // Giữ tên người dùng trong state
  const navigate = useNavigate();

  // Kiểm tra sessionStorage khi component mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("username");
    console.log(storedUser);  // Kiểm tra giá trị username trong sessionStorage
    if (storedUser) {
      setUser(storedUser);  // Cập nhật state 'user' với giá trị 'username' từ sessionStorage
    }
    
  }, []);  // Chỉ chạy 1 lần khi component được render

  // Hàm logout
  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("username");
    setUser(null);  // Xóa tên người dùng trong state khi logout
    navigate("/");  // Điều hướng về trang chủ
  };
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">VouX</Link>
      </div>
      <nav>
        <Link to="/categories" className="menu-btn">Danh mục</Link>
        <Link to="/deals" className="discount-btn">Ưu đãi hot</Link>
        <Link to="/chatbot" className="chatbot-btn">Chatbot</Link>
        {user ? (
          <>
            <UserMenu name={user} onLogout={handleLogout} />
            <script>
              {user && "window.location.reload();"}
            </script>
          </>
          
        ) : (
          <>
            <Link to="/login" className="login-btn">Đăng nhập</Link>
            <Link to="/register" className="register-btn">Đăng ký</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;