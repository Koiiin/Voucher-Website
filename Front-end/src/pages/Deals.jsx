import React, { useEffect, useState, useRef } from 'react';
import voucherData from '../assets/vouchers.json'; // Dữ liệu voucher

// Logo các sàn
import shopeeLogo from "../img/san/shopee.png";
import lazadaLogo from "../img/san/lazada.png";
import tikiLogo from "../img/san/tiki.png";
import sendoLogo from "../img/san/sendo.png";
import nguyenKimLogo from "../img/san/nguyenkim.png";
import dienMayXanhLogo from "../img/san/dienmayxanh.png";
import fahasaLogo from "../img/san/fahasa.png";
import shopeefoodLogo from "../img/san/shopeefood.png";
import Logo from "../assets/icon.png";

import "../styles/Deals.css"; // CSS riêng cho Deals

// Các bộ lọc theo từng sàn
const shopee = [
  { label: "Tất cả", icon: "📋" },
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

const lazada = [
  { label: "Tất cả", icon: "📋" },
  { label: "Toàn Sàn", icon: "☑️" },
  { label: "Sắc Đẹp", icon: "💄" },
  { label: "Đối Tác Thanh Toán", icon: "🤝" },
  { label: "LazChoice", icon: "🏷️" },
  { label: "Chọn Lọc", icon: "🔍" },
  { label: "Thời Trang", icon: "👗" },
  { label: "Gia Dụng", icon: "🏠" },
  { label: "Điện Tử", icon: "💻" },
  { label: "Bách Hóa Online", icon: "🛒" },
  { label: "Nhà Cửa Đời Sống", icon: "🏡" },
  { label: "Nhà Sách Online", icon: "📚" },
  { label: "Mẹ & Bé", icon: "🍼" },
  { label: "Dịch Vụ", icon: "💧" },
];

const Deals = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("Tất cả các sàn");
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const filterContainerRef = useRef(null);

  // Khi selectedPlatform thay đổi, lọc lại voucher
  useEffect(() => {
    const filtered = voucherData.filter(v => v.platform === selectedPlatform);
    setFilteredVouchers(filtered);
  }, [selectedPlatform]);

  const handlePlatformClick = (platformName) => {
    setSelectedPlatform(platformName);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang
  };

  const scrollLeft = () => {
    filterContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    filterContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className='deals-page'>
      <div className="san-list-container">
        <h3 className="san-list-title">Lọc theo <span className="highlight">Sàn</span></h3>
        <ul className="san-list">
          {[
            { name: 'Tất cả các sàn', logo: Logo },
            { name: 'Shopee', logo: shopeeLogo },
            { name: 'Lazada', logo: lazadaLogo },
            { name: 'Tiki', logo: tikiLogo },
            { name: 'Sendo', logo: sendoLogo },
            { name: 'Shopee Food', logo: shopeefoodLogo },
            { name: 'Nguyễn Kim', logo: nguyenKimLogo },
            { name: 'Điện Máy Xanh', logo: dienMayXanhLogo },
            { name: 'Fahasa', logo: fahasaLogo },
          ].map(({ name, logo }, index) => (
            <li key={index} className="san-item">
              <button
                className={`san-button ${selectedPlatform === name ? 'active' : ''}`}
                onClick={() => handlePlatformClick(name)}
              >
                <img src={logo} alt={name} className="san-logo" />
                <span className="san-name">{name}</span>
                <span className="san-count">123</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className='main-deals-container'>
        {selectedPlatform === "Shopee" || selectedPlatform === "Lazada" ? (
          <div className="san-filter-wrapper">
            <button className="scroll-btn left-btn" onClick={scrollLeft}>◀</button>
            <div className="san-filter-container" ref={filterContainerRef}>
              {(selectedPlatform === "Shopee" ? shopee : lazada).map((item, index) => (
                <div key={index} className="san-filter-item">
                  <span className="san-filter-icon">{item.icon}</span>
                  <span className="san-filter-label">{item.label}</span>
                </div>
              ))}
            </div>
            <button className="scroll-btn right-btn" onClick={scrollRight}>▶</button>
          </div>
        ) : null}

        <h2 className='title-main-deals'>Danh sách mã giảm giá <span className='highlight'>{selectedPlatform}</span></h2>
        <div className="voucher-list">
          {filteredVouchers.map((v, i) => (
            <div key={i} className="voucher-card">
              <p><strong>{v.title}</strong></p>
              <p>{v.description}</p>
              <p>Platform: {v.platform}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deals;
