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
  onAddToCart
}) => {
  // Cắt note nếu quá dài
  const maxNoteLength = 48;

  const shortNote =
    note && note.length > maxNoteLength ? (
      <>
        {note.slice(0, maxNoteLength)}...
        <span className="see-more"> Xem chi tiết</span>
      </>
    ) : (
      note
    );


  return (
    <div className="voucher-card">
      <button className="add-to-cart-btn" onClick={onAddToCart} title="Thêm vào giỏ hàng">
        🛒
      </button>
      <div className="voucher-left">
        <div className="logo-supplier">
          <img
            className="supplier-logo"
            src={supplier?.avatar || "https://images.piggi.vn/1720708484611-shopee_bg.webp"}
            alt="Shop Logo"
          />
        </div>
        <div className="applicable-to">{supplier?.title || voucherCategory?.title}</div>
        <div className="expiry-date">
          <i className="fa fa-clock-o"></i>⏱ HSD:{" "}
          {expiredAt
            ? new Date(expiredAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
              })
            : "--/--"}
        </div>
      </div>
      <div className="voucher-right">
        <p className="discount">
          Giảm{" "}
          <span className="highlight">
            {voucherType === "percent"
              ? `${voucherAmount}%`
              : `${voucherAmount?.toLocaleString()}đ`}
          </span>
        </p>
        <p >
          <span style={{ fontSize: '90%' }}>ĐH tối thiểu: </span> <span className="min-order">{minSpend ? Number(minSpend).toLocaleString() + "đ" : "--"}</span>
        </p>
        <p className="note">
          <span className="note-label">Lưu ý:</span> {shortNote}
        </p>
        <div className="voucher-footer">
          <span className="apply-list">#Lưu trên banner</span>
          <a href={affLink || "#"} target="_blank" rel="noopener noreferrer">
            <button className="copy-code">Đến Banner</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default VoucherCard;