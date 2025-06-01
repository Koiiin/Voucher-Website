import React, { useEffect, useState } from "react";
import { authRequest } from "../services/authService";
import { getUserVouchers } from "../services/voucherService";
import "../styles/Cart.css";
import UserCard from "../components/Uservoucher";
import VoucherList from "../components/Voucherlist"; // Thêm import VoucherList
import { getUserVouchersByUsername } from "../services/voucherService"; // Import hàm lấy voucher sở hữu

function Cart(props) {
  const [cartItems, setCartItems] = useState([]);
  const [ownedVouchers, setOwnedVouchers] = useState([]); // Thêm state cho voucher sở hữu từ API
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
      }
    };

    const fetchOwnedVouchers = async () => {
      try {
        const response = await getUserVouchersByUsername();
        setOwnedVouchers(response.data || []);
      } catch (error) {
        console.error("Lỗi khi tải voucher sở hữu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
    fetchOwnedVouchers();
  }, []);

  if (loading) return <p>Đang tải giỏ hàng...</p>;

  // Phân loại voucher
  const savedFreeVouchers = cartItems.filter(v => !v.isFree);

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
          <div className="voucher-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}>
            {ownedVouchers.map((voucher) => (
              <UserCard 
                key={voucher._id || voucher.id}
                voucher={voucher}
              />
            ))}
          </div>
        ) : (
          <div>
            <VoucherList 
              vouchersData={savedFreeVouchers} 
              isCartDisplay={true} 
              setToast={props.setToast} 
            />
          </div>
        )}
      </div>
    </div>
  );  
}

export default Cart;
