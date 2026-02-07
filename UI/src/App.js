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
/*import React, { useState } from "react";
import Popup from "./components/popup";
import RegistrationForm from "./components/user-registration";
import LoginForm from "./components/user-login";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h1>Welcome</h1>
      <button onClick={() => setIsOpen(true)}>Open Registration Form</button>

      <Popup isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <RegistrationForm />
      </Popup>


    </div>
  );
}

export default App;*/

// App.js
import React, { useState } from "react";
import Popup from "./components/popup";
import RegistrationForm from "./components/user-registration";
import LoginForm from "./components/user-login";
import './App.css';
import Home from './components/Home';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login"); // default tab

  return (
    <div>



      <Home></Home>
{/*       
<h1>Welcome</h1>
      <button onClick={() => { setIsOpen(true); setActiveTab("login"); }}>
        Open Login
      </button>
      <button onClick={() => { setIsOpen(true); setActiveTab("register"); }}>
        Open Registration
      </button>

      <Popup isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="tab-header">
          <button
            className={activeTab === "login" ? "active" : ""}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={activeTab === "register" ? "active" : ""}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "login" && <LoginForm />}
          {activeTab === "register" && <RegistrationForm />}
        </div>
      </Popup> */}
    </div>
  );
}

export default App;
