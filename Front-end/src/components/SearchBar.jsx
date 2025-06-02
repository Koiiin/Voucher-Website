import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SearchBar.css";
import { addToCart } from "../services/voucherService"; 
// import { getToken } from "../services/authService";
import Toast from "./toast";

const API_URL = import.meta.env.VITE_APP_API_URL;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/vouchers/categories`);
        setCategories(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 2) {
      try {
        const res = await axios.get(`${API_URL}/vouchers/search`, {
          params: { q: value },
        });
        setSuggestions(res.data.slice(0, 5));
      } catch (error) {
        console.error("Lỗi gợi ý:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() && category === "all") return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/vouchers/search`, {
        params: { q: query, category },
      });
      setResults(res.data);
      setSuggestions([]);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (title) => {
    setQuery(title);
    setSuggestions([]);
  };

  // Hàm gọi service addToCart
  const handleAddToCart = async (voucherId) => {
  try {
    await addToCart(voucherId);
    showToast("Đã thêm vào giỏ hàng!", "success");
  } catch (error) {
    if (error.message.includes("401")) {
      showToast("Bạn cần đăng nhập để nhận voucher", "error");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } else {
      showToast("Thêm vào giỏ hàng thất bại!", "error");
    }
  }
};

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Tìm voucher..."
            value={query}
            onChange={handleInputChange}
            className="search-input"
          />
          {suggestions.length > 0 && (
            <ul className="autocomplete-dropdown">
              {suggestions.map((sugg) => (
                <li key={sugg._id} onClick={() => handleSuggestionClick(sugg.title)}>
                  {sugg.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="search-select"
        >
          <option value="all">Tất cả danh mục</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button type="submit" className="search-button">
          🔍 Tìm
        </button>
      </form>

      {loading && <p className="loading-text">Đang tìm kiếm...</p>}
      <div className="results-list">
        {results.map((voucher) => (
          <div key={voucher._id} className="result-item">
            <div className="voucher-section left-section">
              <h3 className="voucher-title">{voucher.title}</h3>
              <div className="expiry-time">
                ⏱ HSD:{" "}
                {voucher.validityEnd
                  ? new Date(voucher.validityEnd).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })
                  : "--/--"}
              </div>
            </div>
            <div className="divider">|</div>
            <div className="voucher-section middle-section">
              <p>
                <strong>Loại:</strong> {voucher.voucherType}
              </p>
              <p>
                <strong>Giá:</strong> {voucher.price}đ
              </p>
              <p>
                <strong>Số lượng:</strong> {voucher.quantity}
              </p>
              <p>
                <strong>Người tạo:</strong> {voucher.ownerUsername}
              </p>
            </div>
            <div className="divider">|</div>
            <div className="voucher-section right-section">
              <button
                className="get-button"
                onClick={() => handleAddToCart(voucher._id)}
              >
                Nhận voucher
              </button>
            </div>
          </div>
        ))}
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default SearchBar;
