// src/App.js
import React, { useState } from "react";
import InventoryForm from "./components/inventory-create";
import RegistrationForm from "./components/user-registration";

function App() {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleEdit = (item) => setSelectedItem(item);
  const handleSaved = () => setSelectedItem(null);

  return (
    <div>
      <h1>Inventory Management</h1>
      {/* <InventoryForm selectedItem={selectedItem} onSaved={handleSaved} /> */}

  <RegistrationForm></RegistrationForm>

    </div>
  );


}

export default App;