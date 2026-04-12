import React, { useEffect, useState } from "react";

const ViewInventory = () => {
  const [inventories, setInventories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call your API
        const response = await fetch("https://localhost:5001/api/Inventory/export", {
          method: "POST", // since your export endpoint is POST
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Parse JSON response
        const data = await response.json();
        setInventories(data);
      } catch (error) {
        console.error("Error fetching inventory list:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Inventory List</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Goods Type</th>
            <th>Goods Service Desc</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {inventories.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.goodsType}</td>
              <td>{item.goodsServiceDesc}</td>
              <td>{item.price ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewInventory;