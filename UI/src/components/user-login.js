import { useState } from "react";
import "../css/login.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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

      // ✅ Store JWT
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.username);
toast.success("Login successful 🎉", {
  
  onClose: () => {
    // close popup only after toast disappears
    if (onLoginSuccess) onLoginSuccess(result);
  }
});

    } catch (err) {
  console.error("Login error:", err);
  toast.error(err.message, { position: "top-center" });
}

  };

  return (
    <div className="login-modal">
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
        <button type="submit" className="btn-primary">Login</button>
      </form>
      {/* Toast notifications container */}
     <ToastContainer
  position="center"
  autoClose={1000}        // toast closes after 3 seconds
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  pauseOnHover={false}    // ✅ don’t pause when hovering
  pauseOnFocusLoss={false} // ✅ don’t pause when window loses focus
  draggable
/>


    </div>
  );
}

export default LoginForm;
