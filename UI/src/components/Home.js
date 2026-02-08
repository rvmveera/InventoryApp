import { useState, useEffect } from "react";
import LoginForm from "../components/user-login";
import UserRegistration from "../components/user-registration";
import "../css/Home.css";
import logo from "../images/logo.jpg";

function Home() {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(null); // "login" | "register" | null

  // 🔐 Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

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
    setUsername(user.username || user); // depending on API return
    setModal(null); // close modal
    setOpen(false); // close dropdown
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    setOpen(false);
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

        <div className="nav-right" onClick={() => setOpen(!open)}>
          
          <div className="nav-left">
           <span className="nav-link" onClick={() => window.location.href = "/"}>
            {isLoggedIn ?  "Inventory Management" : ""}
                      </span>                    
          

                      <span className="nav-link" onClick={() => window.location.href = "/"}>
            {isLoggedIn ?  "Vendor Management" : ""}
                      </span>
<span className="nav-link" onClick={() => window.location.href = "/"}>
            {isLoggedIn ?  "Reports" : ""}
                      </span>

          
          <span className="nav-link">
            {isLoggedIn ? `Welcome, ${username}` : "Account ▾"}
          </span>
</div>


          {open && (
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

                
                  {/* Logged-in menu */}
                  <span className="dropdown-item">My Profile</span>
                  <span className="dropdown-item">Orders</span>
                  <span className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* MODAL */}
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
