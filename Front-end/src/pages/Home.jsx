import React from "react";
import Banner from "../components/Banner";
// import CategoryList from "../components/CategoryList";
import VoucherList from "../components/Voucherlist"; 
import SearchBar from "../components/SearchBar";
import "../styles/home.css";
import { Link } from "react-router-dom";


// anh
import freeshipImg from "../img/TH/Freeship.jpg";
import Laza from "../img/TH/laza.png";
import Noihinh from "../img/TH/noihinh.png";
import Shope from "../img/TH/shopee.png";
import Tramj from "../img/TH/Tramj.jpg";
import shopee1  from "../img/TH/shopee1.png";
function Home(props) {
  
  return (
    <div className="home-page">
      <Banner />
      <div className="carousel">
        <div className="carousel-images">
          <img src={freeshipImg} alt="Banner 1" />
          <img src={Laza} alt="Banner 1" />
          <img src={Noihinh} alt="Banner 3" />
          <img src={Shope} alt="Banner 3" />
          <img src={Tramj} alt="Banner 3" />
          <img src={shopee1} alt="Banner 3" />
          <img src={freeshipImg} alt="Banner 1" />
          <img src={Noihinh} alt="Banner 3" />
          <img src={Laza} alt="Banner 1" />
          <img src={Tramj} alt="Banner 3" />
         
        </div>
      </div>
      <div className="search-bar">
        <SearchBar />
      </div>

      {/* <section className="category-section">
        <h2>Danh mục voucher</h2>
        <CategoryList />
      </section> */}

      <section className="featured-section">
        <h2>Voucher nổi bật</h2>
        <VoucherList setToast={props.setToast} />
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