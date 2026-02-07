

import { useState } from "react";
import "../css/login.css";

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({
    Username: "",
    Password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // call parent login handler if needed
    if (onLogin) onLogin(form);
    console.log("Login submitted", form);
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-container">
          <input
            type="text"
            name="Username"
            placeholder="Username"
            value={form.Username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="Password"
            placeholder="Password"
            value={form.Password}
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
