import React, { useEffect, useState } from "react";
import "../css/viewInventory.css"; // optional CSS file
import noImage from "../images/noImage.jpg";

const ViewInventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    // Call your API using POST
    fetch("https://localhost:5001/api/Inventory/GetAvailableStock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);

        // Extract unique categories and prepend "All"
        const uniqueCategories = [...new Set(data.map(p => p.goodsType.trim()))];
        setCategories(["All", ...uniqueCategories]);
      })
      .catch(error => console.error("Error fetching stock:", error));
  }, []);

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          p => p.goodsType.trim() === selectedCategory.trim()
        );

  return (
    <div>
      {/* Dropdown on top */}
      <select
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
        className="category-dropdown"
      >
        {categories.map((cat, idx) => (
          <option key={idx} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Product grid */}
      <div className="grid-container">
        {filteredProducts.map((item, index) => (
          <div key={index} className="tile">
            <img src={noImage} className="tile-image" alt={item.goods_ServiceDesc} />
            <div className="tile-details">
              <h3>Category: {item.goodsType}</h3>
              <p>Product: {item.goods_ServiceDesc}</p>
              <p>Count : {item.availableQty}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewInventory;
