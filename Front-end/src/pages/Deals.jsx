import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getVouchersByPlatform, getVoucherCountByPlatform } from '../services/voucherService';
import VoucherList from '../components/Voucherlist.jsx';

// Logo các sàn
import shopeeLogo from "../img/san/shopee.png";
import lazadaLogo from "../img/san/lazada.png";
import tikiLogo from "../img/san/tiki.png";
import sendoLogo from "../img/san/sendo.png";
import nguyenKimLogo from "../img/san/nguyenkim.png";
import dienMayXanhLogo from "../img/san/dienmayxanh.png";
import fahasaLogo from "../img/san/fahasa.png";
import shopeefoodLogo from "../img/san/shopeefood.png";
import Logo from "../assets/icon.png";

import "../styles/Deals.css"; // CSS riêng cho Deals

// Các bộ lọc theo từng sàn
const shopee = [
  { label: "Tất cả", icon: "📋" },
  { label: "Toàn Sàn", icon: "☑️" },
  { label: "Shopee Choice", icon: "🛍️" },
  { label: "Shop nổi bật", icon: "🌼" },
  { label: "Shopee Live", icon: "📺" },
  { label: "Voucher Xtra", icon: "🎟️" },
  { label: "Đời Sống", icon: "🏠" },
  { label: "Freeship", icon: "🚚" },
  { label: "Tiêu Dùng", icon: "🛒" },
  { label: "Shopee Video", icon: "🎥" },
  { label: "Chọn Lọc", icon: "🔍" },
  { label: "Quốc tế", icon: "🌐" },
  { label: "Shopee Mall", icon: "🛒" },
  { label: "Điện Tử", icon: "💻" },
  { label: "Thời Trang", icon: "👗" },
  { label: "Shop triển vọng", icon: "⭐" },
];

const lazada = [
  { label: "Tất cả", icon: "📋" },
  { label: "Toàn Sàn", icon: "☑️" },
  { label: "Sắc Đẹp", icon: "💄" },
  { label: "Đối Tác Thanh Toán", icon: "🤝" },
  { label: "LazChoice", icon: "🏷️" },
  { label: "Chọn Lọc", icon: "🔍" },
  { label: "Thời Trang", icon: "👗" },
  { label: "Gia Dụng", icon: "🏠" },
  { label: "Điện Tử", icon: "💻" },
  { label: "Bách Hóa Online", icon: "🛒" },
  { label: "Nhà Cửa Đời Sống", icon: "🏡" },
  { label: "Nhà Sách Online", icon: "📚" },
  { label: "Mẹ & Bé", icon: "🍼" },
  { label: "Dịch Vụ", icon: "💧" },
];

const platformList = [
  { name: 'Tất cả các sàn', logo: Logo, param: 'all' },
  { name: 'Shopee', logo: shopeeLogo, param: 'shopee' },
  { name: 'Lazada', logo: lazadaLogo, param: 'lazada' },
  { name: 'Tiki', logo: tikiLogo, param: 'tiki' },
  { name: 'Sendo', logo: sendoLogo, param: 'sendo' },
  { name: 'Shopee Food', logo: shopeefoodLogo, param: 'shopeefood' },
  { name: 'Nguyễn Kim', logo: nguyenKimLogo, param: 'nguyen-kim' },
  { name: 'Điện Máy Xanh', logo: dienMayXanhLogo, param: 'dien-may-xanh' },
  { name: 'Fahasa', logo: fahasaLogo, param: 'fahasa' },
];

const platformMap = {
  'all': 'Tất cả các sàn',
  'shopee': 'Shopee',
  'lazada': 'Lazada',
  'tiki': 'Tiki',
  'sendo': 'Sendo',
  'shopeefood': 'Shopee Food',
  'nguyen-kim': 'Nguyễn Kim',
  'dien-may-xanh': 'Điện Máy Xanh',
  'fahasa': 'Fahasa'
};

const getPlatformFromUrl = (param) => platformMap[param] || 'Tất cả các sàn';

const getUrlFromPlatform = (platform) => {
  const found = Object.entries(platformMap).find(([key, value]) => value === platform);
  return found ? found[0] : 'all';
};

const Deals = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState('Tất cả các sàn');
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [platformCounts, setPlatformCounts] = useState({});
  const filterContainerRef = useRef(null);

  // Fetch số lượng voucher từng sàn khi load trang
  useEffect(() => {
    const fetchCounts = async () => {
      const counts = {};
      for (const p of platformList) {
        try {
          const count = await getVoucherCountByPlatform(p.param);
          counts[p.param] = count;
        } catch {
          counts[p.param] = 0;
        }
      }
      setPlatformCounts(counts);
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    const platformParam = searchParams.get('platform') || 'all';
    setSelectedPlatform(getPlatformFromUrl(platformParam));
    setLoading(true);
    setError(null);
    getVouchersByPlatform(platformParam)
      .then(data => setFilteredVouchers(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handlePlatformClick = (platform) => {
    setSelectedPlatform(platform);
    const urlParam = getUrlFromPlatform(platform);
    navigate(`?platform=${urlParam}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollLeft = () => {
    filterContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    filterContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="deals-page">
      <div className="san-list-container">
        <h3 className="san-list-title">Lọc theo <span className="highlight">Sàn</span></h3>
        <ul className="san-list">
          {platformList.map((p, idx) => (
            <li key={idx} className="san-item">
              <button
                className={`san-button ${selectedPlatform === p.name ? 'active' : ''}`}
                onClick={() => handlePlatformClick(p.name)}
              >
                <img src={p.logo} alt={p.name} className="san-logo" />
                <span className="san-name">{p.name}</span>
                <span className="san-count">{platformCounts[p.param] ?? ''}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="main-deals-container">
        {(selectedPlatform === "Shopee" || selectedPlatform === "Lazada") && (
          <div className="san-filter-wrapper">
            <button className="scroll-btn left-btn" onClick={scrollLeft}>◀</button>
            <div className="san-filter-container" ref={filterContainerRef}>
              {(selectedPlatform === "Shopee" ? shopee : lazada).map((item, index) => (
                <div key={index} className="san-filter-item">
                  <span className="san-filter-icon">{item.icon}</span>
                  <span className="san-filter-label">{item.label}</span>
                </div>
              ))}
            </div>
            <button className="scroll-btn right-btn" onClick={scrollRight}>▶</button>
          </div>
        )}
        <h2 className="title-main-deals">
          Danh sách mã giảm giá <span className="highlight">{selectedPlatform}</span>
        </h2>
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <VoucherList vouchersData={filteredVouchers} />
        )}
      </div>
    </div>
  );
};

export default Deals;
