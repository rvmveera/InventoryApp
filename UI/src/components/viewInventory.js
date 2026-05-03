import React, { useEffect, useState } from "react";
import "../css/viewInventory.css"; // optional CSS file
import noImage from "../images/noImage.jpg";

const ViewInventory = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Call your API using POST
    fetch("https://localhost:5001/api/Inventory/GetAvailableStock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({}) // send empty or required payload
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(error => console.error("Error fetching stock:", error));
  }, []);

  return (
    <div className="grid-container">
      {products.map((item, index) => (
        <div key={index} className="tile">
          {/* Dummy image */}
          <img
            src={noImage}
            className="tile-image"
          />
          {/* Details */}
          <div className="tile-details">
            <h3>Category :  {item.goodsType}</h3>
            <p>Product : {item.goods_ServiceDesc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewInventory;