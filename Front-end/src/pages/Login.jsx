import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Điều hướng sau khi đăng nhập
import { login } from "../services/authService"; // Import hàm login từ authService

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

    // fetch("http://localhost:3000/api/auth/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ username, password }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setLoading(false);
    //     if (data.success) {
    //       sessionStorage.setItem("accessToken", data.accessToken);
    //       sessionStorage.setItem("username", data.username); // them de luu ten
    //       alert("Đăng nhập thành công!");
    //       navigate("/"); // dieu huong ve home 
    //       window.location.reload(); // cp nhat trang thoi
    //     } else {
    //       alert("Đăng nhập thất bại!");
    //     }
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     alert("Lỗi kết nối đến server!");
    //     console.error(error);
    //   });
    
    try {
      const data = await login(username, password);
      setLoading(false);
      
      if (data.success) {
        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("username", data.username); // them de luu ten
        alert("Đăng nhập thành công!");
        navigate("/"); // dieu huong ve home 
        window.location.reload(); // cp nhat trang thoi
      } else {
        alert("Đăng nhập thất bại!");
      }
    } catch (error) {
      setLoading(false);
      alert("Lỗi kết nối đến server!");
      console.error("hahahahahah");
    }
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input
                type="password"
                className="login__input"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
