import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "../styles/Login.css"; // Import CSS styles for the login page

function Login() {
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        alert("Đăng nhập thành công!");
        navigate("/");
        window.location.reload();
      } else {
        alert("Đăng nhập thất bại!");
      }
    } catch (error) {
      setLoading(false);
      alert("Lỗi kết nối đến server!");
      console.error(error);
    }
  };

  return (
    <div className={`login-page ${fadeIn ? "fade-in" : ""}`}>
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
          <button className="facebook-btn">
            <i className="fab fa-facebook-f"></i> Facebook
          </button>
          <button className="google-btn">
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