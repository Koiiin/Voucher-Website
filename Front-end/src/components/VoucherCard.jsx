import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../services/voucherService";
import { getToken, authRequest } from "../services/authService";
import "../styles/VoucherCard.css"; // CSS riêng cho VoucherCard

import shopeeLogo from "../img/san/shopee.png";
import lazadaLogo from "../img/san/lazada.png";
import tikiLogo from "../img/san/tiki.png";
import sendoLogo from "../img/san/sendo.png";
import nguyenKimLogo from "../img/san/nguyenkim.png";
import dienMayXanhLogo from "../img/san/dienmayxanh.png";
import fahasaLogo from "../img/san/fahasa.png";
import shopeefoodLogo from "../img/san/shopeefood.png";

const getPlatformLogo = (slug) => {
  switch (slug?.toLowerCase()) {
    case 'shopee':
      return shopeeLogo;
    case 'lazada':
      return lazadaLogo;
    case 'tiki':
      return tikiLogo;
    case 'sendo':
      return sendoLogo;
    case 'nguyen-kim':
      return nguyenKimLogo;
    case 'dien-may-xanh':
      return dienMayXanhLogo;
    case 'fahasa':
      return fahasaLogo;
    case 'shopeefood':
      return shopeefoodLogo;
  }
};

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
  usageTerms,
  totalClick,
  supplier,
  voucherCategory,
  isInCart = false, // prop này để biết nếu hiển thị trong giỏ hàng
  setToast // nhận props setToast từ cha
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [cardPos, setCardPos] = useState({ top: 0, left: 0, width: 0 });
  const navigate = useNavigate();
  
  // Cắt note nếu quá dài
  const maxNoteLength = 48;

  if(note === null || note === "") {
    note = (
      <>
        ...
        <span className="see-more"> Xem chi tiết</span>
      </>
    );
  }
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
      setToast({ message: "Vui lòng đăng nhập để thêm voucher vào giỏ hàng!", type: "error" });
      navigate("/login");
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Fetch giỏ hàng để kiểm tra voucher đã có chưa
      const cartRes = await authRequest({ url: "/cart", method: "GET" });
      const cartItems = cartRes.data.cart?.vouchers || [];
      const cartVoucherIds = cartItems
        .map(item => item.voucherId?._id || item.voucherId?.id)
        .filter(Boolean);

      if (cartVoucherIds.includes(_id || id)) {
        setToast({ message: "Voucher này đã có trong giỏ hàng!", type: "info" });
        return;
      }

      // 2. Nếu chưa có thì mới thêm vào giỏ hàng
      await addToCart(_id || id, token);
      setToast({ message: "Đã thêm voucher vào giỏ hàng!", type: "success" });
    } catch (error) {
      setToast({ message: error.message || "Không thể thêm voucher vào giỏ hàng!", type: "error" });
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
        setToast({ message: "Đã xóa voucher khỏi giỏ hàng!", type: "error" });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setToast({ message: response.data.message || "Không thể xóa khỏi giỏ hàng!", type: "error" });
      }
    } catch (error) {
      setToast({ message: error.message || "Không thể xóa khỏi giỏ hàng!", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardClick = (e) => {
    if (!isExpanded) {
      const rect = e.currentTarget.getBoundingClientRect();
      setCardPos({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={`voucher-card ${isExpanded ? 'expanded' : ''}`} onClick={handleCardClick} style={{ cursor: "pointer" }}> 
      <div className="voucher-left">
        <div className="logo-supplier">
          <img
            className="supplier-logo"
            src={getPlatformLogo(supplier?.slug)}
            alt={"Shop Logo"}
          />
        </div>
        <div className="applicable-to">{voucherCategory?.title}</div>
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
      {/* Chỉ hiển thị khi chưa expanded */}
      {!isExpanded && (
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
              {minSpend ? Number(minSpend).toLocaleString() + "đ" : "0đ"}
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
      )}
      {/* Hiển thị khi expanded */}
      {isExpanded && (
        <div className="voucher-right voucher-detail">
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
              {minSpend ? Number(minSpend).toLocaleString() + "đ" : "0đ"}
            </span>
          </p>
          <p>
            <span style={{ fontSize: '90%' }}>Ngành hàng:</span> <span style={{ fontWeight: 'bold' }}>{voucherCategory?.title}</span>
          </p>
          {usageTerms && (
            <p>
              <span style={{ fontSize: '90%' }}>Điều kiện sử dụng:</span> <span style={{ fontWeight: 'bold' }}>{usageTerms}</span>
            </p>
          )}
          <p className="note">
            <span className="note-label">Lưu ý:</span> {note}
          </p>
          <div className="voucher-footer">
            <span className="apply-list">#Lưu trên banner</span>
            <a href={affLink || "#"} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              <button className="copy-code">Đến Banner</button>
            </a>
          </div>
        </div>
      )}
      {/* Nút thêm/xóa khỏi giỏ hàng */}
      <button 
        className={`cart-action-btn ${isInCart ? 'remove-btn' : 'add-btn'}`}
        onClick={(e) => {
          e.stopPropagation(); // chặn lan sự kiện
          isInCart ? handleRemoveFromCart() : handleAddToCart();
        }}
        title={isInCart ? "Xóa khỏi giỏ hàng" : "Thêm vào giỏ hàng"}
        disabled={isProcessing}
        
      >
        {isProcessing ? "..." : isInCart ? "🗑️" : "🛒"}
      </button>
    </div>
  );
};

export default VoucherCard;