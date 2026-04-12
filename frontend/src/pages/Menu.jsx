import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";
import Toolbar from "../components/Toolbar";
import { localRestaurants } from "../data/mockData";

function Menu() {
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(Array.isArray(data) ? data : []))
      .catch(() => setRestaurants([]));
  }, []);

  const allRestaurants = useMemo(() => {
    const merged = [...localRestaurants];
    restaurants.forEach((restaurant) => {
      if (!merged.find((item) => item._id === restaurant._id)) merged.push(restaurant);
    });
    return merged;
  }, [restaurants]);

  const filteredRestaurants = allRestaurants.filter((restaurant) => {
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
      <div className="page-shell">
        <div className="section-shell">
          <section className="hero-surface accent-outline" style={heroSection}>
            <div className="responsive-two-col" style={heroGrid}>
              <div>
                <p style={heroLabel}>Discover restaurants</p>
                <h1 style={heroTitle}>Pick your next meal from a marketplace that feels modern and premium.</h1>
                <p style={heroCopy}>
                  Search restaurants, compare delivery time, check spend level, and jump straight into menu or booking
                  without the cramped, old-looking UI.
                </p>

                <div style={heroActions}>
                  <button className="luxury-button" style={primaryButton} onClick={() => navigate("/book-table")}>
                    Reserve a table
                  </button>
                  <button className="luxury-button" style={darkButton} onClick={() => navigate("/cart")}>
                    Open cart
                  </button>
                </div>
              </div>

              <div style={heroSide}>
                <div style={heroStatCard}>
                  <span style={statLabel}>Active venues</span>
                  <strong style={statValue}>{allRestaurants.length}</strong>
                </div>
                <div style={heroStatCard}>
                  <span style={statLabel}>Core flow</span>
                  <strong style={statValue}>Explore, order, reserve, track</strong>
                </div>
                <div style={heroStatCard}>
                  <span style={statLabel}>Built in</span>
                  <strong style={statValue}>Indian menus, fees, discounts, multi-rider orders</strong>
                </div>
              </div>
            </div>
          </section>

          <section style={searchStrip}>
            <div>
              <p className="muted-kicker">Marketplace</p>
              <h2 style={sectionTitle}>Restaurants worth exploring</h2>
            </div>
            <div style={searchWrap}>
              <input
                className="luxury-input"
                placeholder="Search restaurant or cuisine"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </section>

          <div style={cardGrid}>
            {filteredRestaurants.map((restaurant) => (
              <article key={restaurant._id} className="spotlight-card" style={restaurantCard}>
                <div style={imageWrap}>
                  <img src={restaurant.image} alt={restaurant.name} style={restaurantImage} />
                  <div style={imageTopRow}>
                    <div style={openBadge}>{restaurant.isOpen ? "Open now" : "Closed"}</div>
                    <div style={ratingBadge}>{restaurant.rating}</div>
                  </div>
                </div>

                <div style={cardBody}>
                  <div>
                    <h2 style={cardTitle}>{restaurant.name}</h2>
                    <p style={cuisineText}>{(restaurant.cuisine || []).join(" • ")}</p>
                  </div>

                  <div style={metaGrid}>
                    <div style={metaCard}>
                      <span style={metaLabel}>Delivery</span>
                      <strong style={metaValue}>{restaurant.deliveryTime}</strong>
                    </div>
                    <div style={metaCard}>
                      <span style={metaLabel}>Spend</span>
                      <strong style={metaValue}>{restaurant.priceRange}</strong>
                    </div>
                  </div>

                  <p style={descriptionText}>
                    {restaurant.description ||
                      "A modern restaurant experience with ordering and reservations built in."}
                  </p>

                  <div style={actionRow}>
                    <button
                      className="luxury-button"
                      style={lightButton}
                      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                    >
                      View menu
                    </button>
                    <button
                      className="luxury-button"
                      style={primaryButton}
                      onClick={() => navigate("/book-table")}
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const heroSection = {
  borderRadius: "34px",
  padding: "32px",
  marginBottom: "26px",
  background: "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(255,244,238,0.96) 48%, rgba(191,78,59,0.14) 100%)",
  border: `1px solid ${colors.border}`,
  boxShadow: "0 24px 60px rgba(17, 24, 39, 0.08)",
};

const heroGrid = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.3fr) minmax(320px, 0.9fr)",
  gap: "28px",
  alignItems: "center",
};

const heroLabel = {
  display: "inline-flex",
  padding: "9px 12px",
  borderRadius: "999px",
  background: "rgba(191,78,59,0.1)",
  color: colors.primaryDark,
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  fontWeight: 800,
};

const heroTitle = {
  marginTop: "16px",
  fontSize: "clamp(3.2rem, 6vw, 5.4rem)",
  lineHeight: 0.92,
  color: colors.text,
  maxWidth: "760px",
};

const heroCopy = {
  marginTop: "18px",
  color: colors.muted,
  maxWidth: "700px",
  fontSize: "1.05rem",
};

const heroActions = {
  display: "flex",
  gap: "14px",
  flexWrap: "wrap",
  marginTop: "26px",
};

const heroSide = {
  display: "grid",
  gap: "14px",
};

const heroStatCard = {
  padding: "20px",
  borderRadius: "24px",
  background: "white",
  border: `1px solid ${colors.border}`,
  boxShadow: "0 16px 38px rgba(17, 24, 39, 0.06)",
  display: "grid",
  gap: "8px",
};

const statLabel = {
  color: colors.muted,
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  fontWeight: 800,
};

const statValue = {
  color: colors.text,
  fontSize: "1.08rem",
};

const searchStrip = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "18px",
  flexWrap: "wrap",
  marginBottom: "22px",
};

const sectionTitle = {
  marginTop: "8px",
  fontSize: "2.6rem",
  color: colors.text,
};

const searchWrap = {
  width: "min(100%, 420px)",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "24px",
};

const restaurantCard = {
  background: "white",
  borderRadius: "30px",
  overflow: "hidden",
  border: `1px solid ${colors.border}`,
  boxShadow: "0 20px 46px rgba(17, 24, 39, 0.08)",
};

const imageWrap = {
  position: "relative",
};

const restaurantImage = {
  width: "100%",
  height: "240px",
  objectFit: "cover",
};

const imageTopRow = {
  position: "absolute",
  left: "16px",
  right: "16px",
  top: "16px",
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
};

const openBadge = {
  padding: "10px 14px",
  borderRadius: "999px",
  background: "rgba(17,24,39,0.72)",
  color: "white",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  fontWeight: 800,
};

const ratingBadge = {
  minWidth: "52px",
  height: "52px",
  borderRadius: "18px",
  display: "grid",
  placeItems: "center",
  background: "rgba(255,255,255,0.88)",
  color: colors.text,
  fontWeight: 800,
};

const cardBody = {
  padding: "22px",
  display: "grid",
  gap: "16px",
};

const cardTitle = {
  fontSize: "2rem",
  color: colors.text,
};

const cuisineText = {
  color: colors.muted,
  marginTop: "8px",
  fontWeight: 600,
};

const metaGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
};

const metaCard = {
  padding: "16px",
  borderRadius: "20px",
  background: colors.card,
  border: `1px solid ${colors.border}`,
  display: "grid",
  gap: "5px",
};

const metaLabel = {
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  color: colors.muted,
  fontWeight: 800,
};

const metaValue = {
  color: colors.text,
};

const descriptionText = {
  color: colors.muted,
  minHeight: "48px",
};

const actionRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};

const primaryButton = {
  background: "linear-gradient(135deg, #bf4e3b, #c58a2c)",
  color: "white",
};

const darkButton = {
  background: "#111827",
  color: "white",
};

const lightButton = {
  background: colors.card,
  color: colors.text,
};

export default Menu;
