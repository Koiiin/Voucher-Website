import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Uservoucher.css";

const UserCard = ({ voucher, onClick }) => {
  const navigate = useNavigate();

  const handleBuyClick = (e) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    navigate('/'); // Navigate to home page
  };

  return (
    <div className="user-card" onClick={onClick}>
      <div className="user-card-left">
        <h3>{voucher.title}</h3>
        <p>Loại: {voucher.voucherType}</p>
        {voucher.category && <p>Danh mục: {voucher.category}</p>}
        <p>Bắt đầu: {new Date(voucher.validityStart).toLocaleDateString()}</p>
        <p>HSD: {new Date(voucher.validityEnd).toLocaleDateString()}</p>
      </div>
      <div className="user-card-right">
        <p className="discount">Giảm {voucher.price} đ</p>
        <p>Đơn hàng tối thiểu: {voucher.minSpend}đ</p>
        <p>Số lượng: {voucher.quantity}</p>
        <div className="button-group">
          <button className="banner-button" onClick={handleBuyClick}>Buy</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;