import React, { useEffect, useState } from "react";
import PurchaseDetails from "./purchasedetails"; // import your separate file

const VendorPayments = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [billDetails, setBillDetails] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
const [paymentDate, setPaymentDate] = useState("");
const [comments, setComments] = useState("");
// State for payment history
const [paymentHistory, setPaymentHistory] = useState([]);
const [showHistoryFor, setShowHistoryFor] = useState(null);
const [purchaseDetails, setPurchaseDetails] = useState(null);

const API_BASE_URL = process.env.REACT_APP_API_URL;

const fetchPurchaseDetails = (purchaseId) => {
  fetch(`${API_BASE_URL}/VendorPayment/purchasedetails`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ purchaseId }),
  })
    .then((res) => res.json())
    .then((data) => setPurchaseDetails(data))   // <-- sets state
    .catch((err) => console.error("Error fetching purchase details:", err));
};


// Function to fetch history
const fetchPaymentHistory = (vendorPaymentId) => {
  fetch(`${API_BASE_URL}/VendorPayment/paymenthistory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vendorPaymentId }),
  })
    .then((res) => res.json())
    .then((data) => {
      setPaymentHistory(data);
      setShowHistoryFor(vendorPaymentId);
    })
    .catch((err) => console.error("Error fetching payment history:", err));
};


  // Load vendors on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/Vendors`)
      .then((res) => res.json())
      .then((data) => setVendors(data))
      .catch((err) => console.error("Error fetching vendors:", err));
  }, []);

// Load bill details when vendor changes
 
const fetchBillDetails = (vendorId) => {
  fetch(`${API_BASE_URL}/VendorPayment/billdetails`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vendorId: parseInt(vendorId) }),
  })
    .then((res) => res.json())
    .then((data) => setBillDetails(data))
    .catch((err) => console.error("Error fetching bill details:", err));
};

// useEffect calls it when vendor changes
useEffect(() => {
  if (!selectedVendor) return;
  setBillDetails([]);
  setSelectedPayment(null);
  fetchBillDetails(selectedVendor);
}, [selectedVendor]);

// handlePaymentSubmit calls it after success
const handlePaymentSubmit = () => {
  if (!selectedPayment || !paymentAmount) return;

  fetch(`${API_BASE_URL}/VendorPayment/makepayment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      purchaseId: selectedPayment.purchaseId,
      paymentAmount: parseFloat(paymentAmount),
      vendorPaymentId: selectedPayment.id,
      paymentDate: paymentDate,
      comments: comments
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Payment recorded successfully");
      setSelectedPayment(null);
      setPaymentAmount("");

      // refresh bill details explicitly
      fetchBillDetails(selectedVendor);
    })
    .catch((err) => console.error("Error making payment:", err));
};

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

      {/* Two-column layout */}
      {selectedVendor && billDetails.length > 0 && (
        <table style={{ width: "100%", marginTop: "20px" }}>
          <tbody>
            <tr>
              {/* Left column: bill details grid */}
              <td style={{ verticalAlign: "top", width: "70%" }}>
                <table
                  style={{
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
                      <th style={{ border: "1px solid #ccc", padding: "8px" }}>Purchase Details</th>
                      <th style={{ border: "1px solid #ccc", padding: "8px" }}>Payment History</th>
                      <th style={{ border: "1px solid #ccc", padding: "8px" }}>Make Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billDetails.map((item, index) => (
                      <tr key={index}>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.purchaseId}</td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.billAmount}</td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.outstandingAmount}</td>
                        <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                          <button style={{ backgroundColor: "#4CAF50", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px" }}
                          onClick={() => fetchPurchaseDetails(item.purchaseId)}
                          >
                            View
                          </button>
                        </td>
                        <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                          <button style={{ backgroundColor: "#2196F3", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px" }}
                          onClick={() => fetchPaymentHistory(item.id)}>
                            History
                          </button>
                        </td>
                        <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                          <button
                            style={{ backgroundColor: "#f44336", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px" }}
                            onClick={() => setSelectedPayment(item)}
                          >
                            Pay
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>

              {/* Right column: payment form */}
              <td style={{ verticalAlign: "top", width: "30%", padding: "20px" }}>
                {selectedPayment ? (
                  <div
                    style={{
                      border: "1px solid #ccc",
                      padding: "15px",
                      borderRadius: "6px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <h3>Make Payment</h3>
                    <p><strong>Purchase ID:</strong> {selectedPayment.purchaseId}</p>
                    <p><strong>Bill Amount:</strong> {selectedPayment.billAmount}</p>
                    <p><strong>Outstanding Amount:</strong> {selectedPayment.outstandingAmount}</p>

                    <label>
                      Payment Amount:
                      <input
                        type="number"
                        min="0"
                        max={selectedPayment.outstandingAmount}
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        style={{ padding: "6px", marginTop: "8px", width: "100%" }}
                      />
                    </label>
<label style={{ display: "block", marginTop: "12px" }}>
        Payment Date:
        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          style={{ padding: "6px", marginTop: "8px", width: "100%" }}
        />
      </label>

      <label style={{ display: "block", marginTop: "12px" }}>
  Comments:
  <textarea
    value={comments}
    onChange={(e) => setComments(e.target.value)}
    style={{ padding: "6px", marginTop: "8px", width: "100%" }}
    rows={3}
    placeholder="Enter any remarks about this payment"
  />
</label>


                    <button
                      style={{
                        marginTop: "12px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        padding: "8px 16px",
                        border: "none",
                        borderRadius: "4px",
                      }}
                      onClick={handlePaymentSubmit}
                    >
                      Submit Payment
                    </button>
                  </div>
                ) : (
                  <p style={{ color: "#888" }}>Select a row and click Pay to make a payment.</p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {selectedVendor && billDetails.length === 0 && (
        <p style={{ marginTop: "20px" }}>No bill details found for this vendor.</p>
      )}


{showHistoryFor && paymentHistory.length > 0 && (
  <div style={{ marginTop: "20px" }}>
    <h3>Payment History</h3>
    <table
      style={{
        width: "40%",
        borderCollapse: "collapse",
        border: "1px solid #ccc",
      }}
    >
      <thead>
        <tr>          
          <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
          <th style={{ border: "1px solid #ccc", padding: "8px" }}>Amount</th>
          <th style={{ border: "1px solid #ccc", padding: "8px" }}>Comments</th>
        </tr>
      </thead>
      <tbody>
        {paymentHistory.map((h, idx) => (
          <tr key={idx}>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{h.paymentDate}</td>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{h.paymentAmount}</td>            
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{h.comments}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
{purchaseDetails && (
  <PurchaseDetails
    details={purchaseDetails}
    onClose={() => setPurchaseDetails(null)}
  />
)}

    </div>
  );
};

export default VendorPayments;