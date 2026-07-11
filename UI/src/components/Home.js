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
import ReturnInvoice from "./returnInvoice";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel, Container, Row, Col } from "react-bootstrap";
import chair from '../images/chair.jpg'
import sofa from  '../images/sofa.jpg'
import processor from '../images/processor.jpg'
import table from '../images/table.jpg'
import 'bootstrap/dist/css/bootstrap.min.css';


function Home() {
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
const [salesOpen, setSalesOpen] = useState(false);
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

const [showReturnInvoice, setShowReturnInvoice] = useState(false);

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
setShowReturnInvoice(false);
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
        <div className="company-info">
          <h2>Veera Enterprises</h2>
          <p>Quality Furniture</p>
        </div>
      </div>

      <ul className="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">About Us</a></li>
        <li><a href="#">Products</a></li>
        <li><a href="#">Gallery</a></li>
        <li><a href="#">Contact Us</a></li>
        <li><a href="#">Get a Quote</a></li>
      </ul>

      <div className="nav-contact">
        <p>📞 +91 98765 43210</p>
        <p>✉ info@veeraenterprises.com</p>
      </div>

      {/* Account dropdown */}
      
<div className="nav-top-right">
  <div className={`dropdown-parent ${accountOpen ? "open" : ""}`}>
    <button
      type="button"
      className="nav-link"
      onClick={() => setAccountOpen(!accountOpen)}
    >
      {isLoggedIn ? `Welcome, ${username} ▾` : "Account ▾"}
    </button>
    <div className="dropdown">
      {!isLoggedIn ? (
        <div className="dropdown-list">
          <span className="dropdown-item" onClick={() => setModal("login")}>Login</span>
          <span className="dropdown-item" onClick={() => setModal("register")}>Register</span>
        </div>
      ) : (
        <div className="dropdown-list">
          <span className="dropdown-item">Pending Approvals</span>
          <span className="dropdown-item" onClick={handleLogout}>Logout</span>
        </div>
      )}
    </div>
  </div>
</div>



    </nav>

    {/* ================= SIDEBAR (only when logged in) ================= */}
    
   
{isLoggedIn && (
  
  <div className="sidebar">
  {isLoggedIn && (
    <div className={`dropdown-parent ${inventoryOpen ? "open" : ""}`}>
      <div
        className="nav-link"
        onClick={() => {
          setInventoryOpen(!inventoryOpen);
          setVendorOpen(false);
          setSalesOpen(false);
        }}
      >
        Inventory Management ▾
      </div>



      {inventoryOpen && (
        <>
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
        </>
      )}
    </div>
  )}

  {isLoggedIn && (
    <div className={`dropdown-parent ${salesOpen ? "open" : ""}`}>
      <div
        className="nav-link"
        onClick={() => {
          setSalesOpen(!salesOpen);
          setInventoryOpen(false);
          setVendorOpen(false);
        }}
      >
        Sales ▾
      </div>

      {salesOpen && (
        <>
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
          </div>

          <div className="dropdown">
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

          <div className="dropdown">
            <span
              className="dropdown-item"
              onClick={() => {
                resetSections();
                setShowReturnInvoice(true);
              }}
            >
              Return Invoice
            </span>
          </div>
        </>
      )}
    </div>
  )}

  {isLoggedIn && (
    <div className={`dropdown-parent ${vendorOpen ? "open" : ""}`}>
      <div
        className="nav-link"
        onClick={() => {
          setVendorOpen(!vendorOpen);
          setInventoryOpen(false);
          setSalesOpen(false);
        }}
      >
        Vendor ▾
      </div>

      {vendorOpen && (
        <>
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
          </div>

          <div className="dropdown">
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
          </div>

          <div className="dropdown">
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
        </>
      )}
    </div>
  )}
</div>

)}




    {/* ================= MAIN CONTENT ================= */}
    <div className={`main-content ${!isLoggedIn ? "landing" : ""}`}>
      {isLoggedIn && showVendorForm && <AddVendorForm />}
      {isLoggedIn && showVendorGrid && <VendorGrid refreshTrigger={showVendorGrid} />}
      {isLoggedIn && showPurchaseForm && <PurchaseForm />}
      {isLoggedIn && showVendorPayments && <VendorPayments />}
      {isLoggedIn && showAddInventoryPrice && <AddInventoryPrice />}
      {isLoggedIn && showViewInventory && <ViewInventory />}
      {showGoodsGST && <GoodsGST />}
      {isLoggedIn && showEstimate && <Estimate />}
      {isLoggedIn && showInvoice && <Invoice />}
      {isLoggedIn && showReturnInvoice && <ReturnInvoice />}

      {/* ================= LANDING PAGE (when not logged in) ================= */}
      {!isLoggedIn && (
        <>
          {/* HERO */}


<section className="hero">
  <div className="hero-content">
    <div className="hero-text">
      <h1>
         <span className="freehand">
        Welcome to
        </span><br/>
         VEERA ENTERPRISES</h1>
      <p>
        QUALITY FURNITURE. AFFORDABLE PRICES. TRUSTED SERVICE.<br />
        Transform your home and workspace with stylish, durable and comfortable furniture that reflects your taste and lifestyle.
      </p>
      <div className="hero-buttons">
        <a href="#" className="btn">Explore Products</a>
        <a href="#" className="btn btn-secondary">Contact Us</a>
      </div>
    </div>

    {/* Carousel next to text */}
    <div className="hero-carousel">
      

<Container fluid className="p-0">
<Row className="justify-content-center mt-5">
  <Col md={8} lg={6}>
    <Carousel fade interval={3000} className="custom-carousel shadow-lg rounded">
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={chair}
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>Manage Your Inventory</h3>
          <p>Track goods and services seamlessly.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={sofa}
          alt="Second slide"
        />
        <Carousel.Caption>
          <h3>Vendor Management</h3>
          <p>Add vendors and manage payments easily.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={table}
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>Sales & Invoices</h3>
          <p>Create estimates, invoices, and returns.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  </Col>
</Row>
</Container>

    </div>
  </div>
</section>


          {/* CATEGORIES */}
          <section className="products">
            <h2>Our Categories</h2>
            <div className="cards">
              <div className="card"><h3>Living Room</h3><p>Sofas, Chairs & More</p></div>
              <div className="card"><h3>Bedroom</h3><p>Beds, Wardrobes & More</p></div>
              <div className="card"><h3>Dining Room</h3><p>Dining Tables & Chairs</p></div>
              <div className="card"><h3>Office Furniture</h3><p>Tables, Chairs & Desks</p></div>
              <div className="card"><h3>Storage</h3><p>Cabinets & Shelves</p></div>
              <div className="card"><h3>Used Furniture</h3><p>Quality Used Items</p></div>
            </div>
          </section>

          {/* WHY CHOOSE US */}
          <section className="about">
            <h2>Why Choose Us?</h2>
            <ul className="benefits">
              <li>⭐ Premium Quality: High-quality materials for long-lasting use.</li>
              <li>💰 Affordable Price: Best furniture at budget-friendly prices.</li>
              <li>🤝 Trusted Service: We value our customers and provide best service.</li>
              <li>🚚 Delivery & Setup: Safe delivery and professional setup.</li>
              <li>😊 Customer Satisfaction: Your satisfaction is our top priority.</li>
            </ul>
          </section>

          {/* FOOTER */}
          <footer>
            <div className="footer-banner">
              <h2>Furnish Your Dreams With Veera Enterprises</h2>
              <p>Stylish Designs. Unmatched Quality. Trusted by Thousands.</p>
              <a href="#" className="btn">Visit Our Store</a>
            </div>
            <div className="footer">
              <div>
                <h3>Company</h3>
                <p>123, Main Road, Coimbatore - 641 001, Tamil Nadu, India</p>
                <p>📞 +91 98765 43210</p>
                <p>✉ info@veeraenterprises.com</p>
                <p>🕒 Mon-Sat 9:00 AM - 8:00 PM, Sun 10:00 AM - 2:00 PM</p>
              </div>
              <div>
                <h3>Quick Links</h3>
                <ul>
                  <li><a href="#">Home</a></li>
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Products</a></li>
                  <li><a href="#">Gallery</a></li>
                  <li><a href="#">Contact Us</a></li>
                  <li><a href="#">Get a Quote</a></li>
                </ul>
              </div>
              <div>
                <h3>Product Links</h3>
                <ul>
                  <li><a href="#">Living Room</a></li>
                  <li><a href="#">Bedroom</a></li>
                  <li><a href="#">Dining Room</a></li>
                  <li><a href="#">Office Furniture</a></li>
                  <li><a href="#">Storage</a></li>
                  <li><a href="#">Used Furniture</a></li>
                </ul>
              </div>
            </div>
            <div className="bottom">
              © 2026 Veera Enterprises. All Rights Reserved. <br />
              Designed with ♥ for Better Living.
            </div>
          </footer>
        </>
      )}
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