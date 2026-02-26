import { useState, useEffect } from "react";
import LoginForm from "../components/user-login";
import UserRegistration from "../components/user-registration";
import "../css/Home.css";
import logo from "../images/logo.jpg";
import AddVendorForm from "./addvendor";   // ✅ your vendor form
import VendorGrid  from "./vendorgrid";
import PurchaseForm from "./purchase";  // ✅ import your form


function Home() {
  const [vendorOpen, setVendorOpen] = useState(false);
   const [inventoryOpen, setInventoryOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [modal, setModal] = useState(null); // "login" | "register" | null
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [showVendorForm, setShowVendorForm] = useState(false);
const [showVendorGrid, setShowVendorGrid] = useState(false);
const [showPurchaseForm, setShowPurchaseForm] = useState(false);
   

  // Restore login state on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");
    if (token && user) {
      setIsLoggedIn(true);
      setUsername(user);
    }
  }, []);

  // Called from login.js on success
  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUsername(user.username || user);
    setModal(null);
    setVendorOpen(false);
    setAccountOpen(false);
    setInventoryOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    setVendorOpen(false);
    setAccountOpen(false);
    setInventoryOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <img
            src={logo}
            alt="Logo"
            className="nav-logo"
            onClick={() => (window.location.href = "/")}
          />
        </div>

        <div className="nav-right">
         

{/* Inventory management only if logged in */}

   {isLoggedIn && (
            <div
              className="nav-link dropdown-parent"
              onClick={() => setInventoryOpen(!inventoryOpen)}
            >
              Inventory Management ▾
              {inventoryOpen && (
                <div className="dropdown">
                  <span
                    className="dropdown-item"
                    onClick={() => {
                         setShowPurchaseForm(true);
                      setInventoryOpen(false);

            // ✅ Hide vendor forms/grids when purchase is opened
            setShowVendorForm(false);
            setShowVendorGrid(false);
            setVendorOpen(false);
             
                    }}
                  >
                    Purchase Goods/ Services
                  </span>
                  

                </div>
              )}
            </div>
          )}





          {/* Vendor Dropdown only if logged in */}
          {isLoggedIn && (
            <div
              className="nav-link dropdown-parent"
              onClick={() => setVendorOpen(!vendorOpen)}
            >
              Vendor ▾
              {vendorOpen && (
                <div className="dropdown">
                  <span
                    className="dropdown-item"
                    onClick={() => {
                      setShowVendorForm(true);
                      setVendorOpen(false);
                          setShowPurchaseForm(false); 
                    }}
                  >
                    Add Vendor
                  </span>
                  {isLoggedIn && (
  <div
    className="nav-link dropdown-parent"
    onClick={() => setVendorOpen(!vendorOpen)}
  >
    {/* Vendor ▾ */}
    {vendorOpen && (

        <span
  className="dropdown-item"
  onClick={() => {
    setShowVendorGrid(true);
    setShowVendorForm(false); // ✅ hide form when viewing grid
    setVendorOpen(false);
        setShowPurchaseForm(false); 
  }}
>
  View Vendors
</span>

    )}
  </div>
)}

                </div>
              )}
            </div>
          )}

          <span className="nav-link">
            {isLoggedIn ? "Reports" : ""}
          </span>

          {/* Account Dropdown */}
          <div
            className="nav-link dropdown-parent"
            onClick={() => setAccountOpen(!accountOpen)}
          >
            {isLoggedIn ? `Welcome, ${username}` : "Account ▾"}
            {accountOpen && (
              <div className="dropdown">
                {!isLoggedIn ? (
                  <>
                    <span
                      className="dropdown-item"
                      onClick={() => setModal("login")}
                    >
                      Login
                    </span>
                    <span
                      className="dropdown-item"
                      onClick={() => setModal("register")}
                    >
                      Register
                    </span>
                  </>
                ) : (
                  <>
                    <span className="dropdown-item">Pending Approvals</span>
                    <span className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MODAL for Login/Register */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setModal(null)}>
              ✕
            </button>

            {modal === "login" && (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            )}

            {modal === "register" && (
              <UserRegistration onSuccess={() => setModal(null)} />
            )}
          </div>
        </div>
      )}

      {/* AddVendorForm rendered inline */}
       {isLoggedIn && showVendorForm && (
        <div className="vendor-section full-width">
<AddVendorForm />
        </div>       
      )}

       {isLoggedIn && showVendorGrid && (
  <div className="vendor-section full-width">
    <VendorGrid refreshTrigger={showVendorGrid}/>
  </div>
)}
{isLoggedIn && showPurchaseForm && (
  <div className="purchase-section full-width">
    <PurchaseForm />
  </div>
)}

    

    </>
  );
}

export default Home;