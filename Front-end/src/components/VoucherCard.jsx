
// src/components/VoucherCard.jsx
import React from "react";
import "../styles/VoucherCard.css";

function VoucherCard({ discount, title, expiry }) {
  return (
    <div className="voucher-card">
      <div className="voucher-discount">{discount}</div>
      <div className="voucher-title">{title}</div>
      <div className="voucher-expiry">HSD: {expiry}</div>
      <button className="voucher-btn">Trao đổi ngay</button>
    </div>
  );
}

export default VoucherCard;

