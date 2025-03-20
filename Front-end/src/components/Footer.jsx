
// src/components/Footer.jsx
import React from "react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <p>© 2025 VouX - Nền tảng chia sẻ và trao đổi voucher hàng đầu</p>
      </div>
      <div className="footer-links">
        <a href="/contact">Liên hệ</a>
        <a href="/policy">Chính sách</a>
        <a href="/guide">Hướng dẫn sử dụng</a>
      </div>
    </footer>
  );
}

export default Footer;

