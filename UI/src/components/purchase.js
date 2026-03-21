
import React, { useState, useEffect } from "react";
import "../css/purchase.css"


function PurchaseForm() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [consignee, setConsignee] = useState(null);
const [goodsTypes, setGoodsTypes] = useState([]);
const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
  };


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
    buyerMobileNo: "",
    invoiceNo : "",
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
termsOfDelivery: "",
totalBillAmount : ""
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
      fetch(`https://localhost:5001/api/Vendors/GetVendorGroupType?vendorId=${vendorId}`)
      .then(res => res.json())
      .then(data => {
        setGoodsTypes(data); // [{Id, GoodsType, GSTpercent}, ...]
      })
      .catch(err => console.error("Error fetching goods types:", err));

    }
  };

  const handleBuyerChange = (e) => {
    const { name, value } = e.target;
    setHeader({ ...header, [name]: value });
  };
const calculateRowValues = (detail) => {
  const quantity = parseFloat(detail.quantity) || 0;
  const rate = parseFloat(detail.rate) || 0;
  const discountPercent = parseFloat(detail.discountPercent) || 0;
  const gstPercent = parseFloat(detail.gst) || 0; // GST comes from goodsType

  // Base amount
  let amount = quantity * rate;

  // Apply discount
  amount = amount - (amount * discountPercent) / 100;

  // GST amount
  const gstAmount = (amount * gstPercent) / 100;

  // Total
  const total = amount + gstAmount;

  return {
    ...detail,
    amount: amount.toFixed(2),
    total: total.toFixed(2),
  };
};




