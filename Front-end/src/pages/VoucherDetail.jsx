
import React from "react";

function VoucherDetail() {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Voucher Detail</h1>
        <p>Đây là trang hiển thị chi tiết voucher. Bạn có thể gọi API để lấy dữ liệu voucher.</p>
        {/* 
          Ví dụ:
          useEffect(() => {
            // Gọi API getVoucherById(id) và set state
          }, []);
        */}
      </div>
    );
  }
  
  export default VoucherDetail;

  