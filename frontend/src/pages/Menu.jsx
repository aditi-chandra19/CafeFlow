import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";
import Toolbar from "../components/Toolbar";

function Menu() {
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.log(err));
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return (
      restaurant.name.toLowerCase().includes(query) ||
      (restaurant.cuisine || []).join(" ").toLowerCase().includes(query)
    );
  });

  return (
    <>
      <Toolbar />

      <div className="page-shell" style={{ background: "transparent" }}>
        <section
          className="glass-panel"
          style={{
            overflow: "hidden",
            borderRadius: "32px",
            padding: "clamp(24px, 4vw, 44px)",
            marginBottom: "28px",
            background:
              "linear-gradient(135deg, rgba(32, 22, 17, 0.94), rgba(66, 42, 27, 0.78)), radial-gradient(circle at top right, rgba(207, 176, 131, 0.2), transparent 28%)",
            color: "#fff8f1",
            animation: "floatUp 700ms ease both",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.5fr) minmax(280px, 0.9fr)",
              gap: "28px",
              alignItems: "end",
            }}
          >
            <div>
              <div style={heroTag}>Signature dining experiences</div>

              <h1 style={{ fontSize: "clamp(3rem, 8vw, 5.8rem)", lineHeight: 0.9 }}>
                Reserve the table
                <br />
                worth dressing up for.
              </h1>

              <p style={heroText}>
                Discover intimate tasting rooms, rooftop lounges, and chef-led
                supper spots designed for memorable evenings.
              </p>

              <div style={heroActions}>
                <button
                  className="luxury-button"
                  style={primaryHeroButton}
                  onClick={() => navigate("/book-table")}
                >
                  Reserve now
                </button>
                <button
                  className="luxury-button"
                  style={secondaryHeroButton}
                  onClick={() => window.scrollTo({ top: 560, behavior: "smooth" })}
                >
                  Explore venues
                </button>
              </div>
            </div>

            <div style={heroPanel}>
              <p style={heroPanelLabel}>Tonight's highlights</p>

              <div style={{ marginTop: "18px", display: "grid", gap: "16px" }}>
                {[
                  "Private dining alcoves",
                  "Sommelier pairing menus",
                  "Fastest seated check-in",
                ].map((item) => (
                  <div key={item} style={heroPanelItem}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel" style={searchPanel}>
          <div>
            <p style={eyebrow}>Curated venues</p>
            <h2 style={{ fontSize: "2.3rem", color: colors.text }}>
              Choose your next reservation
            </h2>
          </div>

          <div style={{ width: "min(100%, 360px)" }}>
            <input
              className="luxury-input"
              placeholder="Search cuisine, chef, or mood"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </section>

        <div style={cardGrid}>
          {filteredRestaurants.map((restaurant, index) => (
            <div
              key={restaurant._id}
              onClick={() => navigate(`/restaurant/${restaurant._id}`)}
              style={{
                ...restaurantCard,
                animation: `floatUp 600ms ease ${index * 80}ms both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 28px 56px rgba(45, 28, 17, 0.16)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 20px 46px rgba(45, 28, 17, 0.12)";
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  style={restaurantImage}
                />

                <div style={imageBadge}>
                  {restaurant.isOpen ? "Accepting bookings" : "Fully booked"}
                </div>
              </div>

              <div style={{ padding: "22px" }}>
                <div style={cardHeader}>
                  <div>
                    <h2 style={{ color: colors.text, fontSize: "2rem", marginBottom: "6px" }}>
                      {restaurant.name}
                    </h2>
                    <p style={{ color: colors.muted }}>
                      {(restaurant.cuisine || []).join(" • ") || "Modern dining"}
                    </p>
                  </div>

                  <div style={ratingPill}>{restaurant.rating} / 5</div>
                </div>

                <div style={detailGrid}>
                  <div style={detailItem}>
                    <span style={detailLabel}>Arrival</span>
                    <strong>{restaurant.deliveryTime}</strong>
                  </div>
                  <div style={detailItem}>
                    <span style={detailLabel}>Spend</span>
                    <strong>{restaurant.priceRange}</strong>
                  </div>
                </div>

                <div style={cardFooter}>
                  <p
                    style={{
                      fontWeight: "700",
                      color: restaurant.isOpen ? colors.success : "#b45145",
                    }}
                  >
                    {restaurant.isOpen ? "Open for premium seating" : "Closed right now"}
                  </p>
                  <span style={ctaLink}>View menu</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!filteredRestaurants.length && (
          <div className="glass-panel" style={emptyState}>
            <h3 style={{ fontSize: "2rem", color: colors.text }}>
              No matching restaurants found
            </h3>
            <p style={{ marginTop: "10px", color: colors.muted }}>
              Try a broader cuisine, neighborhood, or dining mood.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

const heroTag = {
  display: "inline-flex",
  padding: "8px 14px",
  borderRadius: "999px",
  marginBottom: "18px",
  border: "1px solid rgba(255, 248, 241, 0.18)",
  background: "rgba(255, 255, 255, 0.08)",
  textTransform: "uppercase",
  fontSize: "12px",
  letterSpacing: "0.18em",
};

const heroText = {
  maxWidth: "620px",
  marginTop: "18px",
  color: "rgba(255, 248, 241, 0.78)",
  fontSize: "1.05rem",
};

const heroActions = {
  display: "flex",
  gap: "14px",
  flexWrap: "wrap",
  marginTop: "28px",
};

const primaryHeroButton = {
  background: "#fff8f1",
  color: colors.text,
  boxShadow: "0 16px 30px rgba(0, 0, 0, 0.18)",
};

const secondaryHeroButton = {
  background: "transparent",
  color: "#fff8f1",
  border: "1px solid rgba(255, 248, 241, 0.22)",
};

const heroPanel = {
  borderRadius: "28px",
  padding: "22px",
  background: "rgba(255, 248, 241, 0.08)",
  border: "1px solid rgba(255, 248, 241, 0.12)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
};

const heroPanelLabel = {
  fontSize: "12px",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "rgba(255, 248, 241, 0.66)",
};

const heroPanelItem = {
  padding: "14px 16px",
  borderRadius: "18px",
  background: "rgba(255, 255, 255, 0.08)",
};

const searchPanel = {
  borderRadius: "28px",
  padding: "22px",
  marginBottom: "22px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "18px",
  flexWrap: "wrap",
};

const eyebrow = {
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  fontSize: "12px",
  color: colors.muted,
  marginBottom: "6px",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
  gap: "26px",
};

const restaurantCard = {
  background: "rgba(255, 250, 244, 0.88)",
  borderRadius: "28px",
  overflow: "hidden",
  cursor: "pointer",
  border: `1px solid ${colors.border}`,
  boxShadow: "0 20px 46px rgba(45, 28, 17, 0.12)",
  transition: "transform 180ms ease, box-shadow 180ms ease",
};

const restaurantImage = {
  width: "100%",
  height: "240px",
  objectFit: "cover",
};

const imageBadge = {
  position: "absolute",
  left: "18px",
  bottom: "18px",
  padding: "10px 14px",
  borderRadius: "999px",
  background: "rgba(32, 22, 17, 0.72)",
  color: "#fff8f1",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  alignItems: "start",
};

const ratingPill = {
  padding: "10px 12px",
  borderRadius: "16px",
  background: "rgba(207, 176, 131, 0.28)",
  color: colors.text,
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const detailGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "14px",
  marginTop: "20px",
};

const detailItem = {
  padding: "14px",
  borderRadius: "18px",
  background: "#fffdf9",
  border: `1px solid ${colors.border}`,
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  color: colors.text,
};

const detailLabel = {
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  color: colors.muted,
};

const cardFooter = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "18px",
  gap: "12px",
};

const ctaLink = {
  color: colors.primaryDark,
  fontWeight: "700",
};

const emptyState = {
  marginTop: "22px",
  borderRadius: "24px",
  padding: "30px",
  textAlign: "center",
};

export default Menu;
