import React, { useState } from "react";
import { Link } from "react-router-dom";
import userInf from "../pages/User";
import "../styles/UserMenu.css"; 
import { logout } from "../services/authService";

function UserMenu({ name, onLogout }) {
    const [open, setOpen] = useState(false);
  
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  
    const toggleMenu = () => {
      setOpen(!open);
    };
  
    return (
      <div className="user-menu">
        <div className="avatar" onClick={toggleMenu}>
          {initials}
        </div>
        {open && (
          <div className="dropdown">
            <Link to ="/user" className="dropdown-item">👤 Hồ sơ</Link>
            <p className="dropdown-item">⚙️ Cài đặt</p>
            <p className="dropdown-item" onClick={onLogout} style={{ cursor: "pointer", color: "red" }}>🚪 Đăng xuất</p>
          </div>
        )}
      </div>
    );
  }
  

export default UserMenu;