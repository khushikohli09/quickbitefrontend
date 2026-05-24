import React, { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../Socket";
import { useNavigate } from "react-router-dom";
import LoginModal from "./Login";
import SignupModal from "./Signup";
import ChatbotButton from "../components/ChatbotButton";
import "../styles/Home.css";

const Home = () => {

  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // AI STATES
  const [budget, setBudget] = useState("");
  const [mood, setMood] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  // API URL
  const API_URL =
    process.env.REACT_APP_BACKEND_URL ||
    "http://localhost:5000";

  // FETCH FEATURED RESTAURANTS
  const fetchFeaturedRestaurants = async () => {
    try {

      const res = await axios.get(
        `${API_URL}/api/admin/restaurants`
      );

      const featured =
        res.data.filter(
          (r) => r.isFeatured
        );

      setRestaurants(featured);

    } catch (err) {

      console.error(err);

      setError(
        "Failed to load featured restaurants"
      );

    }
  };

  // SOCKET
  useEffect(() => {

    setLoading(true);

    fetchFeaturedRestaurants()
      .finally(() =>
        setLoading(false)
      );

    if (!socket.connected) {
      socket.connect();
    }

    socket.on(
      "featured_restaurant_updated",
      fetchFeaturedRestaurants
    );

    socket.on(
      "restaurant_deleted",
      (data) => {

        setRestaurants((prev) =>
          prev.filter(
            (r) =>
              r.id !==
              data.restaurantId
          )
        );

      }
    );

    return () => {

      socket.off(
        "featured_restaurant_updated"
      );

      socket.off(
        "restaurant_deleted"
      );

    };

  }, []);

  // IMAGE HELPER
  const getImageUrl = (img) => {

    if (!img) return null;

    if (img.startsWith("http")) {
      return img;
    }

    return `${API_URL}/uploads/${img}`;

  };

  // AI RECOMMENDATION
  const getRecommendations =
    async () => {

      try {

        if (!budget && !mood) {
          return;
        }

        setAiLoading(true);

        const res =
          await axios.post(
            `${API_URL}/api/chat/recommend`,
            {
              budget: budget
                ? Number(budget)
                : null,

              mood,
            }
          );

        setRecommendations(
          res.data.recommendations ||
            []
        );

      } catch (err) {

        console.error(err);

        setRecommendations([]);

      } finally {

        setAiLoading(false);

      }

    };

  if (loading) {
    return (
      <p>
        Loading featured restaurants...
      </p>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  // OFFERS
  const offers = [
    {
      id: 1,
      title:
        "Flat 50% Off on First Order",
      code: "WELCOME50",
    },

    {
      id: 2,
      title:
        "Free Delivery Above ₹299",
      code: "FREEDLVY",
    },

    {
      id: 3,
      title:
        "Buy 1 Get 1 Free on Pizza",
      code: "PIZZA1FREE",
    },
  ];

  // WHY US
  const whyUs = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      desc:
        "Average delivery in under 30 minutes, guaranteed fresh.",
    },

    {
      icon: "🍽️",
      title: "500+ Restaurants",
      desc:
        "From local dhabas to premium dining — all in one place.",
    },

    {
      icon: "💸",
      title: "Best Prices",
      desc:
        "Daily deals and exclusive offers save you money every order.",
    },

    {
      icon: "🛡️",
      title: "Safe & Hygienic",
      desc:
        "Every partner restaurant is quality-checked and certified.",
    },
  ];

  // STEPS
  const steps = [
    {
      icon: "📍",
      title: "Choose Location",
      desc:
        "Set your delivery address to see restaurants near you.",
    },

    {
      icon: "🍽️",
      title: "Pick a Restaurant",
      desc:
        "Browse menus from top-rated places in your area.",
    },

    {
      icon: "🛒",
      title: "Add to Cart",
      desc:
        "Select your favourite dishes and customise your order.",
    },

    {
      icon: "🚀",
      title: "Fast Delivery",
      desc:
        "Sit back — your food arrives hot at your door.",
    },
  ];

  // TESTIMONIALS
  const testimonials = [
    {
      name: "Anika Sharma",
      city: "Mumbai",
      quote:
        "Quickest delivery I've ever had. Food arrived piping hot in under 30 minutes!",
      stars: 5,
    },

    {
      name: "Ravi Mehta",
      city: "Bangalore",
      quote:
        "The variety of restaurants is incredible. Found my new favourite biryani spot here.",
      stars: 5,
    },

    {
      name: "Priya K.",
      city: "Delhi",
      quote:
        "Super easy to use app. The offers save me money every single week.",
      stars: 4,
    },
  ];

  return (

    <div className="home-container">

      {/* HERO */}
      <div className="hero">

        <div className="hero-content">

          <h1>
            Discover{" "}
            <span>
              Top Rated
            </span>{" "}
            Food 🍽️
          </h1>

          <p>
            Fast delivery • Best deals
            near you
          </p>

          <button
            className="explore-btn"
            onClick={() =>
              navigate(
                "/restaurants"
              )
            }
          >
            Explore Restaurants
          </button>

        </div>

      </div>

      {/* AI SECTION */}
      <section className="ai-section">

        <div className="section-header">

          <h2>
            🤖 AI Recommend For You
          </h2>

        </div>

        <div className="ai-input-box">

          <input
            className="ai-input"
            placeholder="Enter budget (e.g. 150)"
            value={budget}
            onChange={(e) =>
              setBudget(
                e.target.value
              )
            }
          />

          <input
            className="ai-input"
            placeholder="Mood (spicy / sweet / light)"
            value={mood}
            onChange={(e) =>
              setMood(
                e.target.value
              )
            }
          />

          <button
            className="ai-btn"
            onClick={
              getRecommendations
            }
          >
            {aiLoading
              ? "Thinking..."
              : "Get Recommendations"}
          </button>

        </div>

        <div className="restaurant-cards">

          {!aiLoading &&
            recommendations.length ===
              0 && (
              <p
                style={{
                  textAlign:
                    "center",
                  marginTop:
                    "10px",
                }}
              >
                🍽️ Enter your mood &
                budget to get AI
                recommendations
              </p>
            )}

          {aiLoading && (
            <p
              style={{
                textAlign:
                  "center",
              }}
            >
              🍳 Cooking your
              recommendations...
            </p>
          )}

          {recommendations.map(
            (item, i) => (

              <div
                key={i}
                className="restaurant-card"
              >

                <div className="card-img-wrapper">

                  {item.image ? (
                    <img
                      src={getImageUrl(
                        item.image
                      )}
                      alt={item.name}
                    />
                  ) : (
                    <span>
                      🍽️
                    </span>
                  )}

                </div>

                <div className="card-body">

                  <h3>
                    {item.name}
                  </h3>

                  <p className="category-tag">
                    {item.restaurant}
                  </p>

                  <p>
                    ₹{item.price}
                  </p>

                  {item.reason && (
                    <small
                      style={{
                        color:
                          "#888",
                      }}
                    >
                      {item.reason}
                    </small>
                  )}

                  <button
                    onClick={() =>
                      navigate(
                        "/restaurants"
                      )
                    }
                  >
                    Order Now
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </section>

      {/* WHY SECTION */}
      <section className="why-section">

        <div className="section-header">

          <h2>
            Why{" "}
            <em>
              QuickBite?
            </em>
          </h2>

        </div>

        <div className="why-grid">

          {whyUs.map((w, i) => (

            <div
              key={i}
              className="why-card"
            >

              <div className="why-icon">
                {w.icon}
              </div>

              <h4>{w.title}</h4>

              <p>{w.desc}</p>

            </div>

          ))}

        </div>

      </section>

      {/* CHATBOT */}
      <ChatbotButton />

    </div>

  );

};

export default Home;
