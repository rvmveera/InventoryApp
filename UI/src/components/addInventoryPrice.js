import React, { useState } from "react";

const AddInventoryPrice = () => {
  const [file, setFile] = useState(null);
const API_BASE_URL = process.env.REACT_APP_API_URL; 

  // Download template
  const handleDownload = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Inventory/export`, {
        method: "POST", // since your export endpoint is POST
      });

      if (!response.ok) throw new Error("Failed to download template");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "InventoryTemplate.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  // Upload edited Excel
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://localhost:5001/api/Inventory/uploadPrice", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Inventory prices uploaded successfully!");
        setFile(null);
      } else {
        alert("Error uploading file");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <h2>Add Inventory Price</h2>

      <button onClick={handleDownload}>Download Excel Template</button>

      <div style={{ marginTop: "20px" }}>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleUpload} disabled={!file}>
          Upload Edited Excel
        </button>
      </div>
    </div>
  );
};

export default AddInventoryPrice;