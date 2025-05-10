import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../services/voucherService";
import { getToken, authRequest } from "../services/authService";
import "../styles/VoucherCard.css"; // CSS riêng cho VoucherCard

const VoucherCard = ({
  id,
  _id,
  title,
  voucherType,
  voucherAmount,
  maxDiscount,
  minSpend,
  voucherCode,
  startAt,
  expiredAt,
  affLink,
  note,
  totalClick,
  supplier,
  voucherCategory,
  isInCart = false, // prop này để biết nếu hiển thị trong giỏ hàng
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  
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

  // Hàm thêm vào giỏ hàng
  const handleAddToCart = async () => {
    const token = getToken();
    if (!token) {
      alert("Vui lòng đăng nhập để thêm voucher vào giỏ hàng!");
      navigate("/login");
      return;
    }

    try {
      setIsProcessing(true);
      // Ưu tiên sử dụng _id nếu có, nếu không thì dùng id
      await addToCart(_id || id, token);
      alert("Đã thêm voucher vào giỏ hàng!");
    } catch (error) {
      alert(error.message || "Không thể thêm voucher vào giỏ hàng!");
    } finally {
      setIsProcessing(false);
    }
  };

  // Hàm xóa khỏi giỏ hàng
  const handleRemoveFromCart = async () => {
    const token = getToken();
    
    try {
      setIsProcessing(true);
      // Gọi API xóa voucher khỏi giỏ hàng
      const response = await authRequest({
        url: "/cart/remove",
        method: "POST",
        data: { 
          voucherId: _id || id 
        },
      });
      
      if (response.data.success) {
        alert("Đã xóa voucher khỏi giỏ hàng!");
        // Refresh trang sau khi xóa
        window.location.reload();
      } else {
        throw new Error(response.data.message || "Không thể xóa khỏi giỏ hàng!");
      }
    } catch (error) {
      alert(error.message || "Không thể xóa khỏi giỏ hàng!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`voucher-card`}>
      {/* Nút thêm/xóa khỏi giỏ hàng */}
      <button 
        className={`cart-action-btn ${isInCart ? 'remove-btn' : 'add-btn'}`}
        onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
        title={isInCart ? "Xóa khỏi giỏ hàng" : "Thêm vào giỏ hàng"}
        disabled={isProcessing}
      >
        {isProcessing ? "..." : isInCart ? "🗑️" : "🛒"}
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
        <p>
          <span style={{ fontSize: '90%' }}>ĐH tối thiểu: </span>{" "}
          <span className="min-order">
            {minSpend ? Number(minSpend).toLocaleString() + "đ" : "--"}
          </span>
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