import React, { useEffect, useState } from "react";
import { authRequest } from "../services/authService";
import "../styles/Cart.css";
import VoucherCard from "../components/VoucherCard";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await authRequest({
          url: "/cart",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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
        {cartItems.map((item, idx) =>
          item.voucherId ? (
            <VoucherCard
              key={item.voucherId._id || idx}
              {...item.voucherId}
            />
          ) : (
            <div className="cart-item" key={item._id || idx}>
              <p>Voucher không hợp lệ hoặc đã bị xóa.</p>
            </div>
          )
        )}
      </div>
    </div>
  );  
}

export default Cart;
