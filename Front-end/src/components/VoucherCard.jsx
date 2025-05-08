import React from "react";
import "../styles/VoucherCard.css"; // CSS riêng cho VoucherCard

const VoucherCard = ({
  voucherCategory,
  supplier,
  voucherType,
  voucherAmount,
  minSpend,
  expiredAt,
  note,
  affLink,
  onGetNow
}) => {
  return (
    <div className="voucher-card">
      <div className="voucher-left">
        <div className="logo-supplier">
          <img
            className="supplier-logo"
            src={supplier?.avatar || "https://images.piggi.vn/1720708484611-shopee_bg.webp"}
            alt="Shop Logo"
          />
        </div>
        <div className="applicable-to">{voucherCategory?.title || supplier?.title}</div>
        <div className="expiry-date">
          <i className="fa fa-clock-o"></i> HSD: {expiredAt ? new Date(expiredAt).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'}) : '--/--'}
        </div>
      </div>
      <div className="voucher-right">
        <p className="discount">
          Giảm <span className="highlight">{voucherType === 'percent' ? `${voucherAmount}%` : `${voucherAmount?.toLocaleString()}đ`}</span>
        </p>
        <p className="min-order">ĐH tối thiểu: {minSpend ? Number(minSpend).toLocaleString() + 'đ' : '--'}</p>
        <p className="note">
          <span className="note-label">Lưu ý:</span> {note}
        </p>
        <div className="voucher-footer">
          <span className="apply-list">#Lưu trên banner</span>
          <a href={affLink || '#'} target="_blank" rel="noopener noreferrer">
            <button className="copy-code" style={{minWidth: 110}}>Đến Banner</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default VoucherCard;