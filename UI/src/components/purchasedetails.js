import React from "react";
import "../css/payment.css";

const PurchaseDetails = ({ details, onClose }) => {
  if (!details) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Purchase Details</h3>

       
        {/* Grid for line items */}
       
       {details.purchaseDetails && details.purchaseDetails.length > 0 ? (
  <table className="main-table" style={{ marginTop: "20px" }}>
    <thead>
      <tr>
        <th>Goods/Service Description</th>
        <th>Amount</th>
        <th>GST</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {details.purchaseDetails.map((item, idx) => (
        <tr key={idx}>
          <td>{item.goods_ServiceDesc}</td>
          <td>{item.amount}</td>
          <td>{item.gst}</td>
          <td>{item.total}</td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>No line items found.</p>
)}
       
       
       {/*
       
       
       
        <table className="main-table" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Goods/Service Description</th>
              <th>Amount</th>
              <th>GST</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {details.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.goods_ServiceDesc}</td>
                <td>{item.amount}</td>
                <td>{item.gst}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
*/}
        <button className="btn btn-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PurchaseDetails;