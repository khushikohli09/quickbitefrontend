import React, { useState, useEffect } from "react";
import api from "../api/api";
import "../styles/Admin.css";

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/restaurants");
      setRestaurants(res.data);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const toggleFeatured = async (restaurant) => {
    try {
      await api.post("/admin/featured-restaurants", {
        id: restaurant.id,
        isFeatured: !restaurant.isFeatured,
      });
      fetchRestaurants();
    } catch (err) {
      console.error("Error toggling featured:", err);
    }
  };

  const deleteRestaurant = async (restaurantId) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) return;
    try {
      await api.delete(`/admin/restaurants/${restaurantId}`);
      fetchRestaurants();
    } catch (err) {
      console.error("Error deleting restaurant:", err);
    }
  };

  if (loading) return <p>Loading restaurants...</p>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <h2>Restaurants Overview</h2>

      <div className="restaurant-list">
        {restaurants.length === 0 && <p>No restaurants found.</p>}

        {restaurants.map((r) => (
          <div key={r.id} className="restaurant-card">
            {r.image && (
              <img src={r.image} alt={r.name} className="restaurant-image" />
            )}
            <div className="restaurant-details">
              <h3>{r.name}</h3>
              <p>Category: {r.category}</p>
              <p>
                Featured: <strong>{r.isFeatured ? "Yes" : "No"}</strong>
              </p>
            </div>
            <div className="restaurant-actions">
              <button
                className={`featured-btn ${r.isFeatured ? "active" : ""}`}
                onClick={() => toggleFeatured(r)}
              >
                {r.isFeatured ? "Unmark Featured" : "Mark Featured"}
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteRestaurant(r.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
