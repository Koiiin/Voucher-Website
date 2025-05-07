import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { handleGoogleLogin } from "../services/authService";
import SuccessModal from "../components/LoginModal"; 
import "../styles/Login.css";

function Login() {
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modalData, setModalData] = useState({
    show: false,
    success: true,
    message: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const data = await login(username, password);
      setLoading(false);
  
      if (data.success) {
        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("username", data.username);
        
        setModalData({
          show: true,
          success: true,
          message: "🎉 Đăng nhập thành công!",
        });
      } else {
        setModalData({
          show: true,
          success: false,
          message: data.message,
        });
      }
    } catch (error) {
      setLoading(false);
      setModalData({
        show: true,
        success: false,
        message: "⚠️ Lỗi kết nối đến server!",
      });
      console.error(error);
    }
  };
  
  const handleCloseModal = () => {
    setModalData((prev) => ({ ...prev, show: false }));
    if (modalData.success) {
      navigate("/");
      window.location.reload();
    }
  };
  

  const handleFacebookLogin = () => {
    if (!window.FB) {
      alert("Facebook SDK chưa được tải!");
      return;
    }

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          window.FB.api("/me?fields=id,name,email", function (userInfo) {
            fetch("http://localhost:3000/api/auth/facebook", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                facebookId: userInfo.id,
                username: userInfo.name,
                email: userInfo.email,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("userData", JSON.stringify(data));
                alert("Đăng nhập Facebook thành công!");
                navigate("/");
                window.location.reload();
              })
              .catch((err) => {
                console.error("Lỗi khi gửi dữ liệu Facebook về server:", err);
                alert("Có lỗi xảy ra khi đăng nhập với Facebook!");
              });
          });
        } else {
          alert("Bạn đã huỷ đăng nhập.");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  const handleCloseModalFB = () => {
    setModalData((prev) => ({ ...prev, show: false }));
    if (modalData.success) {
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className={`login-page ${fadeIn ? "fade-in" : ""}`}>
      {modalData.show && (
        <SuccessModal
          success={modalData.success}
          message={modalData.message}
          onClose={handleCloseModal}
        />
      )}

      <div className="login-box">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <span className="icon">
              <i className="fas fa-user"></i>
            </span>
            <input
              type="text"
              placeholder="User name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-wrapper">
            <span className="icon">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="options">
            <label className="remember">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="#" className="forgot">Forgot Password?</Link>
          </div>

          <button type="submit" className={`login-btn ${loading ? "loading" : ""}`}>
            {loading ? "Processing..." : "Login"}
          </button>
        </form>

        <div className="or-divider">
          <span>or</span>
        </div>

        <div className="social-buttons">
          <button className="facebook-btn" onClick={handleFacebookLogin}>
            <i className="fab fa-facebook-f"></i> Facebook
          </button>
          <button className="google-btn" onClick={handleGoogleLogin}>
            <i className="fab fa-google"></i> Google
          </button>
        </div>

        <div className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
