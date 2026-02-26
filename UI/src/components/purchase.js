
import React, { useState, useEffect } from "react";

function PurchaseForm() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [consignee, setConsignee] = useState(null);

  const [header, setHeader] = useState({
    vendorId: "",
    buyerName: "",
    buyerAddress: "",
    buyerGST: "",
    buyerEmail: "",
    buyerState: "",
    buyerCode: "",
    buyerPlaceofsupply: "",
    buyerContactName: "",
    buyerMobileNo: ""
  });

  const [details, setDetails] = useState([
    {
      goods_ServiceDesc: "",
      hsnSac: "",
      quantity: "",
      rate: "",
      uomPer: "",
      discountPercent: "",
      amount: "",
      gst: "",
      total: ""
    }
  ]);

  // Load vendors
  useEffect(() => {
    fetch("https://localhost:5001/api/Vendors")
      .then((res) => res.json())
      .then((data) => setVendors(data))
      .catch((err) => console.error("Error loading vendors:", err));
  }, []);

  // Load consignee
  useEffect(() => {
    fetch("https://localhost:5001/api/Consignee") // 🔹 adjust endpoint
      .then((res) => res.json())
      .then((data) => setConsignee(data))
      .catch((err) => console.error("Error loading consignee:", err));
  }, []);

  const handleVendorChange = (e) => {
    const vendorId = parseInt(e.target.value, 10);
    const vendor = vendors.find((v) => v.vendorId === vendorId);
    if (vendor) {
      setHeader({ ...header, vendorId: vendor.vendorId });
      setSelectedVendor(vendor);
    }
  };

  const handleBuyerChange = (e) => {
    const { name, value } = e.target;
    setHeader({ ...header, [name]: value });
  };

  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const newDetails = [...details];
    newDetails[index][name] = value;
    setDetails(newDetails);
  };

  const addDetailRow = () => {
    setDetails([
      ...details,
      {
        goods_ServiceDesc: "",
        hsnSac: "",
        quantity: "",
        rate: "",
        uomPer: "",
        discountPercent: "",
        amount: "",
        gst: "",
        total: ""
      }
    ]);
  };

  const removeDetailRow = (index) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...header, consignee, purchaseDetails: details };
    console.log("Submitting payload:", payload);

    fetch("/api/purchase/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Saved successfully!");
        console.log(data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Purchase Header</h2>

      {/* Vendor Block */}
      <fieldset>
        <legend>Vendor Details</legend>
        <div>
          <label>Select Vendor:</label>
          <select value={header.vendorId} onChange={handleVendorChange}>
            <option value="">-- Choose Vendor --</option>
            {vendors.map((vendor) => (
              <option key={vendor.vendorId} value={vendor.vendorId}>
                {vendor.vendorName}
              </option>
            ))}
          </select>
        </div>
        {selectedVendor && (
          <div className="vendor-info">
            <p><strong>Address:</strong> {`${selectedVendor.address1}, ${selectedVendor.address2}, ${selectedVendor.address3}`}</p>
            <p><strong>GST:</strong> {selectedVendor.gstNumber}</p>
            <p><strong>State:</strong> {selectedVendor.state}</p>
            <p><strong>Code:</strong> {selectedVendor.code}</p>
          </div>
        )}
      </fieldset>

      {/* Consignee Block */}
      <fieldset>
        <legend>Consignee Details</legend>
        {consignee ? (
          <div className="consignee-info">
            <p><strong>Name:</strong> {consignee.name}</p>
            <p><strong>Address:</strong> {`${consignee.address1}, ${consignee.address2}, ${consignee.address3}`}</p>
            <p><strong>GSTIN:</strong> {consignee.gstin}</p>
            <p><strong>State:</strong> {consignee.state}</p>
            <p><strong>Code:</strong> {consignee.code}</p>
          </div>
        ) : (
            <div>
          <p>Veera Enterprises</p>
         <p>Address 1 </p>
         <p>GST : 1234</p>
         </div>
        )}
      </fieldset>

      {/* Buyer Block */}
     <fieldset>
  <legend>Buyer Details</legend>
  <table className="buyer-details-table">
    <tbody>
      <tr>
        <td><label>Buyer Name:</label></td>
        <td>
          <input
            type="text"
            name="buyerName"
            value={header.buyerName}
            onChange={handleBuyerChange}
          />
        </td>
      </tr>
      <tr>
        <td><label>Buyer Address:</label></td>
        <td>
          <textarea
            name="buyerAddress"
            value={header.buyerAddress}
            onChange={handleBuyerChange}
          ></textarea>
        </td>
      </tr>
      <tr>
        <td><label>GSTIN:</label></td>
        <td>
          <input
            type="text"
            name="buyerGST"
            value={header.buyerGST}
            onChange={handleBuyerChange}
          />
        </td>
      </tr>
      <tr>
        <td><label>State:</label></td>
        <td>
          <input
            type="text"
            name="buyerState"
            value={header.buyerState}
            onChange={handleBuyerChange}
          />
        </td>
      </tr>
      <tr>
        <td><label>Code:</label></td>
        <td>
          <input
            type="text"
            name="buyerCode"
            value={header.buyerCode}
            onChange={handleBuyerChange}
          />
        </td>
      </tr>
      <tr>
        <td><label>Place of Supply:</label></td>
        <td>
          <input
            type="text"
            name="buyerPlaceofsupply"
            value={header.buyerPlaceofsupply}
            onChange={handleBuyerChange}
          />
        </td>
      </tr>
      <tr>
        <td><label>Contact Name:</label></td>
        <td>
          <input
            type="text"
            name="buyerContactName"
            value={header.buyerContactName}
            onChange={handleBuyerChange}
          />
        </td>
      </tr>
      <tr>
        <td><label>Email:</label></td>
        <td>
          <input
            type="text"
            name="buyerEmail"
            value={header.buyerEmail}
            onChange={handleBuyerChange}
          />
        </td>
      </tr>
      <tr>
        <td><label>Mobile No:</label></td>
        <td>
          <input
            type="text"
            name="buyerMobileNo"
            value={header.buyerMobileNo}
            onChange={handleBuyerChange}
          />
        </td>
      </tr>
    </tbody>
  </table>
</fieldset>

      {/* Purchase Details Grid */}
      <h2>Purchase Details</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Description</th>
            <th>HSN/SAC</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>UOM</th>
            <th>Discount %</th>
            <th>Amount</th>
            <th>GST</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {details.map((detail, index) => (
            <tr key={index}>
              <td><input type="text" name="goods_ServiceDesc" value={detail.goods_ServiceDesc} onChange={(e) => handleDetailChange(index, e)} /></td>
              <td><input type="text" name="hsnSac" value={detail.hsnSac} onChange={(e) => handleDetailChange(index, e)} /></td>
              <td><input type="number" name="quantity" value={detail.quantity} onChange={(e) => handleDetailChange(index, e)} /></td>
              <td><input type="number" name="rate" value={detail.rate} onChange={(e) => handleDetailChange(index, e)} /></td>
              <td><input type="text" name="uomPer" value={detail.uomPer} onChange={(e) => handleDetailChange(index, e)} /></td>
              <td><input type="number" name="discountPercent" value={detail.discountPercent} onChange={(e) => handleDetailChange(index, e)} /></td>
              <td><input type="number" name="amount" value={detail.amount} onChange={(e) => handleDetailChange(index, e)} /></td>
              <td><input type="number" name="gst" value={detail.gst} onChange={(e) => handleDetailChange(index, e)} /></td>
              <td><input type="number" name="total" value={detail.total} onChange={(e) => handleDetailChange(index, e)} /></td>
              <td><button type="button" onClick={() => removeDetailRow(index)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addDetailRow}>Add Detail</button>

      <br /><br />
      <button type="submit">Save Purchase</button>
    </form>
  );
}

export default PurchaseForm;