import React, { useEffect, useState } from "react";

const VendorPayments = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [billDetails, setBillDetails] = useState([]);

  // Load vendors on mount
  useEffect(() => {
    fetch("https://localhost:5001/api/Vendors")
      .then((res) => res.json())
      .then((data) => setVendors(data))
      .catch((err) => console.error("Error fetching vendors:", err));
  }, []);

  // Load bill details when vendor changes
  useEffect(() => {
    if (!selectedVendor) return;

    fetch("https://localhost:5001/api/VendorPayment/billdetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendorId: parseInt(selectedVendor) })
    })
      .then((res) => res.json())
      .then((data) => setBillDetails(data))
      .catch((err) => console.error("Error fetching bill details:", err));
  }, [selectedVendor]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Payment to Vendors</h2>

      {/* Vendor dropdown */}
      <label>Select Vendor: </label>
      <select
        value={selectedVendor}
        onChange={(e) => setSelectedVendor(e.target.value)}
      >
        <option value="">-- Choose Vendor --</option>
        {vendors.map((vendor) => (
          <option key={vendor.vendorId} value={vendor.vendorId}>
            {vendor.vendorName}
          </option>
        ))}
      </select>

      {/* Bill details grid */}
      {selectedVendor && billDetails.length > 0 && (
        <table
          style={{
            marginTop: "20px",
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ccc",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Purchase ID</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Bill Amount</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Outstanding Amount</th>
            </tr>
          </thead>
          <tbody>
            {billDetails.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.purchaseId}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.billAmount}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.outstandingAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedVendor && billDetails.length === 0 && (
        <p style={{ marginTop: "20px" }}>No bill details found for this vendor.</p>
      )}
    </div>
  );
};

export default VendorPayments;