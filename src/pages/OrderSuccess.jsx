import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../Socket";
import { UserContext } from "../context/UserContext";
import api from "../api/api";
import "../styles/OrderSuccess.css";

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const userName = state?.userName || user?.name || "User";
  const totalAmount = state?.total || state?.amount || 0;

  const [orderStatus, setOrderStatus] = useState("Pending");
  const [notification, setNotification] = useState("");
  const [backendTotal, setBackendTotal] = useState(totalAmount);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    // ---------------- FETCH LATEST ORDER ----------------
    const fetchLatestOrder = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return;

        const res = await api.get("/users/me/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const orders = res.data || [];
        if (orders.length > 0) {
          const latestOrder = orders[0];
          setOrderStatus(latestOrder.status || "Pending");
          if (latestOrder.total) setBackendTotal(latestOrder.total);
        }
        setLoading(false);
      } catch (err) {
        console.error("❌ Order fetch failed:", err);
        setLoading(false);
      }
    };

    fetchLatestOrder();
    const interval = setInterval(fetchLatestOrder, 5000);

    // ---------------- SOCKET ----------------
    if (socket && !socket.connected) {
      socket.connect();
    }

    if (socket && user?.id) {
      socket.emit("register", {
        userId: user.id,
        role: "USER",
      });

      const handleStatusUpdate = (updatedOrder) => {
        console.log("📦 Status update received:", updatedOrder);
        setOrderStatus(updatedOrder.status);

        if (updatedOrder.status === "Confirmed") {
          setNotification("✅ Your order has been confirmed by the restaurant!");
        } else if (updatedOrder.status === "Preparing") {
          setNotification("🍳 Your order is being prepared!");
        } else if (updatedOrder.status === "Ready to Deliver") {
          setNotification("🚚 Your order is out for delivery!");
        } else if (updatedOrder.status === "Delivered") {
          setNotification("🎉 Your order has been delivered! Enjoy your meal!");
        } else if (updatedOrder.status === "Cancelled") {
          setNotification("❌ Your order was cancelled.");
        }

        setTimeout(() => setNotification(""), 5000);
      };

      socket.on("order-status-updated", handleStatusUpdate);

      return () => {
        clearInterval(interval);
        socket.off("order-status-updated", handleStatusUpdate);
      };
    }

    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className="success-page">
        <h1>🎉 Order Successful!</h1>
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="success-page">
      <h1>🎉 Order Successful!</h1>

      <p>
        Thank you, <strong>{userName}</strong>! Your order was placed successfully.
      </p>

      {backendTotal !== null && backendTotal > 0 && (
        <h3>Total Paid: ₹{backendTotal}</h3>
      )}

      <h2 className="status-text">Current Status: {orderStatus}</h2>

      {notification && (
        <div className="ready-notification">
          {notification}
        </div>
      )}

      <button onClick={() => navigate("/")} className="home-btn">
        🏠 Back to Home
      </button>
    </div>
  );
}
