

import { useState } from "react";
import "../css/login.css";

function LoginForm({ onLoginSuccess }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("https://localhost:5001/api/Auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: form.username,
        password: form.password
      })
    });

    if (!res.ok) {
      throw new Error("Invalid username or password");
    }

    const result = await res.json();

    // ✅ Store JWT (important)
    localStorage.setItem("token", result.token);
    localStorage.setItem("username", result.username);

    console.log("Login successful:", result);

    alert("Login success :", result)

    // ✅ Notify parent if needed
    if (onLoginSuccess) {
      onLoginSuccess(result);
    }

  } catch (err) {
    console.error("Login error:", err);
    alert(err.message);
  }
};
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-container">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
