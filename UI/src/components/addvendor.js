import React, { useState } from "react";

function AddVendorForm() {
  const [formData, setFormData] = useState({
    vendorName: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    gst: "",
    contactNumber: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Here you can call an API or backend service
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Vendor Registration</h2>

      <label>
        Vendor Name:
        <input
          type="text"
          name="vendorName"
          value={formData.vendorName}
          onChange={handleChange}
          required
          style={styles.input}
        />
      </label>

      <label>
        Address Line 1:
        <input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          required
          style={styles.input}
        />
      </label>

      <label>
        Address Line 2:
        <input
          type="text"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
          style={styles.input}
        />
      </label>

      <label>
        Address Line 3:
        <input
          type="text"
          name="addressLine3"
          value={formData.addressLine3}
          onChange={handleChange}
          style={styles.input}
        />
      </label>

      <label>
        GST Number:
        <input
          type="text"
          name="gst"
          value={formData.gst}
          onChange={handleChange}
          required
          style={styles.input}
        />
      </label>

      <label>
        Contact Number:
        <input
          type="tel"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          required
          style={styles.input}
        />
      </label>

      <button type="submit" style={styles.button}>Submit</button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "400px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9"
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "4px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

export default AddVendorForm;