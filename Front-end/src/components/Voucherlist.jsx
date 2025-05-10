import React, { useState, useEffect } from "react";
import { getAllVouchers } from "../services/voucherService";
import VoucherCard from "./VoucherCard";
import "../styles/Voucherlist.css";

// Thêm prop vouchersData để có thể sử dụng lại component
function VoucherList({ vouchersData = null, isCartDisplay = false }) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Nếu có dữ liệu truyền vào, sử dụng luôn
    if (vouchersData) {
      setVouchers(vouchersData);
      setLoading(false);
      return;
    }

    // Nếu không có dữ liệu, fetch từ API
    const fetchVouchers = async () => {
      try {
        const response = await getAllVouchers();
        const data = response.data || response;
        console.log("Fetched vouchers:", data);
        
        if (Array.isArray(data)) {
          setVouchers(data);
        } else if (data.data && Array.isArray(data.data)) {
          setVouchers(data.data);
        } else {
          console.error("Invalid data structure:", data);
          setError("Dữ liệu không hợp lệ");
        }
      } catch (err) {
        console.error("Error fetching vouchers:", err);
        setError(err.message || "Không thể tải voucher");
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [vouchersData]);

  if (loading) {
    return <div className="loading">Đang tải voucher...</div>;
  }

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  if (!vouchers || vouchers.length === 0) {
    return <div className="no-vouchers">
      {isCartDisplay ? "Giỏ hàng của bạn đang trống." : "Không có voucher nào"}
    </div>;
  }

  // Chỉ giới hạn 15 voucher khi hiển thị danh sách thông thường, 
  // không giới hạn khi hiển thị giỏ hàng
  const vouchersToShow = isCartDisplay ? vouchers : vouchers.slice(0, 15);

  return (
    <div className="voucher-list-container">
      <div className={`voucher-list${vouchersToShow.length === 1 ? " single-voucher" : ""}`}>
        {vouchersToShow.map((voucher, idx) => {
          // Xử lý trường hợp voucher có thể khác nhau khi là từ giỏ hàng
          const voucherData = isCartDisplay && voucher.voucherId ? voucher.voucherId : voucher;
          
          // Kiểm tra dữ liệu hợp lệ
          if (!voucherData || (!voucherData.id && !voucherData._id)) {
            console.warn("Invalid voucher data:", voucherData);
            return (
              <div className="cart-item" key={idx}>
                <p>Voucher không hợp lệ hoặc đã bị xóa.</p>
              </div>
            );
          }

          return (
            <VoucherCard
              key={voucherData.id || voucherData._id || idx}
              id={voucherData.id}
              _id={voucherData._id}
              title={voucherData.title || ""}
              voucherType={voucherData.voucherType || ""}
              voucherAmount={voucherData.voucherAmount || ""}
              maxDiscount={voucherData.maxDiscount || ""}
              minSpend={voucherData.minSpend || 0}
              voucherCode={voucherData.voucherCode || ""}
              startAt={voucherData.startAt || ""}
              expiredAt={voucherData.expiredAt || ""}
              affLink={voucherData.affLink || ""}
              note={voucherData.note || ""}
              totalClick={voucherData.totalClick || 0}
              supplier={voucherData.supplier || {}}
              voucherCategory={voucherData.voucherCategory || {}}
              isInCart={isCartDisplay}
            />
          );
        })}
      </div>
    </div>
  );
}

export default VoucherList;