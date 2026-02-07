import { useState } from "react";
import LoginForm from "../components/user-login";
import UserRegistration from "../components/user-registration";
import "../css/Home.css";
import logo from "../images/logo.jpg";

function Home() {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(null); // "login" | "register" | null

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <img
            src={logo}
            alt="Logo"
            className="nav-logo"
            onClick={() => window.location.href = "/"}
          />
        </div>


        <div
          className="nav-right"
         onClick={() => setOpen(!open)}
        >
          <span className="nav-link">Account ▾</span>

          {open && (
            <div className="dropdown">
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
            </div>
          )}
        </div>
      </nav>

      {/* POPUP MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setModal(null)}>
              ✕
            </button>

            {modal === "login" && <LoginForm />}
            {modal === "register" && <UserRegistration />}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
