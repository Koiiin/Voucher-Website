import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Deals from "./pages/Deals";
import Categories from "./pages/Categories";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import Home from "./pages/Home";
import "./styles/global.css";

function App() {
  // Kiểm tra trạng thái đăng nhập từ sessionStorage
  const isLoggedIn = !!sessionStorage.getItem("accessToken");

  // Sử dụng useLocation để theo dõi URL hiện tại
  const location = useLocation();

  // Hàm kiểm tra nếu cần ẩn Header và Footer
  const hideHeaderAndFooter = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="app-container">
      {!hideHeaderAndFooter && <Header />} {/* Hiển thị Header nếu không ở trang login/register */}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/chatbot" element={isLoggedIn ? <Chatbot /> : <Navigate to="/login" />} />
          <Route path="/deals" element={isLoggedIn ? <Deals /> : <Navigate to="/login" />} />
          <Route path="/categories" element={isLoggedIn ? <Categories /> : <Navigate to="/login" />} />
          {/* Route mặc định: Chuyển hướng đến trang chủ nếu vào bất cứ trang nào không hợp lệlệ*/}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {!hideHeaderAndFooter && <Footer />} {/* Hiển thị Footer nếu không ở trang login/register */}
    </div>
  );
}

export default App;