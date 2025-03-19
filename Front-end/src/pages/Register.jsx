<<<<<<< HEAD
// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { Link } from "react-router-dom";

function Register() {
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Giả lập 2s
    setTimeout(() => {
      setLoading(false);
      alert("Đăng ký thành công (giả lập)!");
      // Chuyển trang ...
    }, 2000);
  };

  return (
    <div className={`container ${fadeIn ? "fade-in" : ""}`}>
      <div className="screen">
        <div className="screen__content">
          <form className="login" onSubmit={handleSubmit}>
            <div className="login__field">
              <i className="login__icon fas fa-user"></i>
              <input type="text" className="login__input" placeholder="User name" required />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-envelope"></i>
              <input type="email" className="login__input" placeholder="Email" required />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input type="password" className="login__input" placeholder="Password" required />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input
                type="password"
                className="login__input"
                placeholder="Confirm Password"
                required
              />
            </div>
            <button
              type="submit"
              className={`button login__submit ${loading ? "loading" : ""}`}
            >
              <span className="button__text">
                {loading ? "Processing..." : "Register Now"}
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

export default Register;
=======
// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { Link } from "react-router-dom";

function Register() {
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Giả lập 2s
    setTimeout(() => {
      setLoading(false);
      alert("Đăng ký thành công (giả lập)!");
      // Chuyển trang ...
    }, 2000);
  };

  return (
    <div className={`container ${fadeIn ? "fade-in" : ""}`}>
      <div className="screen">
        <div className="screen__content">
          <form className="login" onSubmit={handleSubmit}>
            <div className="login__field">
              <i className="login__icon fas fa-user"></i>
              <input type="text" className="login__input" placeholder="User name" required />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-envelope"></i>
              <input type="email" className="login__input" placeholder="Email" required />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input type="password" className="login__input" placeholder="Password" required />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input
                type="password"
                className="login__input"
                placeholder="Confirm Password"
                required
              />
            </div>
            <button
              type="submit"
              className={`button login__submit ${loading ? "loading" : ""}`}
            >
              <span className="button__text">
                {loading ? "Processing..." : "Register Now"}
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

export default Register;
>>>>>>> 14fd7dee0989f6389f8eb859f968216a0fcec654
