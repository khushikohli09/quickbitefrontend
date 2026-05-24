      {/* ── PROMO BANNER ── */}

      <div className="promo-banner">

        <div className="promo-text">

          <h3>
            🎉 New User? Get 50% Off
            Your First Order
          </h3>

          <p>
            Sign up today and enjoy
            your favourite food at
            half the price!
          </p>

        </div>

        <button
          className="promo-cta"
          onClick={() =>
            navigate("/signup")
          }
        >
          Claim Offer
        </button>

      </div>

      {/* ── OFFERS ── */}

      <section className="offers-section">

        <div className="section-header">
          <h2>
            Special <em>Offers</em>
          </h2>
        </div>

        <div className="offers-list">

          {offers.map((offer) => (
            <div
              key={offer.id}
              className="offer-card"
            >

              <h3>
                {offer.title}
              </h3>

              <p>
                Use Code:{" "}
                <strong>
                  {offer.code}
                </strong>
              </p>

            </div>
          ))}

        </div>

      </section>

      {/* ── HOW IT WORKS ── */}

      <section className="how-section">

        <div className="section-header">
          <h2>
            How It <em>Works</em>
          </h2>
        </div>

        <div className="steps-grid">

          {steps.map((s, i) => (
            <div
              key={i}
              className="step-card"
            >

              <div className="step-number">
                {i + 1}
              </div>

              <div className="step-icon">
                {s.icon}
              </div>

              <h4>
                {s.title}
              </h4>

              <p>
                {s.desc}
              </p>

            </div>
          ))}

        </div>

      </section>

      {/* ── TESTIMONIALS ── */}

      <section className="testimonials-section">

        <div className="section-header">
          <h2>
            What Our{" "}
            <em>Customers</em> Say
          </h2>
        </div>

        <div className="testimonials-grid">

          {testimonials.map((t, i) => (
            <div
              key={i}
              className="testimonial-card"
            >

              <div className="stars">
                {"★".repeat(t.stars)}
                {"☆".repeat(
                  5 - t.stars
                )}
              </div>

              <blockquote>
                "{t.quote}"
              </blockquote>

              <div className="reviewer">

                <div className="reviewer-avatar">
                  {t.name.charAt(0)}
                </div>

                <div className="reviewer-info">

                  <strong>
                    {t.name}
                  </strong>

                  <span>
                    {t.city}
                  </span>

                </div>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* ── APP DOWNLOAD BANNER ── */}

      <div className="app-banner">

        <div className="app-banner-text">

          <h3>
            📱 Get the QuickBite App
          </h3>

          <p>
            Exclusive app-only deals.
            Track orders in real-time.
            Reorder in one tap.
          </p>

        </div>

        <div className="app-badges">

          <div className="app-badge">
            <span className="badge-icon">
              🍎
            </span>
            App Store
          </div>

          <div className="app-badge">
            <span className="badge-icon">
              🤖
            </span>
            Google Play
          </div>

        </div>

      </div>

      {/* ── MODALS ── */}

      {showLogin && (
        <LoginModal
          onClose={() =>
            setShowLogin(false)
          }
        />
      )}

      {showSignup && (
        <SignupModal
          onClose={() =>
            setShowSignup(false)
          }
        />
      )}

      {/* ── CHATBOT ── */}

      <ChatbotButton />

      {/* ── FOOTER ── */}

      <footer className="footer">

        <div className="footer-container">

          <div className="footer-left">

            <h2>
              QuickBite 🍔
            </h2>

            <p>
              Delicious food delivered
              fast to your doorstep.
              Quality meals, every
              time.
            </p>

            <div className="footer-social">

              <div className="social-dot">
                𝕏
              </div>

              <div className="social-dot">
                f
              </div>

              <div className="social-dot">
                in
              </div>

              <div className="social-dot">
                📸
              </div>

            </div>

          </div>

          <div className="footer-links">

            <h4>
              Quick Links
            </h4>

            <p
              onClick={() =>
                navigate("/")
              }
            >
              Home
            </p>

            <p
              onClick={() =>
                navigate(
                  "/restaurants"
                )
              }
            >
              Restaurants
            </p>

            <p>
              Orders
            </p>

            <p>
              About Us
            </p>

          </div>

          <div className="footer-contact">

            <h4>
              Contact
            </h4>

            <p>
              📞 +91 98765 43210
            </p>

            <p>
              📧 support@quickbite.com
            </p>

            <p>
              📍 India
            </p>

          </div>

        </div>

        <div className="footer-bottom">

          <p>
            ©{" "}
            {new Date().getFullYear()}
            {" "}
            QuickBite. All rights
            reserved.
          </p>

        </div>

      </footer>

    </div>
  );
};

export default Home;
