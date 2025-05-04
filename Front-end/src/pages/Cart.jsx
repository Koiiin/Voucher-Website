import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../services/authService";
import "../styles/Cart.css";

const API_URL = import.meta.env.VITE_APP_API_URL;

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = getToken();
        if (!token) {
          alert("Bạn cần đăng nhập để xem giỏ hàng.");
          return;
        }

        const response = await axios.get(`${API_URL}/cart`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setCartItems(response.data.cart.vouchers || []); // Cập nhật dữ liệu đúng
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
        alert("Không thể tải giỏ hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) return <p>Đang tải giỏ hàng...</p>;
  if (cartItems.length === 0) return <p>Giỏ hàng của bạn đang trống.</p>;

  return (
    <div className="cart-page">
      <h2>Giỏ hàng của bạn</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          // Kiểm tra nếu voucherId là hợp lệ trước khi render
          item.voucherId ? (
            <div className="cart-item" key={item.voucherId._id}> 
              <img
                src={item.voucherId.imageUrl || "/default-image.jpg"} // Đảm bảo có ảnh hoặc thay thế ảnh mặc định
                alt={item.voucherId.title}
                className="cart-image"
              />
              <div className="cart-info">
                <h3>{item.voucherId.title}</h3>
                <p>Giá: {item.voucherId.price} VND</p>
                <p>Loại: {item.voucherId.voucherType}</p>
                <p>Danh mục: {item.voucherId.category}</p>
                <p>
                  HSD: {new Date(item.voucherId.validityEnd).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            // Nếu voucherId không hợp lệ, thông báo lỗi
            <div className="cart-item" key={item._id}>
              <p>Voucher không hợp lệ hoặc đã bị xóa.</p>
            </div>
          )
        ))}
      </div>
    </div>
  );  
}

export default Cart;
