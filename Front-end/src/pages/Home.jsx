import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import CategoryList from "../components/CategoryList";
import VoucherCard from "../components/VoucherCard";
import { getAllVouchers } from "../services/voucherService"; // Import service gọi API

import "../styles/home.css"; // style chung cho trang Home

function Home() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await getAllVouchers();  // Gọi service lấy voucher
        setVouchers(data);  // Lưu voucher vào state
      } catch (err) {
        setError(err.message);  // Lỗi nếu có
      } finally {
        setLoading(false);  // Khi hoàn thành thì đổi loading thành false
      }
    };

    //fetchVouchers(); // Gọi hàm fetchVouchers khi component mount
  }, []);

  return (
    <div className="home-page">
      <Banner />

      <section className="category-section">
        <h2>Danh mục voucher</h2>
        <CategoryList />
      </section>

      <section className="featured-section">
        <h2>Voucher nổi bật</h2>
        {loading && <p>Đang tải...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="voucher-list">
          {vouchers.map((item) => (
            <VoucherCard
              key={item._id}  // Dùng _id nếu là dữ liệu từ DB
              discount={item.discount}
              title={item.title}
              expiry={item.expiry}
            />
          ))}
        </div>
      </section>

      <div className="user-joined">
        Người dùng mới tham gia: <strong>12345</strong>
      </div>
    </div>
  );
}

export default Home;
