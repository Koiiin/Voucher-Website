import React, { useState, useEffect } from "react";
import { getAllVouchers } from "../services/voucherService";
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
        const response = await getAllVouchers();
        // Kiểm tra cấu trúc dữ liệu trả về
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
  }, []);


  if (loading) {
    return <div className="loading">Đang tải voucher...</div>;
  }

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  if (!vouchers || vouchers.length === 0) {
    return <div className="no-vouchers">Không có voucher nào</div>;
  }
  const vouchersT_show = vouchers.slice(0, 15);

  return (
    <div className="voucher-list-container">
      <div className="voucher-list">
        {vouchersT_show.map((voucher) => {
          // Kiểm tra và đảm bảo dữ liệu voucher hợp lệ
          if (!voucher || !voucher.id) {
            console.warn("Invalid voucher data:", voucher);
            return null;
          }

          return (
            <VoucherCard
              key={voucher.id}
              id={voucher.id}
              title={voucher.title || ""}
              voucherType={voucher.voucherType || ""}
              voucherAmount={voucher.voucherAmount || ""}
              maxDiscount={voucher.maxDiscount || ""}
              minSpend={voucher.minSpend || 0}
              voucherCode={voucher.voucherCode || ""}
              startAt={voucher.startAt || ""}
              expiredAt={voucher.expiredAt || ""}
              affLink={voucher.affLink || ""}
              note={voucher.note || ""}
              totalClick={voucher.totalClick || 0}
              supplier={voucher.supplier || {}}
              voucherCategory={voucher.voucherCategory || {}}
            />
          );
        })}
      </div>
    </div>
  );
}

export default VoucherList;