import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModel";
import SignupModal from "./SignupModel";
import "../styles/Home.css";

const socket = io(process.env.REACT_APP_BACKEND_URL);

const Home = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchFeaturedRestaurants = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/restaurants`
      );
      const featured = res.data.filter((r) => r.isFeatured);
      setRestaurants(featured);
    } catch (err) {
      console.error(err);
      setError("Failed to load featured restaurants");
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchFeaturedRestaurants().finally(() => setLoading(false));

    socket.on("featured_restaurant_updated", fetchFeaturedRestaurants);
    socket.on("restaurant_deleted", (data) => {
      setRestaurants((prev) =>
        prev.filter((r) => r.id !== data.restaurantId)
      );
    });

    return () => {
      socket.off("featured_restaurant_updated");
      socket.off("restaurant_deleted");
    };
  }, []);

  if (loading) return <p>Loading featured restaurants...</p>;
  if (error) return <p>{error}</p>;

  const offers = [
    { id: 1, title: "Flat 50% Off on First Order", code: "WELCOME50" },
    { id: 2, title: "Free Delivery Above ₹299", code: "FREEDLVY" },
    { id: 3, title: "Buy 1 Get 1 Free on Pizza", code: "PIZZA1FREE" },
  ];

  return (
    <div className="home-container">
      <div className="hero">
        <div className="hero-content">
          <h1>Delicious Food, Delivered Fast 🍔</h1>
          <p>Order from top restaurants near you and enjoy hot meals at your doorstep!</p>
          <button
            className="explore-btn"
            onClick={() => navigate("/restaurants")}
          >
            Explore Restaurants
          </button>
        </div>
      </div>

      <section className="restaurant-section">
        <h2>Featured Restaurants</h2>
        <div className="restaurant-cards">
          {restaurants.slice(0, 3).map((r) => (
            <div
              className="restaurant-card"
              key={r.id}
              onClick={() => navigate(`/restaurants/${r.id}`)}
              style={{ cursor: "pointer" }}
            >
              {r.image && (
                <img
                  src={r.image}
                  alt={r.name}
                  style={{ width: "100%", height: "150px", objectFit: "cover" }}
                />
              )}
              <h3>{r.name}</h3>
              <p>{r.category}</p>
              <button>View Items</button>
            </div>
          ))}
        </div>
      </section>

      <section className="offers-section">
        <h2>Special Offers</h2>
        <div className="offers-list">
          {offers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <h3>{offer.title}</h3>
              <p>Use Code: <strong>{offer.code}</strong></p>
            </div>
          ))}
        </div>
      </section>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
    </div>
  );
};

export default Home;
