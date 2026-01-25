
import React, { useState } from "react";

export default function RegistrationForm() {
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
    //resume: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Build the payload to match your DTO
  const payload = {
    FirstName: form.FirstName,
    LastName: form.LastName,
    EmailId: form.EmailId,
    PhoneNumber: form.PhoneNumber,
    Username: form.Username,
    Password : form.Password,
    ConfirmPassword : form.ConfirmPassword,
    Address1: form.Address1,
    Address2: form.Address2,
    Address3: form.Address3,
    UserTypeId: form.UserTypeId,   // must be number if your DTO expects int
    DateOfBirth: form.DateOfBirth, // e.g. "2026-01-13"
    Gender: form.Gender,
    GST: form.GST,
    Aadhaar : form.Aadhaar
  };

  try {
    const res = await fetch("https://localhost:5001/api/Users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
      
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Registration failed: ${errText}`);
    }

    const data = await res.json();
    alert(`User ${data.username} registered successfully!`);
  } catch (err) {
    console.error("Error:", err);
    alert("Error: " + err.message);
  }
};

  return (
 

    <div className="form-container">
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>

        <input name="FirstName" placeholder="First Name" value={form.FirstName} onChange={handleChange} />
        <input name="LastName" placeholder="Last Name" value={form.LastName} onChange={handleChange} />
        <input name="EmailId" type="email" placeholder="Email" value={form.EmailId} onChange={handleChange} />
        <input name="PhoneNumber" placeholder="Phone Number" value={form.PhoneNumber} onChange={handleChange} />
        <input name="Username" placeholder="Username" value={form.Username} onChange={handleChange} />
        <input name="Password" type="password" placeholder="Password" value={form.Password} onChange={handleChange} />
        <input name="ConfirmPassword" type="password" placeholder="Confirm Password" value={form.ConfirmPassword} onChange={handleChange} />
        <input name="Address1" placeholder="Address Line 1" value={form.Address1} onChange={handleChange} />
        <input name="Address2" placeholder="Address line 2" value={form.Address2} onChange={handleChange} />
        <input name="Address3" placeholder="Address line 3" value={form.Address3} onChange={handleChange} />
        <select name="UserTypeId" value={form.UserTypeId} onChange={handleChange}>
          <option value="0">--Select user type--</option>
          <option value="1">Admin</option>
          <option value="2">Staff</option>
          <option value="3">Manager</option>
<option value="4">Customer</option>
<option value="5">Vendor</option>



        </select>

        <input name="Aadhaar" placeholder="Aadhaar (optional)" value={form.Aadhaar} onChange={handleChange} />
        <input name="DateOfBirth" type="date" value={form.DateOfBirth} onChange={handleChange} />

        <select name="Gender" value={form.Gender} onChange={handleChange}>
          <option value="0">--Gender--</option>
          <option value="1">Male</option>
          <option value="2">Female</option>
          <option value="3">NA</option>
        </select>

        <input name="GST" placeholder="GST" value={form.GST} onChange={handleChange} />

        <label>Resume Upload (optional)</label>
        <input type="file" onChange={handleFileChange} />

        <button type="submit">Register</button>
      </form>
    </div>
    
  );
}