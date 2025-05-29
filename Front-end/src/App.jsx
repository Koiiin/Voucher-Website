import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Deals from "./pages/Deals";
import UserVoucher from "./pages/Categories";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import Home from "./pages/Home";
import User from "./pages/User";
import Cart from "./pages/Cart";
import CreateV from "./components/CreateV";
import OauthSuccess from "./pages/OauthSuccess"; 
import PaymentStatus from "./pages/PaymentStatus";
import "./styles/global.css";
import React, { useEffect, useState } from 'react';
import ScrollToTop from "./components/ScrollToTop";
import Toast from "./components/toast";

function App() {
  const [toast, setToast] = useState({ message: "", type: "info" });

  // Kiểm tra trạng thái đăng nhập từ sessionStorage
  //const isLoggedIn = !!sessionStorage.getItem("accessToken");

  // Sử dụng useLocation để theo dõi URL hiện tại
  const location = useLocation();

  // Hàm kiểm tra nếu cần ẩn Header và Footer
  const hideHeaderAndFooter = location.pathname === "/login" || location.pathname === "/register";

  // Hàm cuộn lên đầu trang khi người dùng nhấp vào nút "Scroll to Top"
  useEffect(() => {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    const handleScroll = () => {
      if (window.scrollY > 200) {
        scrollToTopBtn.style.display = 'flex'; // Hiển thị nút khi cuộn xuống
      } else {
        scrollToTopBtn.style.display = 'none'; // Ẩn nút khi ở đầu trang
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="app-container">
      <div>
      {/* Nội dung trang */}
      <button id="scrollToTopBtn" className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        ⬆
      </button>
      </div>
      {!hideHeaderAndFooter && <Header />} {/* Hiển thị Header nếu không ở trang login/register */}
      <div className="main-content">
          <ScrollToTop /> {/* Cuộn lên đầu trang khi điều hướng */}
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: "" })}
            duration={2000}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home setToast={setToast} />} />
            <Route path="/chatbot" element={ <Chatbot />} />
            <Route path="/deals" element={<Deals setToast={setToast} /> } />
            <Route path="/UserVoucher" element={<UserVoucher /> } />
              {/* Route mặc định: Chuyển hướng đến trang chủ nếu vào bất cứ trang nào không hợp lệlệ*/}
            <Route path="*" element={<Navigate to="/" />} />
              {/* /*user */ }
            <Route path="/user" element={<User />} />
            {/* Giỏ hàng */}
            <Route path="/cart" element={<Cart setToast={setToast} />} />
            {/* Tạo voucher */}
            <Route path="/create-voucher" element={<CreateV />} />
            <Route path="/oauth-success" element={<OauthSuccess />} /> {/* Đường dẫn cho callback từ Google */}
            <Route path="/oauth-error" element={<div>Đăng nhập thất bại!</div>} /> {/* Đường dẫn cho lỗi từ Google */}
            <Route path="/payment/:status" element={<PaymentStatus />} />
          </Routes>
      </div>
      {!hideHeaderAndFooter && <Footer />} {/* Hiển thị Footer nếu không ở trang login/register */}
    </div>
  );
}

export default App;