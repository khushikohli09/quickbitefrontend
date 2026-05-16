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

  const orderId = state?.orderId || "";
  const userName = state?.userName || user?.name || "User";

  const [orderStatus, setOrderStatus] = useState("Pending");
  const [notification, setNotification] = useState("");
  const [backendTotal, setBackendTotal] = useState(null);

  useEffect(() => {
    if (!user?.id || !orderId) return;

    // ---------------- FETCH ORDER ----------------
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await api.get(`/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        if (data.status) setOrderStatus(data.status);
        if (data.total) setBackendTotal(data.total);
      } catch (err) {
        console.error("❌ Order fetch failed:", err);
      }
    };

    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 5000);

    // ---------------- SOCKET ----------------
    if (!socket.connected) socket.connect();

    socket.emit("register", {
      userId: user.id,
      role: "USER",
    });

    // ✅ FIXED: Listen to backend's actual events
    const handleStatusUpdate = (updatedOrder) => {
      console.log("📦 Status update received:", updatedOrder);
      
      // Check if this update is for our order
      if (updatedOrder.id === Number(orderId) || updatedOrder.orderId === Number(orderId)) {
        setOrderStatus(updatedOrder.status);
        
        // Show appropriate notifications based on status
        if (updatedOrder.status === "Confirmed") {
          setNotification(`✅ Order #${orderId} confirmed by restaurant!`);
        } else if (updatedOrder.status === "Ready to Deliver") {
          setNotification(`🚚 Order #${orderId} is ready to deliver!`);
        } else if (updatedOrder.status === "Delivered") {
          setNotification(`🎉 Order #${orderId} has been delivered! Enjoy your meal!`);
        } else if (updatedOrder.status === "Cancelled") {
          setNotification(`❌ Order #${orderId} was cancelled.`);
        }
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => setNotification(""), 5000);
      }
    };

    // Listen to the event your backend actually emits
    socket.on("order-status-updated", handleStatusUpdate);

    return () => {
      clearInterval(interval);
      socket.off("order-status-updated", handleStatusUpdate);
    };
  }, [user, orderId]);

  // Helper function for status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "#ffc107";
      case "confirmed": return "#17a2b8";
      case "preparing": return "#6f42c1";
      case "ready to deliver": return "#28a745";
      case "delivered": return "#6c757d";
      default: return "#007bff";
    }
  };

  return (
    <div className="success-page">
      <h1>🎉 Order Successful!</h1>

      <p>
        Thank you, <strong>{userName}</strong>! Your order #{orderId} was placed successfully.
      </p>

      {backendTotal !== null && (
        <h3>Total Paid: ₹{backendTotal}</h3>
      )}

      <div className="status-container">
        <h2>
          Current Status:{" "}
          <span style={{ color: getStatusColor(orderStatus) }}>
            {orderStatus}
          </span>
        </h2>
        
        {/* Status progress bar */}
        <div className="status-progress">
          <div className={`status-step ${orderStatus === "Pending" ? "active" : orderStatus !== "Pending" ? "completed" : ""}`}>
            📝 Pending
          </div>
          <div className={`status-step ${orderStatus === "Confirmed" ? "active" : orderStatus === "Ready to Deliver" || orderStatus === "Delivered" ? "completed" : ""}`}>
            ✅ Confirmed
          </div>
          <div className={`status-step ${orderStatus === "Ready to Deliver" ? "active" : orderStatus === "Delivered" ? "completed" : ""}`}>
            🚀 Ready to Deliver
          </div>
          <div className={`status-step ${orderStatus === "Delivered" ? "active" : ""}`}>
            🍽️ Delivered
          </div>
        </div>
      </div>

      {notification && (
        <div className="ready-notification">
          {notification}
        </div>
      )}

      <button onClick={() => navigate("/")} className="home-btn">
        Back to Home
      </button>
      
      <button onClick={() => navigate("/orders")} className="orders-btn">
        View All Orders
      </button>
    </div>
  );
}
