import React from "react";
import "../styles/Voucherlist.css";  // Đảm bảo rằng CSS đã được import

function VoucherCard({ title, voucherType, category, validityStart, validityEnd, price, quantity, linkanh }) {
  return (
    <div className="voucher-card">
      <img src={linkanh} alt={title} className="voucher-image" />
      <h3>{title}</h3>
      <p>Loại: {voucherType}</p>
      <p>Danh mục: {category}</p>
      <div className="voucher-details">
        <span>Valid From: {new Date(validityStart).toLocaleDateString()}</span>
        <span>Valid To: {new Date(validityEnd).toLocaleDateString()}</span>
      </div>
      <p className="voucher-price">Giá: {price} VND</p>
      <p>Số lượng: {quantity}</p>
      <button className="get-now-button">Get Now</button>
    </div>
  );
}

export default VoucherCard;
