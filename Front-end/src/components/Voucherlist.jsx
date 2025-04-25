import React, { useState, useEffect } from "react";
import { getAllVouchers } from "../services/voucherService";  // Import hàm gọi API từ service
import VoucherCard from "./VoucherCard";
import "../styles/Voucherlist.css";
import { addToCart } from "../services/voucherService";

function VoucherList() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await getAllVouchers();  // Lấy dữ liệu từ service
        setVouchers(data);  // Lưu dữ liệu vào state
      } catch (err) {
        setError(err.message);  // Lỗi từ service
      } finally {
        setLoading(false);  // Đặt loading là false khi hoàn tất
      }
    };

    fetchVouchers();  // Gọi hàm fetch
  }, []);

  useEffect(() => {
    console.log("Vouchers:", vouchers);
  }, [vouchers]);
  
  const handleGetNow = async (voucherId) => {
    try {
      const token = localStorage.getItem("token"); 
  
      if (!token) {
        alert("Bạn cần đăng nhập để thêm vào giỏ hàng.");
        return;
      }
  
      const response = await addToCart(voucherId, token);
      alert(response.message);  // Hiển thị thông báo từ server (thành công)
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi thêm vào giỏ hàng.");
    }
  };

  return (
    <div>
      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="voucher-list">
        {vouchers.map((voucher) => (
          <VoucherCard
          key={voucher._id}
          voucherId={voucher._id}
          title={voucher.title}
          voucherType={voucher.voucherType}
          category={voucher.category}
          validityStart={voucher.validityStart}
          validityEnd={voucher.validityEnd}
          price={voucher.price}
          quantity={voucher.quantity}
          linkanh={voucher.linkanh}
          onGetNow={handleGetNow}
        />        
        ))}
      </div>
    </div>
  );
}

export default VoucherList;