import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Uservoucher.css";
import axios from "axios";

const UserCard = ({ voucher, onClick }) => {
  const navigate = useNavigate();

  const handleBuyClick = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/payment/momo", // Đổi lại đúng URL backend nếu cần
        {
          voucherData: voucher,
          // userInfo: user, // Nếu có thông tin user, truyền thêm vào đây
        }
      );
      const payUrl = response.data.payUrl;
      if (payUrl) {
        window.open(payUrl, '_blank');
      } else {
        alert("Không lấy được link thanh toán từ MoMo!");
      }
    } catch (error) {
      alert("Có lỗi khi tạo thanh toán: " + (error.response?.data?.error || error.message));
    }
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
        <p className="discount">Giảm <span className="discount-amount">{voucher.price}</span> đ</p>
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