const handleDetailChange = (index, e) => {
  const { name, value } = e.target;
  const updatedDetails = [...details];   // ✅ create a copy first

  if (name === "goodsTypeId") {
    updatedDetails[index][name] = value;

    const selected = goodsTypes.find(gt => gt.id == value);
    if (selected) {
      updatedDetails[index].gst = selected.gsTpercent;
    }
  } else {
    updatedDetails[index][name] = value;
  }

  // Run calculation after updating values
  updatedDetails[index] = calculateRowValues(updatedDetails[index]);

  setDetails(updatedDetails);
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

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Build payload according to API contract
  const payload = {
    id: 0, // new purchase
    vendorId: header.vendorId,
    consigneeId: consignee ? consignee.id : 1, // adjust based on your consignee model
    buyerName: header.buyerName,
    buyerAddress: header.buyerAddress,
    buyerGST: header.buyerGST,
    buyerEmail: header.buyerEmail,
    buyerState: header.buyerState,
    buyerCode: header.buyerCode,
    buyerPlaceofsupply: header.buyerPlaceofsupply,
    buyerContactName: header.buyerContactName,
    buyerMobileNo: header.buyerMobileNo,

    // Add other header fields you need (invoiceNo, ewayBillNo, etc.)
    invoiceNo: header.invoiceNo,
    ewayBillNo: header.ewayBillNo,
    invoiceDate: header.invoiceDate,
    deliveryNote: header.deliveryNote,
    termsOfPayment: header.termsOfPayment,
    supplierRef: header.supplierRef,
    otherReference: header.otherReference,
    buyerOrderNo: header.buyerOrderNo,
    buyerOrderDate: header.buyerOrderDate,
    despatchDocNo: header.despatchDocNo,
    deliveryNoteDate: header.deliveryNoteDate,
    despatchedThrough: header.despatchedThrough,
    destination: header.destination,
    billOfLadingNo: header.billOfLadingNo,
    vehicleNo: header.vehicleNo,
    termsOfDelivery: header.termsOfDelivery,
totalBillAmount : header.totalBillAmount,

    // Details array
    purchaseDetails: details.map(d => ({
      id: 0,
      purchaseHeaderId: 0, // API will assign actual headerId
      goods_ServiceDesc: d.goods_ServiceDesc,
      hsnSac: d.hsnSac,
      quantity: Number(d.quantity),
      rate: Number(d.rate),
      uomPer: d.uomPer,
      discountPercent: Number(d.discountPercent) || 0,
      amount: Number(d.amount),
      gst: Number(d.gst),
      total: Number(d.total)
    }))
  };

  console.log("Submitting payload:", payload);

  try {
    const response = await fetch("https://localhost:5001/api/Purchase/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      alert(`Purchase #${data.id} saved successfully!`);
      console.log("Saved purchase:", data);
    } else {
      const errorData = await response.json();
      console.error("Failed to save purchase:", errorData);
      alert("Error saving purchase. Check console for details.");
    }
  } catch (err) {
    console.error("Error submitting purchase:", err);
    alert("Unexpected error occurred.");
  }
};
const getBillAmount = () => {
  header.totalBillAmount = details.reduce((sum, row) => {
    const rowTotal = parseFloat(row.total) || 0;
    return sum + rowTotal;
  }, 0).toFixed(2);
  return header.totalBillAmount;
};


  return (
    <form onSubmit={handleSubmit}>
      <h2>Purchase Header</h2>

     
{/* Vendor Block */}

<fieldset>
  <legend> <strong>Vendor Details</strong></legend>
  <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <tbody>
      <tr>
        {/* Left side: Vendor selection and info */}
        <td
          style={{
            verticalAlign: "top",
            width: "50%",
            paddingRight: "20px",
            borderRight: "2px solid #ccc" // vertical line
          }}
        >
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ width: "40%" }}><label>Select Vendor:</label></td>
                <td style={{ width: "60%" }}>
                  <select value={header.vendorId} onChange={handleVendorChange}>
                    <option value="">-- Choose Vendor --</option>
                    {vendors.map((vendor) => (
                      <option key={vendor.vendorId} value={vendor.vendorId}>
                        {vendor.vendorName}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              {selectedVendor && (
                <>
                  <tr>
                    <td>Address:</td>
                    <td>{`${selectedVendor.address1}, ${selectedVendor.address2}, ${selectedVendor.address3}`}</td>
                  </tr>
                  <tr>
                    <td>GST:</td>
                    <td>{selectedVendor.gstNumber}</td>
                  </tr>
                  <tr>
                    <td>State:</td>
                    <td>{selectedVendor.state}</td>
                  </tr>
                  <tr>
                    <td>Code:</td>
                    <td>{selectedVendor.code}</td>
                  </tr>
                  <tr>
                <td style={{ width: "40%" }}><label>Invoice No:</label></td>
                <td><input type="text" value={header.invoiceNo}
                  onChange={(e) => setHeader({ ...header, invoiceNo: e.target.value })} /></td>
              </tr>
                </>
              )}
            </tbody>
          </table>
        </td>

        {/* Right side: Invoice and other fields */}
        <td style={{ verticalAlign: "top", width: "50%", paddingLeft: "20px" }}>
          <table style={{ width: "100%" }}>
            <tbody>
              
              <tr>
                <td><label>E-way Bill No:</label></td>
                <td><input type="text" value={header.ewayBillNo}
                  onChange={(e) => setHeader({ ...header, ewayBillNo: e.target.value })} /></td>
              </tr>
              <tr>
                <td><label>Invoice Date:</label></td>
                <td><input type="date" value={header.invoiceDate}
                  onChange={(e) => setHeader({ ...header, invoiceDate: e.target.value })} /></td>
              </tr>
              <tr>
                <td><label>Delivery Note:</label></td>
                <td><input type="text" value={header.deliveryNote}
                  onChange={(e) => setHeader({ ...header, deliveryNote: e.target.value })} /></td>
              </tr>
              <tr>
                <td><label>Terms of Payment:</label></td>
                <td><input type="text" value={header.termsOfPayment}
                  onChange={(e) => setHeader({ ...header, termsOfPayment: e.target.value })} /></td>
              </tr>
              <tr>
                <td><label>Supplier Ref:</label></td>
                <td><input type="text" value={header.supplierRef}
                  onChange={(e) => setHeader({ ...header, supplierRef: e.target.value })} /></td>
              </tr>
              <tr>
                <td><label>Other Reference:</label></td>
                <td><input type="text" value={header.otherReference}
                  onChange={(e) => setHeader({ ...header, otherReference: e.target.value })} /></td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</fieldset>


      {/* Consignee Block */}
<fieldset>
  <legend><strong>Consignee Details</strong></legend>
  <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <tbody>
      <tr>
        {/* Left side: Consignee info */}
        <td
          style={{
            verticalAlign: "top",
            width: "50%",
            paddingRight: "20px",
            borderRight: "2px solid #ccc"
          }}
        >
          <table style={{ width: "100%" }}>
            <tbody>
              {consignee ? (
                <>
                  <tr>
                    <td style={{ width: "40%" }}><label>Name:</label></td>
                    <td style={{ width: "60%" }}>{consignee.name}</td>
                  </tr>
                  <tr>
                    <td><label>Address:</label></td>
                    <td>{`${consignee.address1}, ${consignee.address2}, ${consignee.address3}`}</td>
                  </tr>
                  <tr>
                    <td><label>GSTIN:</label></td>
                    <td>{consignee.gstin}</td>
                  </tr>
                  <tr>
                    <td><label>State:</label></td>
                    <td>{consignee.state}</td>
                  </tr>
                  <tr>
                    <td><label>Code:</label></td>
                    <td>{consignee.code}</td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <td>Name:</td>
                    <td>Veera Enterprises</td>
                  </tr>
                  <tr>
                    <td>Address:</td>
                    <td>Address 1</td>
                  </tr>
                  <tr>
                    <td>GST:</td>
                    <td>1234</td>
                  </tr>
                  <tr>
                <td><label>Buyer Order No:</label></td>
                <td><input type="text" value={header.buyerOrderNo} 
                onChange={(e) => setHeader({ ...header, buyerOrderNo: e.target.value })} /></td>
              </tr>
                </>
              )}
            </tbody>
          </table>
        </td>

        {/* Right side: Dispatch-related fields bound to header */}
        <td style={{ verticalAlign: "top", width: "50%", paddingLeft: "20px" }}>
          <table style={{ width: "100%" }}>
            <tbody>
              
              <tr>
                <td><label>Buyer Order Date:</label></td>
                <td><input type="date" value={header.buyerOrderDate} 
               onChange={(e) => setHeader({ ...header, buyerOrderDate: e.target.value })}  /></td>
              </tr>
              <tr>
                <td><label>Despatch Doc No:</label></td>
                <td><input type="text" value={header.despatchDocNo}
                 onChange={(e) => setHeader({ ...header, despatchDocNo: e.target.value })}  /></td>
              </tr>
              <tr>
                <td><label>Delivery Note Date:</label></td>
                <td><input type="date" value={header.deliveryNoteDate} 
                 onChange={(e) => setHeader({ ...header, deliveryNoteDate: e.target.value })} /></td>
              </tr>
              <tr>
                <td><label>Despatched Through:</label></td>
                <td><input type="text" value={header.despatchedThrough} 
                 onChange={(e) => setHeader({ ...header, despatchedThrough: e.target.value })} /></td>
              </tr>
              <tr>
                <td><label>Destination:</label></td>
                <td><input type="text" value={header.destination} 
                 onChange={(e) => setHeader({ ...header, destination: e.target.value })} /></td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</fieldset>

      {/* Buyer Block */}
    
<fieldset>
  <legend><strong>Buyer Details</strong></legend>
  <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <tbody>

      <tr>
        <td>
            <input 
          type="checkbox" 
          checked={isChecked} 
          onChange={handleChange} 
        />
        Same as Consignee
    

        </td>
      </tr>
      <tr>
        {/* Left side: Buyer info */}
        <td
          style={{
            verticalAlign: "top",
            width: "50%",
            paddingRight: "20px",
            borderRight: "2px solid #ccc" // vertical line
          }}
        >
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td><label>Buyer Name:</label></td>
                <td><input type="text" name="buyerName" value={header.buyerName}
                 onChange={(e) => setHeader({ ...header, buyerName: e.target.value })}  /></td>
              </tr>
              <tr>
                <td><label>Buyer Address:</label></td>
                <td><textarea name="buyerAddress" value={header.buyerAddress}
                 onChange={(e) => setHeader({ ...header, buyerAddress: e.target.value })} ></textarea></td>
              </tr>
              <tr>
                <td><label>GSTIN:</label></td>
                <td><input type="text" name="buyerGST" value={header.buyerGST} 
                 onChange={(e) => setHeader({ ...header, buyerGST: e.target.value })} /></td>
              </tr>
              <tr>
                <td><label>State:</label></td>
                <td><input type="text" name="buyerState" value={header.buyerState} 
                 onChange={(e) => setHeader({ ...header, buyerState: e.target.value })} /></td>
              </tr>
              <tr>
                <td><label>Code:</label></td>
                <td><input type="text" name="buyerCode" value={header.buyerCode} 
                 onChange={(e) => setHeader({ ...header, buyerCode: e.target.value })} /></td>
              </tr>
              <tr>
                <td><label>Place of Supply:</label></td>
                <td><input type="text" name="buyerPlaceofsupply" value={header.buyerPlaceofsupply} 
                 onChange={(e) => setHeader({ ...header, buyerPlaceofsupply: e.target.value })} /></td>
              </tr>
             
            </tbody>
          </table>
        </td>

        {/* Right side: New fields */}
        <td style={{ verticalAlign: "top", width: "50%", paddingLeft: "20px" }}>
          <table style={{ width: "100%" }}>
            <tbody>
               <tr>
                <td><label>Contact Name:</label></td>
                <td><input type="text" name="buyerContactName" value={header.buyerContactName} 
                  onChange={(e) => setHeader({ ...header, buyerContactName: e.target.value })} /></td>
              </tr>
              <tr>
                <td><label>Email:</label></td>
                <td><input type="text" name="buyerEmail" value={header.buyerEmail} 
                  onChange={(e) => setHeader({ ...header, buyerEmail: e.target.value })} /></td>
              </tr>
              <tr>
                <td><label>Mobile No:</label></td>
                <td><input type="text" name="buyerMobileNo" value={header.buyerMobileNo} 
                  onChange={(e) => setHeader({ ...header, buyerMobileNo: e.target.value })} /></td>
              </tr>
              <tr>
                <td><label>Bill of Lading No:</label></td>
                <td><input type="text" name="billOfLadingNo" value={header.billOfLadingNo} 
                  onChange={(e) => setHeader({ ...header, billOfLadingNo: e.target.value })} /></td>
              </tr>
              <tr>
                <td><label>Vehicle No:</label></td>
                <td><input type="text" name="vehicleNo" value={header.vehicleNo} 
                  onChange={(e) => setHeader({ ...header, vehicleNo: e.target.value })} /></td>
              </tr>
              <tr>
                <td><label>Terms of Delivery:</label></td>
                <td><input type="text" name="termsOfDelivery" value={header.termsOfDelivery} 
                  onChange={(e) => setHeader({ ...header, termsOfDelivery: e.target.value })} /></td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</fieldset>

      {/* Purchase Details Grid */}
      <h2>Purchase Details</h2>
      <div style={{ marginBottom: "10px" }}>
  <strong>Bill Amount: </strong> {getBillAmount()}
</div>

      <table border="1" class="purchase-table">
        <thead>
          <tr>
           <th>Goods Type</th>
            <th>Description</th>
            <th>HSN/SAC</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>UOM</th>
            <th>Discount %</th>
            <th>Amount</th>
            <th>GST %</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {details.map((detail, index) => (
            <tr key={index}>
             {/* Goods Type Dropdown */}
              <td>
                <select
                  name="goodsTypeId"
                  value={detail.goodsTypeId}
                  onChange={(e) => handleDetailChange(index, e)}
                >
                  <option value="">-- Select --</option>
                  {goodsTypes.map(gt => (
                    <option key={gt.id} value={gt.id}>
                      {gt.goodsTypeName}
                    </option>
                  ))}
                </select>
              </td>

              <td><input type="text" name="goods_ServiceDesc" value={detail.goods_ServiceDesc} onChange={(e) => handleDetailChange(index, e)} /></td>
              <td><input type="text" name="hsnSac" value={detail.hsnSac} onChange={(e) => handleDetailChange(index, e)} /></td>
              <td><input type="number" name="quantity" value={detail.quantity} onChange={(e) => handleDetailChange(index, e)} /></td>
              <td><input type="number" name="rate" value={detail.rate} onChange={(e) => handleDetailChange(index, e)} /></td>
              <td><input type="text" name="uomPer" value={detail.uomPer} onChange={(e) => handleDetailChange(index, e)} /></td>
              <td><input type="number" name="discountPercent" value={detail.discountPercent} onChange={(e) => handleDetailChange(index, e)} /></td>
              <td><input type="number" name="amount" value={detail.amount} onChange={(e) => handleDetailChange(index, e)} readOnly/></td>
              <td><input type="number" name="gst" value={detail.gst} onChange={(e) => handleDetailChange(index, e)} readOnly /></td>
              <td><input type="number" name="total" value={detail.total} onChange={(e) => handleDetailChange(index, e)} readOnly /></td>
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