import React, { useState } from "react";

function PurchaseForm() {
  const [header, setHeader] = useState({
    vendorId: "",
    consigneeId: "",
    buyerName: "",
    buyerAddress: "",
    buyerGST: "",
    buyerEmail: "",
    buyerState: "",
    buyerCode: "",
    buyerPlaceofsupply: "",
    buyerContactName: "",
    buyerMobileNo: "",
    invoiceNo: "",
    ewayBillNo: "",
    invoiceDate: "",
    deliveryNote: "",
    termsOfPayment: "",
    supplierRef: "",
    otherReference: "",
    buyerOrderNo: "",
    buyerOrderDate: "",
    despatchDocNo: "",
    deliveryNoteDate: "",
    despatchedThrough: "",
    destination: "",
    billOfLadingNo: "",
    vehicleNo: "",
    termsOfDelivery: ""
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

  const handleHeaderChange = (e) => {
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
        total: "",
        createdBy: "",
        createdDate: ""
      }
    ]);
  };

  const removeDetailRow = (index) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...header, purchaseDetails: details };
    console.log("Submitting payload:", payload);

    // Example API call
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
      <div>
        <label>Vendor Id:</label>
        <input type="text" name="vendorId" value={header.vendorId} onChange={handleHeaderChange} />
      </div>
      <div>
        <label>Buyer Name:</label>
        <input type="text" name="buyerName" value={header.buyerName} onChange={handleHeaderChange} />
      </div>
      <div>
        <label>Invoice No:</label>
        <input type="text" name="invoiceNo" value={header.invoiceNo} onChange={handleHeaderChange} />
      </div>
      {/* Add other header fields similarly */}

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
              <td>
                <button type="button" onClick={() => removeDetailRow(index)}>Remove</button>
              </td>
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