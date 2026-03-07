import React, { useState } from "react";

const GoodsGST = () => {
  const [formData, setFormData] = useState({
    goodsType: "",
    GSTpercent: "",
   
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:5001/api/GoodsType/addGoodsGST", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          goodsType: formData.goodsType,
          gsTpercent: Number(formData.GSTpercent)
        })
      });

      if (response.ok) {
        const result = await response.text();
        alert("Saved successfully: " + result);
        setFormData({ goodsType: "", GSTpercent: ""});
      } else {
        alert("Failed to save record");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error occurred while saving");
    }
  };

  return (
    <div>
      <h2>Add Goods GST</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Goods Type:</label>
          <input
            type="text"
            name="goodsType"
            value={formData.goodsType}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>GST (%):</label>
          <input
            type="number"
            name="GSTpercent"
            value={formData.GSTpercent}
            onChange={handleChange}
            required
          />
        </div>

        

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default GoodsGST;