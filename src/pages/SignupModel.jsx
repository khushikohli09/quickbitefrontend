import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import api from "../api/api";

const SignupModal = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  try {
    await api.post("/auth/signup", {
      name,
      email,
      password,
      role,
    });

    setSuccess("Signup successful! Redirecting to login...");

    setTimeout(() => navigate("/login"), 1500);
  } catch (err) {
    setError(
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Something went wrong. Please try again."
    );
  }
};
  return (
    <div className="auth-page">

      {/* ✅ FULL BACKGROUND FLOATERS */}
      <div className="floating-icons">
        <span>🍔</span>
        <span>🍕</span>
        <span>🍜</span>
        <span>🍣</span>
        <span>🍟</span>
        <span>🍩</span>
        <span>🌮</span>
        <span>🍔</span>
        <span>🍕</span>
        <span>🍜</span>
      </div>

      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">
          Get started and enjoy your favorite meals 🍔
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="USER">User</option>
            <option value="VENDOR">Vendor</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button type="submit" className="auth-btn">
            Sign Up
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupModal;
