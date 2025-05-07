import React from "react";
import "../styles/VoucherCard.css"; // CSS riêng cho VoucherCard

const VoucherCard = ({ discount, maxDiscount, minOrder, applicableTo, expiryDate, note }) => {
  return (
    <div className="voucher-card">
      <div className="voucher-left">
        <div className="logo-supplier">
          <img
            className="supplier-logo"
            src="https://images.piggi.vn/1720708484611-shopee_bg.webp"
            alt="Shop Logo"
          />
        </div>
        <div className="applicable-to">{applicableTo}</div>
        <div className="expiry-date">
          <i className="fa fa-clock-o"></i> HSD: {expiryDate}
        </div>
      </div>
      <div className="voucher-right">
        <p className="discount">
          Giảm <span className="highlight">{discount}</span>
        </p>
        <p className="min-order">ĐH tối thiểu: {minOrder}</p>
        <p className="note">
          <span className="note-label">Lưu ý:</span> {note}
        </p>
        <div className="voucher-footer">
          <a href="#" className="apply-list">Lấy áp dụng</a>
          <button className="copy-code">Copy mã</button>
        </div>
      </div>
    </div>
  );
};

export default VoucherCard;