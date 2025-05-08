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
  // Cắt note nếu quá dài
  const maxNoteLength = 48;
  const shortNote = note && note.length > maxNoteLength
    ? note.slice(0, maxNoteLength) + '... Xem chi tiết'
    : note;

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
        <div className="applicable-to" style={{fontWeight: 700, fontSize: 18}}>{supplier?.title || voucherCategory?.title}</div>
        <div className="expiry-date" style={{color: '#fff', fontWeight: 500}}>
          <i className="fa fa-clock-o"></i> HSD: {expiredAt ? new Date(expiredAt).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'}) : '--/--'}
        </div>
      </div>
      <div className="voucher-right">
        <p className="discount" style={{fontWeight: 600, fontSize: 18, marginBottom: 0}}>
          Giảm <span className="highlight" style={{fontSize: 28, color: '#2e7d32'}}>{voucherType === 'percent' ? `${voucherAmount}%` : `${voucherAmount?.toLocaleString()}đ`}</span>
        </p>
        <p className="min-order" style={{fontWeight: 600, margin: 0, fontSize: 15}}>
          ĐH tối thiểu: {minSpend ? Number(minSpend).toLocaleString() + 'đ' : '--'}
        </p>
        <p className="note" style={{color: '#e74c3c', fontSize: 13, margin: '6px 0 0 0'}}>
          <span className="note-label" style={{fontWeight: 700}}>Lưu ý:</span> {shortNote}
        </p>
        <div className="voucher-footer" style={{marginTop: 10}}>
          <span className="apply-list" style={{fontSize: 14, border: '1px solid #6A8E5A', color: '#6A8E5A', background: '#fff', borderRadius: 6, padding: '4px 12px', fontWeight: 500}}>
            #Lưu trên banner
          </span>
          <a href={affLink || '#'} target="_blank" rel="noopener noreferrer">
            <button className="copy-code" style={{minWidth: 120, background: '#2e7d32', fontWeight: 700, fontSize: 16, borderRadius: 8}}>
              Đến Banner
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default VoucherCard;