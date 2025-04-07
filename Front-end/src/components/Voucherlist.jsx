import React, { useState, useEffect } from "react";
import { getAllVouchers } from "../services/voucherService";  // Import hàm gọi API từ service
import VoucherCard from "./VoucherCard";
import "../styles/VoucherList.css";

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

  return (
    <div>
      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="voucher-list">
        {vouchers.map((voucher) => (
          <VoucherCard
            key={voucher._id}
            discount={voucher.discount}
            title={voucher.title}
            expiry={voucher.expiry}
          />
        ))}
      </div>
    </div>
  );
}

export default VoucherList;