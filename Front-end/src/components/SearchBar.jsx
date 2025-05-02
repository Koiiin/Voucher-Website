import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SearchBar.css";

const API_URL = import.meta.env.VITE_APP_API_URL;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Load categories từ API
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

  // Load suggestions (autocomplete)
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 2) {
      try {
        const res = await axios.get(`${API_URL}/vouchers/search`, {
          params: { q: value }
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
        params: { q: query, category }
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

        <button type="submit" className="search-button">🔍 Tìm</button>
      </form>

      {loading && <p className="loading-text">Đang tìm kiếm...</p>}

      <div className="results-list">
        {results.map((voucher) => (
          <div key={voucher._id} className="result-item">
            <img src={voucher.linkanh} alt={voucher.title} className="result-image" />
            <div>
              <h3>{voucher.title}</h3>
              <p>Loại: {voucher.voucherType}</p>
              <p>Giá: {voucher.price}đ</p>
              <p>Danh mục: {voucher.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
