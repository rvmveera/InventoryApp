// src/components/InventoryForm.js
import React, { useState, useEffect } from "react";
import { createInventory, updateInventory } from "../services/inventory-service";

function InventoryForm({ selectedItem, onSaved }) {
const API_BASE_URL = process.env.REACT_APP_API_URL;
  
  const [form, setForm] = useState({
    invId: "",
    invName: "",
    status: "",
    availableStock: 0,
    createdBy: "Raghavan",
    createdDate: new Date().toISOString(),
  });

   const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

/*
  useEffect(() => {
    if (selectedItem) setForm(selectedItem);
  }, [selectedItem]);
*/

  // Load existing items from WebAPI when component mounts
  useEffect(() => {
    fetch(`${API_BASE_URL}/Inventory`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error loading items:", err));
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItem) {
      await updateInventory(form.invId, form);
    } else {
      await createInventory(form);
    }
    onSaved();
  };

  return (
     <div style={{ padding: "20px" }}>

    <form onSubmit={handleSubmit}>
      <input
        name="invId"
        value={form.invId}
        onChange={handleChange}
        placeholder="ID"
        required
      />
      <input
        name="invName"
        value={form.invName}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="status"
        value={form.status}
        onChange={handleChange}
        placeholder="Status"
      />
      <input
        name="availableStock"
        type="number"
        value={form.availableStock}
        onChange={handleChange}
        placeholder="Stock"
      />
      <button type="submit">{selectedItem ? "Update" : "Create"}</button>
    </form>

    <h2>Item List</h2>
      <div className="grid-container">
        {items.map((item) => (
          <div key={item.id} className="grid-item">
            <h4>{item.invName}</h4> : {item.availableStock}
          </div>
        ))}
      </div>
</div>
  );
}

export default InventoryForm;


/*

1. Create a registration screen for below user login types
fname, lname, emailid, phonenumber, username, pwd, confirm password, address, usertype, adhar (non-mandate), dateofbirth,
Gender, resume upload (non-mandate), GST

2. create registration table with above fields [along with active status, createdby, createddate, updatedby, updatedDate]

Login types : 
admin/ staff/ manager/ customer/ vendor


*/