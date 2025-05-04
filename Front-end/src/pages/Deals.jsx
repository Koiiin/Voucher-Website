import React, { useEffect } from 'react';
import voucherData from '../assets/vouchers.json'; // Import dữ liệu voucher từ file JSON
import shopeeLogo from "../img/san/shopee.png";
import lazadaLogo from "../img/san/lazada.png";
import tikiLogo from "../img/san/tiki.png";
import sendoLogo from "../img/san/sendo.png";
import "../styles/Deals.css"; // Import CSS cho component Deals

const Deals = () => {
  console.log("Deals component is rendering"); // Kiểm tra xem component có được render không

  return (
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
          <img src="sendo-logo.png" alt="Sendo" className="san-logo" />
          <span className="san-name">Sendo</span>
          <span className="san-count">3</span>
        </li>
        <li className="san-item">
          <img src="sendo-logo.png" alt="Sendo" className="san-logo" />
          <span className="san-name">Sendo</span>
          <span className="san-count">3</span>
        </li>
      </ul>
    </div>
  );
};

export default Deals;