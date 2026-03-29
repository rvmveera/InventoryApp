import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../css/invoice.css";

function Invoice() {
  const [invoiceFor, setinvoiceFor] = useState("");
  const [invoiceNumber, setinvoiceNumber] = useState("");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState([
    { product: "", hsnNumber: "", quantity: "", unit: "", priceUnit: "", gst: "", amount: "" }
  ]);

  // Fetch product options once
  const [productOptions, setProductOptions] = useState([]);
  useEffect(() => {
    fetch("https://localhost:5001/api/Inventory/GetAvailableStock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
      .then(res => res.json())
      .then(data => {
        const mappedOptions = data.map(item => ({
          value: item.inventoryId,
          label: item.goods_ServiceDesc,
          gstPercent: item.gstPercent
        }));
        setProductOptions(mappedOptions);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const handleDetailChange = (index, field, value, extra = {}) => {
    const newDetails = [...details];
    newDetails[index][field] = value;

    // If product is selected, set GST
    if (field === "product" && extra.gstPercent !== undefined) {
      newDetails[index].gst = extra.gstPercent;
    }

   // Recalculate amount when quantity, price, or GST changes
    const qty = parseFloat(newDetails[index].quantity) || 0;
    const price = parseFloat(newDetails[index].priceUnit) || 0;
    const gstPercent = parseFloat(newDetails[index].gst) || 0;

    if (qty > 0 && price > 0) {
      const baseAmount = qty * price;
      const gstAmount = (baseAmount * gstPercent) / 100;
      newDetails[index].amount = (baseAmount + gstAmount).toFixed(2);
    } else {
      newDetails[index].amount = "";
    }


    setDetails(newDetails);
  };

  const addRow = () => {
    setDetails([
      ...details,
      { product: "", hsnNumber: "", quantity: "", unit: "", priceUnit: "", gst: "", amount: "" }
    ]);
  };

  const removeRow = (index) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  return (
    <div className="invoice-container">
      <h2>Create Invoice</h2>

      <div className="form-group">
        <label>Invoice For:</label>
        <input
          type="text"
          value={invoiceFor}
          onChange={(e) => setinvoiceFor(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Invoice Number:</label>
        <input
          type="text"
          value={invoiceNumber}
          onChange={(e) => setinvoiceNumber(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Invoice Date:</label>
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
            <th>GST %</th>
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
                    handleDetailChange(
                      index,
                      "product",
                      selected ? selected.value : "",
                      { gstPercent: selected ? selected.gstPercent : "" }
                    )
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
                <input type="text" value={row.gst} readOnly />
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

export default Invoice;