import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../css/estimate.css";

function Estimate() {
  const initialDetails = [
    { product: "", hsnNumber: "", quantity: "", unit: "", priceUnit: "", amount: "" }
  ];

  const [estimateFor, setEstimateFor] = useState("");
  const [estimateNumber, setEstimateNumber] = useState(""); // will be set after API call
  const [date, setDate] = useState("");
  const [details, setDetails] = useState(initialDetails);
  const [showPrintButton, setShowPrintButton] = useState(false);

  // Fetch product options once
  const [productOptions, setProductOptions] = useState([]);
  useEffect(() => {
    fetch("https://localhost:5001/api/Inventory/GetAvailableStock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    })
      .then(res => res.json())
      .then(data => {
        const mappedOptions = data.map(item => ({
          value: item.inventoryId,
          label: item.goods_ServiceDesc,
          hsnSac : item.hsnSac
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
    else if(field == "product") {
    const selectedProduct = productOptions.find(p => p.value === value);
    if (selectedProduct) {
      newDetails[index].hsnNumber = selectedProduct.hsnSac; 
      }
    }
    setDetails(newDetails);
  };

  const addRow = () => {
    setDetails([...details, { product: "", hsnNumber: "", quantity: "", unit: "", priceUnit: "", amount: "" }]);
  };

  const removeRow = (index) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  const resetForm = () => {
    setEstimateFor("");
    setEstimateNumber("");
    setDate("");
    setDetails(initialDetails);
    setShowPrintButton(false);
  };

  const createEstimate = async () => {
    try {
      const payload = {
        estimateFor,
        estimateDate: date,
        estimateNumber: "", // backend auto-generates
        estimateDetails: details.map(d => ({
          inventoryId: d.product,
          hsnNumber: d.hsnNumber,
          quantity: parseInt(d.quantity) || 0,
          uom: d.unit,
          pricePerUnit: parseFloat(d.priceUnit) || 0,
          amount: parseFloat(d.amount) || 0
        }))
      };

      const response = await fetch("https://localhost:5001/api/Sales/CreateEstimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed to create estimate");

      const result = await response.json();

      // 🔹 Show popup with estimate number
      alert(`Estimate created successfully! Number: ${result.estimateNumber}`);

      // 🔹 Save estimate number in state
      setEstimateNumber(result.estimateNumber);
      setShowPrintButton(true);
    } catch (error) {
      console.error("Error creating estimate:", error);
      alert("Error creating estimate. Please try again.");
    }
  };

  const printEstimate = async () => {
    try {
      const reportResponse = await fetch("https://localhost:5001/api/Sales/GetEstimationReport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estimateNumber })
      });

      if (!reportResponse.ok) throw new Error("Failed to generate report");

      const blob = await reportResponse.blob();
      const url = window.URL.createObjectURL(blob);

      // 🔹 Open PDF in new tab for printing
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error printing estimate:", error);
      alert("Error printing estimate. Please try again.");
    }
  };

  return (
    <div className="estimate-container">
      <h2>Create Estimate</h2>

      {/* Inline form row */}
      <div className="form-row">
        <div className="form-group-inline">
          <label>Estimate For:</label>
          <input type="text" value={estimateFor} onChange={(e) => setEstimateFor(e.target.value)} />
        </div>

        <div className="form-group-inline">
          <label>Estimate Number:</label>
          <input type="text" value={estimateNumber} readOnly />
        </div>

        <div className="form-group-inline">
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      <h3>Details</h3>
      <div className="table-scroll">
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
                    onChange={(selected) => handleDetailChange(index, "product", selected ? selected.value : "")}
                    placeholder="Select or type product..."
                    isClearable menuPortalTarget={document.body}
                  />
                </td>
                <td>
                  <input type="text" value={row.hsnNumber} readOnly onChange={(e) => handleDetailChange(index, "hsnNumber", e.target.value)} />
                </td>
                <td>
                  <input type="number" value={row.quantity} onChange={(e) => handleDetailChange(index, "quantity", e.target.value)} />
                </td>
                <td>
                  <input type="text" value={row.unit} onChange={(e) => handleDetailChange(index, "unit", e.target.value)} />
                </td>
                <td>
                  <input type="number" value={row.priceUnit} onChange={(e) => handleDetailChange(index, "priceUnit", e.target.value)} />
                </td>
                <td>
                  <input type="text" value={row.amount} readOnly />
                </td>
                <td>
                  <button className="remove-btn" onClick={() => removeRow(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="add-btn" onClick={addRow}>+ Add Row</button>

      {/* Action buttons */}
      <div className="action-buttons">
        <button className="create-btn" onClick={createEstimate}>Create Estimate</button>
        <button className="cancel-btn" onClick={resetForm}>Cancel</button>
        {showPrintButton && (
          <button className="print-btn" onClick={printEstimate}>Print Estimate</button>
        )}
      </div>
    </div>
  );
}

export default Estimate;
