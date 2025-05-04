import React, { useEffect, useState, useRef } from 'react';
import voucherData from '../assets/vouchers.json'; // Import dữ liệu voucher từ file JSON
import shopeeLogo from "../img/san/shopee.png";
import lazadaLogo from "../img/san/lazada.png";
import tikiLogo from "../img/san/tiki.png";
import sendoLogo from "../img/san/sendo.png";
import nguyenKimLogo from "../img/san/nguyenkim.png";
import dienMayXanhLogo from "../img/san/dienmayxanh.png";
import fahasaLogo from "../img/san/fahasa.png";
import shopeefoodLogo from "../img/san/shopeefood.png";

import "../styles/Deals.css"; // Import CSS cho component Deals

const Deals = () => {
  console.log("Deals component is rendering"); // Kiểm tra xem component có được render không

  const shopee = [
    { label: "Tất cả", icon: "🌀" },
    { label: "Toàn Sàn", icon: "☑️" },
    { label: "Shopee Choice", icon: "🛍️" },
    { label: "Shop nổi bật", icon: "🌼" },
    { label: "Shopee Live", icon: "📺" },
    { label: "Voucher Xtra", icon: "🎟️" },
    { label: "Đời Sống", icon: "🏠" },
    { label: "Freeship", icon: "🚚" },
    { label: "Tiêu Dùng", icon: "🛒" },
    { label: "Shopee Video", icon: "🎥" },
    { label: "Chọn Lọc", icon: "🔍" },
    { label: "Quốc tế", icon: "🌐" },
    { label: "Shopee Mall", icon: "🛒" },
    { label: "Điện Tử", icon: "💻" },
    { label: "Thời Trang", icon: "👗" },
    { label: "Shop triển vọng", icon: "⭐" },
  ];

  const [activeTab, setActiveTab] = useState("Tất cả");

  const filterContainerRef = useRef(null);

  const scrollLeft = () => {
    if (filterContainerRef.current) {
      filterContainerRef.current.scrollBy({
        left: -300, // Cuộn sang trái 100px
        behavior: 'smooth', // Cuộn mượt
      });
    }
  };

  const scrollRight = () => {
    if (filterContainerRef.current) {
      filterContainerRef.current.scrollBy({
        left: 300, // Cuộn sang phải 100px
        behavior: 'smooth', // Cuộn mượt
      });
    }
  };

  return (
    <div className='deals-page'>
      <div className="san-list-container">
        <h3 className="san-list-title">
          Lọc theo <span className="highlight">Sàn</span>
        </h3>
        <ul className="san-list">
          <li className="san-item">
            <img src={shopeeLogo} alt="Shopee" className="san-logo" />
            <span className="san-name">Shopee</span>
            <span className="san-count">123</span>
          </li>
          <li className="san-item">
            <img src={lazadaLogo} alt="Lazada" className="san-logo" />
            <span className="san-name">Lazada</span>
            <span className="san-count">110</span>
          </li>
          <li className="san-item">
            <img src={tikiLogo} alt="Tiki" className="san-logo" />
            <span className="san-name">Tiki</span>
            <span className="san-count">95</span>
          </li>
          <li className="san-item">
            <img src={sendoLogo} alt="Sendo" className="san-logo" />
            <span className="san-name">Sendo</span>
            <span className="san-count">3</span>
          </li>
          <li className="san-item">
            <img src={shopeefoodLogo} alt="ShopeeFood" className="san-logo" />
            <span className="san-name">Shopee Food</span>
            <span className="san-count">3</span>
          </li>
          <li className="san-item">
            <img src={nguyenKimLogo} alt="NguyenKim" className="san-logo" />
            <span className="san-name">Nguyễn Kim</span>
            <span className="san-count">3</span>
          </li>
          <li className="san-item">
            <img src={dienMayXanhLogo} alt="DienMayXanh" className="san-logo" />
            <span className="san-name">Điện Máy Xanh</span>
            <span className="san-count">3</span>
          </li>
          <li className="san-item">
            <img src={fahasaLogo} alt="Fahasa" className="san-logo" />
            <span className="san-name">Fahasa</span>
            <span className="san-count">3</span>
          </li>
        </ul>
      </div>
      <div className='main-deals-container'>
        <div class="san-filter-wrapper">
          <button class="scroll-btn left-btn" onClick={scrollLeft}>◀</button>
            <div className="san-filter-container" ref={filterContainerRef}>
              {shopee.map((item, index) => (
              <div key={index} className="san-filter-item">
                <span className="san-filter-icon">{item.icon}</span>
                <span className="san-filter-label">{item.label}</span>
              </div>
              ))}
            </div>
          <button class="scroll-btn right-btn" onClick={scrollRight}>▶</button>
        </div>
      </div>
    </div>
  );
};

export default Deals;