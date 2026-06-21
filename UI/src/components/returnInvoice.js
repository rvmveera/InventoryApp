import React, { useState } from "react";
import "../css/returnInvoice.css";

function ReturnInvoice() {
  const [invoiceId, setInvoiceId] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setInvoiceData(null);

    try {
      const response = await fetch("https://localhost:5001/api/Sales/GetInvoiceDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceNumber: invoiceId })
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      setInvoiceData(data);
    } catch (err) {
      console.error("Search failed:", err);
      setError("❌ Could not fetch invoice. Please check the ID and try again.");
    }
  };
  const handleReturnInvoice = async () => {
    try {
      const response = await fetch("https://localhost:5001/api/Sales/ReturnInvoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceNumber: invoiceId })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      alert(result.message || `Invoice ${invoiceId} returned successfully.`);
      // 🔹 Clear fields after success
    setInvoiceId("");
    setInvoiceData(null);
    setError("");
    } catch (error) {
      console.error("Return failed:", error);
      alert("❌ Failed to return invoice. Please try again.");
    }
  };

  return (
    <div className="return-invoice-container">
      <div className="card">
        <h2 className="title">🔎 Return Invoice</h2>

        <div className="form-group">
          <label htmlFor="invoiceId">Invoice Number:</label>
          <input
            id="invoiceId"
            type="text"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
            placeholder="Enter invoice number..."
          />
          <button className="btn-primary" onClick={handleSearch}>
            Search
          </button>
          {invoiceData && (
     <button className="btn-secondary" onClick={handleReturnInvoice}>
              Return Invoice
            </button>
  )}
        </div>

        {error && <div className="alert error">{error}</div>}

        {invoiceData && (
          <div className="invoice-result">
            <h3>📄 Invoice Header</h3>
            <table className="styled-table">
              <tbody>
                <tr><td>Invoice Number</td><td>{invoiceData.header.invoiceNumber}</td></tr>
                <tr><td>Date</td><td>{invoiceData.header.invoiceDate}</td></tr>
                <tr><td>Buyer</td><td>{invoiceData.header.buyerName}</td></tr>
                <tr><td>Address</td><td>{invoiceData.header.buyerAddress}</td></tr>
                <tr><td>Total</td><td>₹ {invoiceData.header.invoiceTotal}</td></tr>
              </tbody>
            </table>

            <h3>📦 Invoice Details</h3>
            <div className="table-wrapper">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Product</th>
                    <th>HSN</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Price/Unit</th>
                    <th>GST (Rs.)</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.details.map((d, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{d.productName}</td>
                      <td>{d.hsn}</td>
                      <td>{d.quantity}</td>
                      <td>{d.unit}</td>
                      <td>{d.priceUnit}</td>
                      <td>{d.taxAmount}</td>
                      <td>{d.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReturnInvoice;
