import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../css/invoice.css";

function Invoice() {
  const [invoiceFor, setinvoiceFor] = useState("");
  const [buyerAddress, setbuyerAddress] = useState("");
  const [invoiceNumber, setinvoiceNumber] = useState("");

  const [date, setDate] = useState("");
  const [details, setDetails] = useState([
    { product: "", hsnNumber: "", quantity: "", unit: "", priceUnit: "", gst: "", amount: "", availableQty : "" }
  ]);

  // Fetch product options once
  const [productOptions, setProductOptions] = useState([]);
  // Fetch product options
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
      console.log("API data:", data); // check actual response
      const mappedOptions = data.map(item => ({
        value: item.inventoryId,          // numeric ID
        label: item.goods_ServiceDesc,    // product name
        gstPercent: item.gstPercent,
        availableQty: item.availableQty,
        hsnNumber : item.hsnSac
      }));
      setProductOptions(mappedOptions);
    })
    .catch(err => console.error("Error fetching products:", err));
}, []);


const handleDetailChange = (index, field, value) => {
  const newDetails = [...details];
  newDetails[index][field] = value;

  // If product is selected, set GST
  if (field === "product" && value) {
    newDetails[index].gst = value.gstPercent;
    newDetails[index].availableQty = value.availableQty;
    newDetails[index].hsnNumber = value.hsnNumber
  }

  // Recalculate amount
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


  const handleSubmit = async () => {
  const payload = buildInvoicePayload();
  console.log("Submitting invoice:", payload);

  try {
    const response = await fetch("https://localhost:5001/api/Sales/CreateInvoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    const invNo = result.invoiceNumber;
    alert(`Invoice created successfully, Invoice Number: ${invNo}`);

    // Now call the report API
    const reportResponse = await fetch("https://localhost:5001/api/Sales/GetInvoiceReport", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceNumber: invNo })
    });

    if (!reportResponse.ok) {
      throw new Error(`Report Error: ${reportResponse.status}`);
    }

    // If API returns a PDF blob
    const blob = await reportResponse.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank"); // opens the PDF in a new tab

  } catch (error) {
    console.error("Failed:", error);
    alert("Failed to create invoice or generate report. Please try again.");
  }
};


const buildInvoicePayload = () => {
  return {
    buyerName: invoiceFor,
    buyerAddress,
    invoiceNumber,
    invoiceDate: new Date(date).toISOString(),   // ensure ISO format
    consigneeId: 1,                              // set if you have consignee selection
    invoiceTotal: details.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0),
    details: details.map(d => ({
      inventoryId: d.product?.value || 0,        // dropdown holds full option object
      hsnNumber: d.hsnNumber,
      quantity: parseFloat(d.quantity) || 0,
      unit: d.unit,
      pricePerUnit: parseFloat(d.priceUnit) || 0,
      gst: parseFloat(d.gst) || 0,
      discount: 0,                               // add discount field if needed
      netAmount: parseFloat(d.amount) || 0
    }))
  };
};


  return (
    <div className="invoice-container">
      <h2>Create Invoice</h2>

      <div className="form-group">
        <label>Buyer:</label>
        <input
          type="text"
          value={invoiceFor}
          onChange={(e) => setinvoiceFor(e.target.value)}
        />
      </div>

<div className="form-group">
        <label>Buyer Address:</label>
    

        <textarea name="buyerAddress" value={buyerAddress}
                 onChange={(e) => setbuyerAddress(e.target.value)}></textarea>
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
            <th>Available Qty</th>
            <th>Required Qty</th>
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
  value={row.product}   // now row.product is the full option object
  onChange={(selected) =>
    handleDetailChange(index, "product", selected)
  }
  placeholder="Select or type product..."
  isClearable
  classNamePrefix="react-select"  menuPortalTarget={document.body}
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
  <span className="available-qty-label">
    {row.availableQty}
  </span>
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

      <div className="submit-container">
  <button className="submit-btn" onClick={handleSubmit}>
    Submit Invoice
  </button>
</div>



    </div>
  );
}

export default Invoice;