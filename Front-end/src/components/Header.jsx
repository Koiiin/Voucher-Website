<<<<<<< HEAD
// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">VouX</Link>
      </div>
      <nav>
        <Link to="/categories" className="menu-btn">Danh mục</Link>
        <Link to="/deals" className="discount-btn">Ưu đãi hot</Link>
        <Link to="/login" className="login-btn">Đăng nhập</Link>
        <Link to="/register" className="register-btn">Đăng ký</Link>
      </nav>
    </header>
  );
}

export default Header;
=======
// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">VouX</Link>
      </div>
      <nav>
        <Link to="/categories" className="menu-btn">Danh mục</Link>
        <Link to="/deals" className="discount-btn">Ưu đãi hot</Link>
        <Link to="/login" className="login-btn">Đăng nhập</Link>
        <Link to="/register" className="register-btn">Đăng ký</Link>
      </nav>
    </header>
  );
}

export default Header;
>>>>>>> 14fd7dee0989f6389f8eb859f968216a0fcec654
