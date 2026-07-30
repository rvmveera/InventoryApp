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
/*import React, { useState } from "react";
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
    </div>
  );
}

export default App;
*/


// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

// Components
import Home from './components/Home';
import VendorForm from './components/addvendor';
import RegistrationForm from "./components/user-registration";
import LoginForm from "./components/user-login";
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  const isLoggedIn = false; // replace with actual login state

  return (
    <Router>
    
        

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addvendor" element={<VendorForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
    </Router>
  );
}

export default App;



/*
1. In Vendor Mgmt ->
Vendor Name, Vendor Address, GST, Mobile, 
 -- Goods type (can be 2 - so 1 to many), state, code, Ac no., IFSC details, A/c Name., bank, branch name, Company PAN Number, 
 -- UPI/ GPAY number, Comments
 -- Update/ Delete/ i icon - to details of outstanding balance product wise/ date wise to take from purchase screen against each vendor.
-- To keep comments column in all tables.

- To check once vendor completes.
- Product, HSN, Unit
Map Products to vendor during Vendor addition
- Vendor Name,Product, 	HSN, 	Mobile Number


*/
