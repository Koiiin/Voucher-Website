import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/Login.css"; // Sử dụng chung CSS với Login

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Xử lý logic đăng ký
    setTimeout(() => {
      alert("Đăng ký thành công!");
      setLoading(false);
      navigate("/login"); // Chuyển hướng sang trang login
    }, 2000);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Register</h1>
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
              <i className="fas fa-envelope"></i>
            </span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-wrapper">
            <span className="icon">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-wrapper">
            <span className="icon">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`login-btn ${loading ? "loading" : ""}`}
          >
            {loading ? "Processing..." : "Register"}
          </button>
        </form>
        <br></br>
        <div className="register-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;