import React, { useEffect, useState } from "react";
import { authRequest } from "../services/authService";
import "../styles/Cart.css";
import VoucherList from "../components/Voucherlist";

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

  return (
    <div className="cart-page">
      <h2>Giỏ hàng của bạn</h2>
      <VoucherList vouchersData={cartItems} isCartDisplay={true} />
    </div>
  );  
}

export default Cart;
