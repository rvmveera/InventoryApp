import React, { useState } from "react";
import "../css/addvendor.css"; // ✅ import external stylesheet

function AddVendorForm() {
  const [formData, setFormData] = useState({
    vendorName: "",
    address1: "",
    address2: "",
    address3: "",
    gstnumber: "",
    contactno1: "",
    contactno2: ""
  });

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
      const response = await fetch("https://localhost:5001/api/Vendors/addvendor", {
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
        contactno2: ""
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

      <label>
        Vendor Name:
        <input
          type="text"
          name="vendorName"
          value={formData.vendorName}
          onChange={handleChange}
          required
          className="vendor-input"
        />
      </label>

      <label>
        Address Line 1:
        <input
          type="text"
          name="address1"
          value={formData.address1}
          onChange={handleChange}
          required
          className="vendor-input"
        />
      </label>

      <label>
        Address Line 2:
        <input
          type="text"
          name="address2"
          value={formData.address2}
          onChange={handleChange}
          className="vendor-input"
        />
      </label>

      <label>
        Address Line 3:
        <input
          type="text"
          name="address3"
          value={formData.address3}
          onChange={handleChange}
          className="vendor-input"
        />
      </label>

      <label>
        GST Number:
        <input
          type="text"
          name="gstnumber"
          value={formData.gstnumber}
          onChange={handleChange}
          required
          className="vendor-input"
        />
      </label>

      <label>
        Contact Number 1:
        <input
          type="tel"
          name="contactno1"
          value={formData.contactno1}
          onChange={handleChange}
          required
          className="vendor-input"
        />
      </label>

      <label>
        Contact Number 2:
        <input
          type="tel"
          name="contactno2"
          value={formData.contactno2}
          onChange={handleChange}
          className="vendor-input"
        />
      </label>

      <button type="submit" className="vendor-button">Submit</button>
    </form>
  );
}

export default AddVendorForm;