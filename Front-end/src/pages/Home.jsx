
// src/pages/Home.jsx
import React from "react";
import Banner from "../components/Banner";
import CategoryList from "../components/CategoryList";
import VoucherCard from "../components/VoucherCard";

import "../styles/home.css"; // style chung cho trang Home

function Home() {
  const vouchers = [
    { id: 1, discount: "50%", title: "Voucher The Coffee House", expiry: "31/03/2025" },
    { id: 2, discount: "100K", title: "Voucher Shopee", expiry: "15/04/2025" },
    { id: 3, discount: "30%", title: "Voucher Traveloka", expiry: "31/03/2025" },
    { id: 4, discount: "70%", title: "Voucher Tiki", expiry: "20/05/2025" },
    { id: 5, discount: "200K", title: "Voucher GrabFood", expiry: "01/06/2025" },
    // ... thêm nếu muốn
  ];

  return (
    <div className="home-page">
      <Banner />

      <section className="category-section">
        <h2>Danh mục voucher</h2>
        <CategoryList />
      </section>

      <section className="featured-section">
        <h2>Voucher nổi bật</h2>
        <div className="voucher-list">
          {vouchers.map((item) => (
            <VoucherCard
              key={item.id}
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

