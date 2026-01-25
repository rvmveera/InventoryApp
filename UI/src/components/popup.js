// Popup.js
import React from "react";
import "../css/popup.css";

const Popup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <button className="closeBtn" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};
/*
const styles = {
 /* overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", justifyContent: "center", alignItems: "center"
  },*/
  /*popup: {
    background: "#fff", padding: "20px", borderRadius: "8px", minWidth: "300px",
    position: "relative"
  },
  closeBtn: {
    position: "absolute", top: "10px", right: "10px", cursor: "pointer"
  }
};*/

export default Popup;