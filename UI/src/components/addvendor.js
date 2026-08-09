import React, { useState } from "react";
import "../css/addvendor.css"; // ✅ import external stylesheet

function AddVendorForm() {
const API_BASE_URL = process.env.REACT_APP_API_URL; 

  const [formData, setFormData] = useState({
    vendorName: "",
    address1: "",
    address2: "",
    address3: "",
    gstnumber: "",
    contactno1: "",
    contactno2: "",
    state: "",
    code: "",
    acNo: "",
    ifscCode: "",
    acName: "",
    bank: "",
    branchName: "",
    companyPan: "",
    upi_gpayNo: "",
    comments: ""
  });

 const [uploadFile, setUploadFile] = useState(null);

  // Download template
  const handleDownloadTemplate = async () => {
    try {
const apiurl = `${API_BASE_URL}/Vendors/downloadvendortemplate`;

      const response = await fetch(apiurl);
      if (!response.ok) throw new Error("Failed to download template");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "VendorTemplate.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error downloading template");
      console.error(error);
    }
  };

  // Upload Excel
  const handleUploadExcel = async () => {
    if (!uploadFile) {
      alert("Please select an Excel file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const response = await fetch(`${API_BASE_URL}/Vendors/uploadvendors`, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Vendors uploaded successfully!");
      } else {
        alert("Failed to upload vendors.");
      }
    } catch (error) {
      alert("Error uploading file.");
      console.error(error);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/Vendors/addvendor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Vendor added successfully!");
        console.log("Server Response:", data);

        setFormData({
        vendorName: "",
    address1: "",
    address2: "",
    address3: "",
    gstnumber: "",
    contactno1: "",
    contactno2: "",
    state: "",
    code: "",
    acNo: "",
    ifscCode: "",
    acName: "",
    bank: "",
    branchName: "",
    companyPan: "",
    upi_gpayNo: "",
    comments: ""
        });
      } else {
        alert("Failed to add vendor.");
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      alert("Error connecting to API.");
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="vendor-form">
      <h2>Vendor Registration</h2>

 {/* Template download & upload section */}
      <div className="template-section">
        <button type="button" className="vendor-button" onClick={handleDownloadTemplate}>
          Download Vendors Template
        </button>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setUploadFile(e.target.files[0])}
          className="vendor-input"
        />
        <button type="button" className="vendor-button" onClick={handleUploadExcel}>
          Upload Vendors
        </button>
      </div>


      {/* Existing fields */}
      <label>
        Vendor Name:
        <input type="text" name="vendorName" value={formData.vendorName} onChange={handleChange} required className="vendor-input" />
      </label>
 <div className="form-row two-col">
      <label>
        Address Line 1:
        <input type="text" name="address1" value={formData.address1} onChange={handleChange} required className="vendor-input" />
      </label>

      <label>
        Address Line 2:
        <input type="text" name="address2" value={formData.address2} onChange={handleChange} className="vendor-input" />
      </label>
</div>
<div className="form-row two-col">
      <label>
        Address Line 3:
        <input type="text" name="address3" value={formData.address3} onChange={handleChange} className="vendor-input" />
      </label>

      <label>
        GST Number:
        <input type="text" name="gstnumber" value={formData.gstnumber} onChange={handleChange} required className="vendor-input" />
      </label>
</div>
<div className="form-row two-col">
      <label>
        Contact Number 1:
        <input type="tel" name="contactno1" value={formData.contactno1} onChange={handleChange} required className="vendor-input" />
      </label>

      <label>
        Contact Number 2:
        <input type="tel" name="contactno2" value={formData.contactno2} onChange={handleChange} className="vendor-input" />
      </label>
</div>
      {/* New fields */}
      <div className="form-row two-col">
      <label>
        State:
        <input type="text" name="state" value={formData.state} onChange={handleChange} className="vendor-input" />
      </label>

      <label>
        Code:
        <input type="text" name="code" value={formData.code} onChange={handleChange} className="vendor-input" />
      </label>
</div>
<div className="form-row two-col">
      <label>
        Account Number:
        <input type="text" name="acNo" value={formData.acNo} onChange={handleChange} className="vendor-input" />
      </label>

      <label>
        IFSC:
        <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} className="vendor-input" />
      </label>
</div>

<div className="form-row two-col">
      <label>
        Account Name:
        <input type="text" name="acName" value={formData.acName} onChange={handleChange} className="vendor-input" />
      </label>

      <label>
        Bank:
        <input type="text" name="bank" value={formData.bank} onChange={handleChange} className="vendor-input" />
      </label>
      </div>
<div className="form-row two-col">
      <label>
        Branch Name:
        <input type="text" name="branchName" value={formData.branchName} onChange={handleChange} className="vendor-input" />
      </label>

      <label>
        Company PAN Number:
        <input type="text" name="companyPan" value={formData.companyPan} onChange={handleChange} className="vendor-input" />
      </label>
</div>



      <label>
        UPI / GPay Number:
        <input type="text" name="upi_gpayNo" value={formData.upi_gpayNo} onChange={handleChange} className="vendor-input" />
      </label>

      <label>
        Comments:
        <input type="text" name="comments" value={formData.comments} onChange={handleChange} className="vendor-input" />
      </label>

      <button type="submit" className="vendor-button">Submit</button>
    </form>
  );
}

export default AddVendorForm;