import React from "react";
import Banner from "../components/Banner";
import CategoryList from "../components/CategoryList";
import VoucherList from "../components/Voucherlist"; 
import SearchBar from "../components/SearchBar";
import "../styles/home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <Banner />

      <div className="search-bar">
        <SearchBar />
      </div>

      <section className="category-section">
        <h2>Danh mục voucher</h2>
        <CategoryList />
      </section>

      <section className="featured-section">
        <h2>Voucher nổi bật</h2>
        <VoucherList />
        <div style={{textAlign: "center", margin: "24px 0"}}>
          <Link to="/deals">
            <button className="load-more-btn">Xem thêm voucher</button>
          </Link>
        </div>
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
