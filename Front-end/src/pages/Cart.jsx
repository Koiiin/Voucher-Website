import React, { useEffect, useState } from "react";
import { authRequest } from "../services/authService";
import "../styles/Cart.css";
import VoucherList from "../components/Voucherlist";

function Cart(props) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('owned'); // Add state for active tab

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

  // Phân loại voucher
  const ownedVouchers = cartItems.filter(v => !v.isFree);
  const savedFreeVouchers = cartItems.filter(v => v.isFree);

  return (
    <div className="cart-page">
      <h2>Giỏ hàng của tôi</h2>
      
      <div className="cart-tabs" style={{ margin: '20px 0' }}>
        <button 
          onClick={() => setActiveTab('owned')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: activeTab === 'owned' ? '#4CAF50' : '#f1f1f1',
            border: 'none',
            borderRadius: '4px',
            color: activeTab === 'owned' ? 'white' : 'black',
            cursor: 'pointer'
          }}
        >
          Voucher sở hữu
        </button>
        <button 
          onClick={() => setActiveTab('free')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'free' ? '#4CAF50' : '#f1f1f1',
            border: 'none',
            borderRadius: '4px',
            color: activeTab === 'free' ? 'white' : 'black',
            cursor: 'pointer'
          }}
        >
          Voucher miễn phí đã lưu
        </button>
      </div>

      <div className="cart-content">
        {activeTab === 'owned' ? (
          <div>
            <VoucherList vouchersData={savedFreeVouchers} isCartDisplay={true} setToast={props.setToast} />
          </div>
        ) : (
          <div>
            <VoucherList vouchersData={ownedVouchers} isCartDisplay={true} setToast={props.setToast} />
          </div>
        )}
      </div>
    </div>
  );  
}

export default Cart;
