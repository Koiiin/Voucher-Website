import React, { useEffect } from 'react';
import voucherData from '../assets/vouchers.json'; // Import dữ liệu voucher từ file JSON

const Deals = () => {
  console.log("Deals component is rendering"); // Kiểm tra xem component có được render không

  useEffect(() => {
    // Tạo và nhúng styles vào head
    const style = document.createElement('style');
    style.innerHTML = styles;
    document.head.appendChild(style);

    // Cleanup khi component unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="voucher-list-container">
      {voucherData.map((voucher) => {
        const formattedDate = new Date(voucher.expiredAt).toLocaleDateString(); // Chuyển đổi ngày một lần
        const formattedMaxDiscount = voucher.maxDiscount.toLocaleString(); // Định dạng số giảm giá
        const formattedMinSpend = voucher.minSpend.toLocaleString(); // Định dạng số đơn hàng tối thiểu

        return (
          <div className="voucher-card" key={voucher.id}>
            <h2 className="voucher-title">{voucher.title}</h2>
            <div className="voucher-header">
              <img src={voucher.avatar} alt="Voucher Avatar" className="voucher-avatar" />
              <div className="voucher-info">
                <h3>Mã giảm giá: {voucher.voucherCode}</h3>
                <p>{voucher.longDescription}</p>
                <p><strong>Giảm tối đa:</strong> {formattedMaxDiscount}₫</p>
                <p><strong>Điều kiện sử dụng:</strong> Đơn hàng tối thiểu {formattedMinSpend}₫</p>
                <p><strong>Ngày hết hạn:</strong> {formattedDate}</p>
                <p><strong>Đã sử dụng:</strong> {voucher.percentageUsed}%</p>
              </div>
            </div>

            <div className="voucher-links">
              <a href={voucher.detailLink} target="_blank" rel="noopener noreferrer">Chi tiết voucher</a>
              <a href={voucher.useLink} target="_blank" rel="noopener noreferrer">Sử dụng voucher</a>
              <a href={voucher.listApplyLink} target="_blank" rel="noopener noreferrer">Xem các sản phẩm áp dụng</a>
            </div>

            <div className="voucher-footer">
              <p><strong>Nhà cung cấp:</strong> {voucher.supplier?.name || 'N/A'}</p>
              <p><strong>Danh mục:</strong> {voucher.voucherCategory?.title || 'Không có danh mục'}</p>
              <p><strong>Loại voucher:</strong> {voucher.voucherType === 'percent' ? 'Giảm theo phần trăm' : 'Giảm giá cố định'}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Deals;

const styles = `
  .voucher-list-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
    margin: 20px;
  }

  .voucher-card {
    width: 300px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .voucher-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  .voucher-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .voucher-header {
    display: flex;
    gap: 15px;
  }

  .voucher-avatar {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
  }

  .voucher-info {
    flex: 1;
  }

  .voucher-links a {
    display: block;
    margin-top: 10px;
    color: #007bff;
    text-decoration: none;
    font-size: 14px;
  }

  .voucher-links a:hover {
    text-decoration: underline;
  }

  .voucher-footer {
    margin-top: 15px;
    font-size: 14px;
    color: #555;
  }

  .voucher-footer p {
    margin: 5px 0;
  }

  .voucher-footer strong {
    font-weight: bold;
  }
`;
