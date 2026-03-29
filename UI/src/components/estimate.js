import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../css/estimate.css";

function Estimate() {
  const [estimateFor, setEstimateFor] = useState("");
  const [estimateNumber, setEstimateNumber] = useState("");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState([
    { product: "", hsnNumber: "", quantity: "", unit: "", priceUnit: "", amount: "" }
  ]);

  // Fetch product options once
  const [productOptions, setProductOptions] = useState([]);
  useEffect(() => {
    fetch("https://localhost:5001/api/Inventory/GetAvailableStock", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({}) // send empty or filter payload
})
  .then(res => res.json())
  .then(data => {
    const mappedOptions = data.map(item => ({
      value: item.inventoryId,
      label: item.goods_ServiceDesc
    }));
    setProductOptions(mappedOptions);
  })
  .catch(err => console.error("Error fetching products:", err));
  }, []);

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;

    if (field === "quantity" || field === "priceUnit") {
      const qty = parseFloat(newDetails[index].quantity) || 0;
      const price = parseFloat(newDetails[index].priceUnit) || 0;
      newDetails[index].amount = (qty * price).toFixed(2);
    }

    setDetails(newDetails);
  };

  const addRow = () => {
    setDetails([
      ...details,
      { product: "", hsnNumber: "", quantity: "", unit: "", priceUnit: "", amount: "" }
    ]);
  };

  const removeRow = (index) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  return (
    <div className="estimate-container">
      <h2>Create Estimate</h2>

      <div className="form-group">
        <label>Estimate For:</label>
        <input
          type="text"
          value={estimateFor}
          onChange={(e) => setEstimateFor(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Estimate Number:</label>
        <input
          type="text"
          value={estimateNumber}
          onChange={(e) => setEstimateNumber(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <h3>Details</h3>
      <table className="details-grid">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Product</th>
            <th>HSN Number</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Price/Unit</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {details.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <Select
                  options={productOptions}
                  value={productOptions.find(opt => opt.value === row.product) || null}
                  onChange={(selected) =>
                    handleDetailChange(index, "product", selected ? selected.value : "")
                  }
                  placeholder="Select or type product..."
                  isClearable
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.hsnNumber}
                  onChange={(e) =>
                    handleDetailChange(index, "hsnNumber", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.quantity}
                  onChange={(e) =>
                    handleDetailChange(index, "quantity", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.unit}
                  onChange={(e) =>
                    handleDetailChange(index, "unit", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.priceUnit}
                  onChange={(e) =>
                    handleDetailChange(index, "priceUnit", e.target.value)
                  }
                />
              </td>
              <td>
                <input type="text" value={row.amount} readOnly />
              </td>
              <td>
                <button className="remove-btn" onClick={() => removeRow(index)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-btn" onClick={addRow}>+ Add Row</button>
    </div>
  );
}

export default Estimate;