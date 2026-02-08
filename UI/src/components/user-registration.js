
import React, { useState } from "react";


const UserRegistration = ({ onSuccess }) => {
  const [form, setForm] = useState({

    FirstName: "",
    LastName: "",
    EmailId: "",
    PhoneNumber: "",
    Username: "",
    Password: "",
    ConfirmPassword: "",
    Address1: "",
    Address2: "",
    Address3: "",
    UserTypeId: "",
    Aadhaar: "",
    DateOfBirth: "",
    Gender: "Male",
    GST: "",
    resume: null
  });
  const [file, setFile] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /*
    const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };*/




const handleSubmit = async (e) => {
  e.preventDefault();

  // Build FormData instead of JSON
  const data = new FormData();

  // Append all text fields
  data.append("FirstName", form.FirstName);
  data.append("LastName", form.LastName);
  data.append("EmailId", form.EmailId);
  data.append("PhoneNumber", form.PhoneNumber);
  data.append("Username", form.Username);
  data.append("Password", form.Password);
  data.append("ConfirmPassword", form.ConfirmPassword);
  data.append("Address1", form.Address1);
  data.append("Address2", form.Address2);
  data.append("Address3", form.Address3);
  data.append("UserTypeId", form.UserTypeId);
  data.append("DateOfBirth", form.DateOfBirth);
  data.append("Gender", form.Gender);
  data.append("GST", form.GST);
  data.append("Aadhaar", form.Aadhaar);

  // Append file (assuming you stored it in state as form.File)
  if (file) {
  data.append("Resume", file); // must match DTO property name
}else {
  data.append("Resume", null);
}


  try {
    const res = await fetch("https://localhost:5001/api/Users/register", {
      method: "POST",
      body: data
      // ⚠️ Do NOT set Content-Type manually; browser will set it with boundary
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Registration failed: ${errText}`);
    }

    const result = await res.json();
    alert(`User ${result.username} registered successfully!`);

    // 🔥 Tell parent to close modal
  if (onSuccess) {
    onSuccess();
  }

    
  } catch (err) {
    console.error("Error:", err);
    alert("Error: " + err.message);
  }
};

  return (    
    <div>
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
<div className="form-container">
        <input name="FirstName" placeholder="First Name" value={form.FirstName} onChange={handleChange} required />
        <input name="LastName" placeholder="Last Name" value={form.LastName} onChange={handleChange} required />
        <input name="EmailId" type="email" placeholder="Email" value={form.EmailId} onChange={handleChange} required />
        <input name="PhoneNumber" placeholder="Phone Number" value={form.PhoneNumber} onChange={handleChange} required />
        <input name="Username" placeholder="Username" value={form.Username} onChange={handleChange} required />
        <input name="Password" type="password" placeholder="Password" value={form.Password} onChange={handleChange} required />
        <input name="ConfirmPassword" type="password" placeholder="Confirm Password" value={form.ConfirmPassword} onChange={handleChange} required />
        <input name="Address1" placeholder="Address Line 1" value={form.Address1} onChange={handleChange} required />
        <input name="Address2" placeholder="Address line 2" value={form.Address2} onChange={handleChange} required />
        <input name="Address3" placeholder="Address line 3" value={form.Address3} onChange={handleChange} required />
        <select name="UserTypeId" value={form.UserTypeId} onChange={handleChange} required >
          <option value="0">--Select user type--</option>
          <option value="1">Admin</option>
          <option value="2">Staff</option>
          <option value="3">Manager</option>
<option value="4">Customer</option>
<option value="5">Vendor</option>



        </select>

        <input name="Aadhaar" placeholder="Aadhaar" value={form.Aadhaar} onChange={handleChange} required/>
        <input name="DateOfBirth" type="date" value={form.DateOfBirth} onChange={handleChange} required />

        <select name="Gender" value={form.Gender} onChange={handleChange} required >
          <option value="0">--Gender--</option>
          <option value="1">Male</option>
          <option value="2">Female</option>
          <option value="3">NA</option>
        </select>

        <input name="GST" placeholder="GST (optional)" value={form.GST} onChange={handleChange} />

        <label>Resume Upload (optional)</label>
     <input type="file" onChange={(e) => setFile(e.target.files[0])} />


</div>
        <button type="submit">Register</button>
      </form>
    </div>
    
  );
};
export default UserRegistration;