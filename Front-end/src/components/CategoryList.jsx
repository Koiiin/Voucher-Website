<<<<<<< HEAD
// src/components/CategoryList.jsx
import React from "react";
import "../styles/CategoryList.css";

const categories = [
  { id: 1, name: "Ăn uống", icon: "🍔" },
  { id: 2, name: "Mua sắm", icon: "🛍️" },
  { id: 3, name: "Du lịch", icon: "✈️" },
  { id: 4, name: "Nạp ĐT", icon: "📱" },
  { id: 5, name: "Giải trí", icon: "🎮" },
  { id: 6, name: "Spa", icon: "💆" },
];

function CategoryList() {
  return (
    <div className="category-list">
      {categories.map((cat) => (
        <div key={cat.id} className="category-item">
          <div className="category-icon">{cat.icon}</div>
          <div className="category-name">{cat.name}</div>
        </div>
      ))}
    </div>
  );
}

export default CategoryList;
=======
// src/components/CategoryList.jsx
import React from "react";
import "../styles/CategoryList.css";

const categories = [
  { id: 1, name: "Ăn uống", icon: "🍔" },
  { id: 2, name: "Mua sắm", icon: "🛍️" },
  { id: 3, name: "Du lịch", icon: "✈️" },
  { id: 4, name: "Nạp ĐT", icon: "📱" },
  { id: 5, name: "Giải trí", icon: "🎮" },
  { id: 6, name: "Spa", icon: "💆" },
];

function CategoryList() {
  return (
    <div className="category-list">
      {categories.map((cat) => (
        <div key={cat.id} className="category-item">
          <div className="category-icon">{cat.icon}</div>
          <div className="category-name">{cat.name}</div>
        </div>
      ))}
    </div>
  );
}

export default CategoryList;
>>>>>>> 14fd7dee0989f6389f8eb859f968216a0fcec654
