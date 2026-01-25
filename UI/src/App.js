// src/App.js
/*
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
      { /* <InventoryForm selectedItem={selectedItem} onSaved={handleSaved} /> }

  <RegistrationForm></RegistrationForm>

    </div>
  );


}*/



// App.js
import React, { useState } from "react";
import Popup from "./components/popup";
import RegistrationForm from "./components/user-registration";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h1>Welcome to My App</h1>
      <button onClick={() => setIsOpen(true)}>Open Registration Form</button>

      <Popup isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <RegistrationForm />
      </Popup>
    </div>
  );
}

export default App;