import React, { useEffect, useState, useContext } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import { UserContext } from "../context/UserContext";
import api from "../api/api";
import { socket } from "../Socket";

import "../styles/Vendor.css";

const VendorAnalytics = () => {
  const { user } = useContext(UserContext);

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetchAnalytics();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if (!socket.connected) socket.connect();

    socket.emit("register", {
      userId: user.id || user._id,
      role: user.role?.toUpperCase(),
    });

    const handleStatusChange = () => {
      fetchAnalytics();
    };

    socket.on("order-status-changed", handleStatusChange);

    return () => {
      socket.off("order-status-changed", handleStatusChange);
    };
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");

      const vendorId = user?.id || user?._id;

      const res = await api.get(
        `/vendor/analytics?vendorId=${vendorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalytics(res.data);
    } catch (err) {
      console.error("Analytics Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-loader">
        Loading Analytics...
      </div>
    );
  }

  const stats = analytics?.stats || {};

  const salesData = analytics?.weeklySales || [];

  const orderData = analytics?.orderStatus || [];

  const topItems = analytics?.topItems || [];

  const COLORS = [
    "#ff6b2c",
    "#4caf50",
    "#2196f3",
    "#ff9800",
    "#9c27b0",
  ];

  const STATUS_COLORS = {
    Confirmed: "#ff6b2c",
    Preparing: "#4caf50",
    Delivered: "#2196f3",
  };

  return (
    <div className="vendor-analytics">

      {/* HEADER */}
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
      </div>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stat-card">
          <h3>Revenue</h3>
          <p>₹{stats.totalRevenue || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Confirmed</h3>
          <p>{stats.confirmedOrders || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Delivered</h3>
          <p>{stats.deliveredOrders || 0}</p>
        </div>

      </div>

      {/* CHARTS */}
      <div className="charts-grid">

        {/* REVENUE CHART */}
        <div className="chart-card">

          <h2>Weekly Revenue</h2>

          {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="day" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ff6b2c"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">
              No revenue data available
            </div>
          )}

        </div>

        {/* ORDER STATUS */}
        <div className="chart-card">

          <h2>Order Status</h2>

          {orderData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>

                <Pie
                  data={orderData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {orderData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        STATUS_COLORS[entry.name] ||
                        COLORS[index % COLORS.length]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">
              No order data available
            </div>
          )}

        </div>

      </div>

      {/* TOP ITEMS */}
      <div className="chart-card full-width">

        <h2>Top Selling Items</h2>

        {topItems.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topItems}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="orders"
                fill="#ff6b2c"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-chart">
            No top items found
          </div>
        )}

      </div>

    </div>
  );
};

export default VendorAnalytics;
