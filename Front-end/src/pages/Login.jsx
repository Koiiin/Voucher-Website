<<<<<<< HEAD
// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { Link } from "react-router-dom";

function Login() {
  const [loading, setLoading] = useState(false);

  // Dùng để thêm fade-in class
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Khi component mount, bật fade-in
    setFadeIn(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Giả lập thời gian chờ (2s)
    setTimeout(() => {
      setLoading(false);
      alert("Đăng nhập thành công (giả lập)!");
      // Chuyển trang, v.v.
    }, 2000);
  };

  return (
    <div className={`container ${fadeIn ? "fade-in" : ""}`}>
      <div className="screen">
        <div className="screen__content">
          <form className="login" onSubmit={handleSubmit}>
            <div className="login__field">
              <i className="login__icon fas fa-user"></i>
              <input
                type="text"
                className="login__input"
                placeholder="User name / Email"
                required
              />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input
                type="password"
                className="login__input"
                placeholder="Password"
                required
              />
            </div>
            <button
              type="submit"
              className={`button login__submit ${loading ? "loading" : ""}`}
            >
              <span className="button__text">
                {loading ? "Processing..." : "Log In Now"}
              </span>
              <i className="button__icon fas fa-chevron-right"></i>
            </button>
          </form>
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
    </div>
  );
}

export default Login;
=======
// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { Link } from "react-router-dom";

function Login() {
  const [loading, setLoading] = useState(false);

  // Dùng để thêm fade-in class
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Khi component mount, bật fade-in
    setFadeIn(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Giả lập thời gian chờ (2s)
    setTimeout(() => {
      setLoading(false);
      alert("Đăng nhập thành công (giả lập)!");
      // Chuyển trang, v.v.
    }, 2000);
  };

  return (
    <div className={`container ${fadeIn ? "fade-in" : ""}`}>
      <div className="screen">
        <div className="screen__content">
          <form className="login" onSubmit={handleSubmit}>
            <div className="login__field">
              <i className="login__icon fas fa-user"></i>
              <input
                type="text"
                className="login__input"
                placeholder="User name / Email"
                required
              />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input
                type="password"
                className="login__input"
                placeholder="Password"
                required
              />
            </div>
            <button
              type="submit"
              className={`button login__submit ${loading ? "loading" : ""}`}
            >
              <span className="button__text">
                {loading ? "Processing..." : "Log In Now"}
              </span>
              <i className="button__icon fas fa-chevron-right"></i>
            </button>
          </form>
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
    </div>
  );
}

export default Login;
>>>>>>> 14fd7dee0989f6389f8eb859f968216a0fcec654
