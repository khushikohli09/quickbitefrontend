import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../styles/Auth.css";
import api from "../api/api";

const LoginModal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  const navigate = useNavigate();
  const { user, setUserAndStorage, loading } = useContext(UserContext);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "vendor") navigate("/vendor/dashboard");
      else navigate("/");
    }
  }, [user, loading, navigate]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoadingLogin(true);

  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    setUserAndStorage(res.data.user, res.data.token);
  } catch (err) {
    setError(
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Something went wrong. Please try again."
    );
  } finally {
    setLoadingLogin(false);
  }
}; 

  if (loading) return <p>Loading...</p>;

  return (
    <div className="auth-page">

      {/* ✅ SAME FLOATING BACKGROUND */}
      <div className="floating-icons">
        <span>🍔</span>
        <span>🍕</span>
        <span>🍜</span>
        <span>🍣</span>
        <span>🍟</span>
        <span>🍩</span>
        <span>🌮</span>
        <span>🍔</span>
      </div>

      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <p className="auth-subtitle">
          Welcome back! Please login to continue.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
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

          <button type="submit" className="auth-btn" disabled={loadingLogin}>
            {loadingLogin ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
