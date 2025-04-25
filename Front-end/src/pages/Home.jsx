import React from "react";
import Banner from "../components/Banner";
import CategoryList from "../components/CategoryList";
import VoucherList from "../components/Voucherlist"; 
import "../styles/home.css";

function Home() {
  return (
    <div className="home-page">
      <Banner />

      <section className="category-section">
        <h2>Danh mục voucher</h2>
        <CategoryList />
      </section>

      <section className="featured-section">
        <h2>Voucher nổi bật</h2>
        <VoucherList /> {/* Dùng lại component này */}
      </section>

      <div className="user-joined">
        Người dùng mới tham gia: <strong>12345</strong>
      </div>
{/* 
      <div className="chatbot-widget">
        <ChatbotWidget />
      </div> */}
    </div>
  );
}

export default Home;
