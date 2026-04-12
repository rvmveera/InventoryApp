import { useState, useEffect } from "react";
import LoginForm from "../components/user-login";
import UserRegistration from "../components/user-registration";
import "../css/Home.css";
import logo from "../images/logo.jpg";
import AddVendorForm from "./addvendor";
import VendorGrid from "./vendorgrid";
import PurchaseForm from "./purchase";
import GoodsGST from "./goodsGST";
import VendorPayments from "./vendorpayment";
import Estimate from "./estimate";
import Invoice from "./invoice";
import AddInventoryPrice from "./addInventoryPrice";
import ViewInventory from "./viewInventory";

function Home() {
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const [modal, setModal] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showVendorGrid, setShowVendorGrid] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showGoodsGST, setShowGoodsGST] = useState(false);
  const [showVendorPayments, setShowVendorPayments] = useState(false);

  const [showEstimate, setShowEstimate] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

const [showAddInventoryPrice, setShowAddInventoryPrice] = useState(false);
const [showViewInventory, setShowViewInventory] = useState(false);


  /* Restore login */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");

    if (token && user) {
      setIsLoggedIn(true);
      setUsername(user);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUsername(user.username || user);
    setModal(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    setIsLoggedIn(false);
    setUsername("");

    resetSections();
  };

  const resetSections = () => {
    setShowVendorForm(false);
    setShowVendorGrid(false);
    setShowPurchaseForm(false);
    setShowGoodsGST(false);
    setShowVendorPayments(false);
    setShowEstimate(false);
    setShowInvoice(false);
  setShowAddInventoryPrice(false);
  setShowViewInventory(false);

  };

  return (
    <>
      {/* ================= TOP NAVBAR ================= */}
      <nav className="navbar">
        <div className="nav-left">
          <img
            src={logo}
            alt="Logo"
            className="nav-logo"
            onClick={() => window.location.reload()}
          />
        </div>

        {/* 🔥 RIGHT SIDE ACCOUNT SECTION */}
        <div className="nav-top-right">
          <div className={`dropdown-parent ${accountOpen ? "open" : ""}`}>
            <div
              className="nav-link"
              onClick={() => setAccountOpen(!accountOpen)}
            >
              {isLoggedIn ? `Welcome, ${username} ▾` : "Account ▾"}
            </div>

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
          </div>
        </div>
      </nav>

      {/* ================= SIDEBAR ================= */}
      <div className="sidebar">
        {isLoggedIn && (
          <div className={`dropdown-parent ${inventoryOpen ? "open" : ""}`}>
            <div
              className="nav-link"
              onClick={() => {
                setInventoryOpen(!inventoryOpen);
                setVendorOpen(false);
              }}
            >
              Inventory Management ▾
            </div>

            <div className="dropdown">
              <span
                className="dropdown-item"
                onClick={() => {
                  resetSections();
                  setShowGoodsGST(true);
                }}
              >
                Goods Type GST
              </span>
            </div>

            <div className="dropdown">
              <span
                className="dropdown-item"
                onClick={() => {
                  resetSections();
                  setShowPurchaseForm(true);
                  setInventoryOpen(false);
                }}
              >
                Purchase Goods / Services
              </span>
            </div>

          <div className="dropdown">
              <span
                className="dropdown-item"
                onClick={() => {
                  resetSections();
                  setShowAddInventoryPrice(true);
                  setInventoryOpen(false);
                }}
              >
                Add Inventory Price
              </span>
            </div>

            <div className="dropdown">
              <span
                className="dropdown-item"
                onClick={() => {
                  resetSections();
                  setShowViewInventory(true);
                  setInventoryOpen(false);
                }}
              >
                View Inventory List
              
              </span>
            </div>

          </div>
        )}

        {isLoggedIn && (
          <div className={`dropdown-parent ${vendorOpen ? "open" : ""}`}>
            <div
              className="nav-link"
              onClick={() => {
                setVendorOpen(!vendorOpen);
                setInventoryOpen(false);
              }}
            >
              Sales ▾
            </div>

            <div className="dropdown">
              <span
                className="dropdown-item"
                onClick={() => {
                  resetSections();
                  setShowEstimate(true);
                }}
              >
                Estimation
              </span>

              <span
                className="dropdown-item"
                onClick={() => {
                  resetSections();
                  setShowInvoice(true);
                }}
              >
                Invoice
              </span>
            </div>
          </div>
        )}

        {isLoggedIn && (
          <div className={`dropdown-parent ${vendorOpen ? "open" : ""}`}>
            <div
              className="nav-link"
              onClick={() => {
                setVendorOpen(!vendorOpen);
                setInventoryOpen(false);
              }}
            >
              Vendor ▾
            </div>

            <div className="dropdown">
              <span
                className="dropdown-item"
                onClick={() => {
                  resetSections();
                  setShowVendorForm(true);
                  setVendorOpen(false);
                }}
              >
                Add Vendor
              </span>

              <span
                className="dropdown-item"
                onClick={() => {
                  resetSections();
                  setShowVendorGrid(true);
                  setVendorOpen(false);
                }}
              >
                View Vendors
              </span>

              <span
                className="dropdown-item"
                onClick={() => {
                  resetSections();
                  setShowVendorForm(false);
                  setVendorOpen(false);
                  setShowVendorPayments(true);
                }}
              >
                Make Payments
              </span>
            </div>
          </div>
        )}

        {isLoggedIn && <div className="nav-link">Reports</div>}
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="main-content">
        {isLoggedIn && showVendorForm && <AddVendorForm />}
        {isLoggedIn && showVendorGrid && (
          <VendorGrid refreshTrigger={showVendorGrid} />
        )}
        {isLoggedIn && showPurchaseForm && <PurchaseForm />}
        {isLoggedIn && showVendorPayments && <VendorPayments />}
{isLoggedIn && showAddInventoryPrice && <AddInventoryPrice />}
{isLoggedIn && showViewInventory && <ViewInventory />}


        {showGoodsGST && <GoodsGST />}
        {isLoggedIn && showEstimate && <Estimate />}
        {isLoggedIn && showInvoice && <Invoice />}
      </div>

      {/* ================= MODAL ================= */}
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
    </>
  );
}

export default Home;