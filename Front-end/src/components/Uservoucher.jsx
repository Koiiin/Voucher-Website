import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Uservoucher.css";
import axios from "axios";

const UserCard = ({ voucher, onClick }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const ownerUsername = voucher.ownerUsername;

  const handleBuyClick = async (e) => {
    e.stopPropagation();
    setIsProcessing(true);
    
    try {
      // Kiểm tra đăng nhập
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        alert("Vui lòng đăng nhập để mua voucher!");
        navigate('/login');
        return;
      }

      // Decode token để lấy userId
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id;

      const response = await axios.post(
        "http://localhost:3000/api/payment/momo",
        {
          voucherData: {
            _id: voucher._id,
            title: voucher.title,
            price: voucher.price,
            quantity: voucher.quantity,
            ownerId: voucher.ownerId
          },
          userInfo: {
            userId: userId // Sử dụng userId từ decoded token
          }
        }
      );
      
      if (response.data.payUrl) {
        localStorage.setItem('lastOrderId', response.data.orderId);
        const paymentWindow = window.open(response.data.payUrl, '_blank');
        
        // Check if window was closed
        const checkWindowClosed = setInterval(() => {
          if (paymentWindow.closed) {
            clearInterval(checkWindowClosed);
            clearInterval(checkPaymentStatus);
            // Navigate to payment status page when window closed
            navigate(`/payment/canceled?orderId=${response.data.orderId}`);
          }
        }, 1000);

        // Check payment status
        let checkCount = 0; 
        const checkInterval = 3000; // 3 giây check 1 lần
        const maxMinutes = 10; // Tối đa 10 phút
        const maxChecks = (maxMinutes * 60 * 1000) / checkInterval; // Số lần check trong 10 phút
        
        const checkPaymentStatus = setInterval(async () => {
          try {
            if (checkCount >= maxChecks) {
              clearInterval(checkPaymentStatus);
              clearInterval(checkWindowClosed);
              navigate(`/payment/timeout?orderId=${response.data.orderId}`);
              return;
            }
            
            checkCount++;
            const statusRes = await axios.get(
              `https://voucher-website-ba.onrender.com/api/payment/status/${response.data.orderId}`
            );
            
            if (statusRes.data.status !== 'pending') {
              clearInterval(checkPaymentStatus);
              clearInterval(checkWindowClosed);
              navigate(`/payment/${statusRes.data.status}?orderId=${response.data.orderId}`);
            }
          } catch (error) {
            console.error("Error checking payment status:", error);
          }
        }, 3000);
      } else {
        alert("Không lấy được link thanh toán!");
      }
    } catch (error) {
      alert("Có lỗi khi tạo thanh toán: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="user-card" onClick={onClick}>
      <div className="user-card-left">
        <h3>{voucher.title}</h3>
        {/* Hiển thị username chủ tạo voucher nếu có */}
        <p>Người tạo: {ownerUsername}</p>
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
          <button 
            className="banner-button" 
            onClick={handleBuyClick}
            disabled={isProcessing || voucher.quantity <= 0}
          >
            {isProcessing ? "Đang xử lý..." : "Buy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;