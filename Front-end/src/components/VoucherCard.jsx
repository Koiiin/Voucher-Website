import React from "react";
import { addToCart } from "../services/voucherService";
import { getToken } from "../services/authService"; 
import "../styles/Voucherlist.css";  // Đảm bảo rằng CSS đã được import

function VoucherCard({
  voucherId,
  title,
  voucherType,
  category,
  validityStart,
  validityEnd,
  price,
  quantity,
  linkanh,
}) {
  const handleGetNow = async () => {
    try {
      const token = getToken(); 
      if (!token) {
        alert("Bạn cần đăng nhập để thêm vào giỏ hàng.");
        return;
      }

      const response = await addToCart(voucherId, token);
      alert(response.message || "Đã thêm vào giỏ hàng!");
    } catch (error) {
      alert(error.message || "Lỗi khi thêm vào giỏ hàng.");
    }
  };

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
      <button className="get-now-button" onClick={handleGetNow}>
        Get Now
      </button>
    </div>
  );
}

export default VoucherCard;
