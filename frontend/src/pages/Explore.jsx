import { useNavigate } from "react-router-dom";
import { colors } from "../theme";
import { localRestaurants } from "../data/mockData";

function Explore() {
  const navigate = useNavigate();

  const goToLogin = (target = "/menu") => {
    navigate("/login", { state: { redirectTo: target } });
  };

  return (
    <div className="page-shell">
      <div className="section-shell">
        <section className="hero-surface accent-outline" style={heroSection}>
          <div style={heroTop}>
            <div style={brandWrap}>
              <div style={brandMark}>C</div>
              <div>
                <h2 style={brandTitle}>CafeFlow</h2>
                <p style={brandSub}>Modern restaurant ordering and table booking</p>
              </div>
            </div>

            <div style={heroActions}>
              <button className="luxury-button" style={ghostButton} onClick={() => goToLogin("/menu")}>
                Explore app
              </button>
              <button className="luxury-button" style={primaryButton} onClick={() => goToLogin("/menu")}>
                Sign in
              </button>
            </div>
          </div>

          <div className="responsive-two-col" style={heroGrid}>
            <div>
              <p style={heroLabel}>Premium discovery</p>
              <h1 style={heroTitle}>A warmer, sharper restaurant app experience with a polished product feel.</h1>
              <p style={heroCopy}>
                Discover restaurants, view Indian menus, reserve tables, pay with multiple options,
                and track live delivery in a cleaner interface that still feels premium.
              </p>

              <div style={heroCtas}>
                <button className="luxury-button" style={primaryButton} onClick={() => goToLogin("/menu")}>
                  Browse restaurants
                </button>
                <button className="luxury-button" style={secondaryButton} onClick={() => goToLogin("/book-table")}>
                  Reserve now
                </button>
              </div>
            </div>

            <div style={heroPanelWrap}>
              <div style={heroFeatureCard}>
                <span style={featureTag}>Included</span>
                <h3 style={featureTitle}>Ordering, booking, payments and live tracking in one flow.</h3>
                <div style={featureList}>
                  <div style={featureItem}>Public explore page before login</div>
                  <div style={featureItem}>Indian restaurant and dish coverage</div>
                  <div style={featureItem}>Discounts, fees, and multi-rider assignment</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: "34px" }}>
          <div style={sectionHead}>
            <div>
              <p className="muted-kicker">Featured restaurants</p>
              <h2 style={sectionTitle}>Start from curated places people actually want to click</h2>
            </div>
          </div>

          <div style={cardGrid}>
            {localRestaurants.map((restaurant) => (
              <button
                key={restaurant._id}
                type="button"
                className="spotlight-card"
                style={restaurantCard}
                onClick={() => goToLogin(`/restaurant/${restaurant._id}`)}
              >
                <div style={imageWrap}>
                  <img src={restaurant.image} alt={restaurant.name} style={restaurantImage} />
                  <div style={imageBadge}>Open now</div>
                </div>
                <div style={cardBody}>
                  <div style={cardTop}>
                    <h3 style={cardTitle}>{restaurant.name}</h3>
                    <span style={ratingChip}>{restaurant.rating}</span>
                  </div>
                  <p style={cardMeta}>{restaurant.deliveryTime} · {restaurant.priceRange}</p>
                  <p style={cardDescription}>{restaurant.description}</p>
                  <div style={chipRow}>
                    {restaurant.cuisine.map((item) => (
                      <span key={item} style={chip}>{item}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const heroSection = {
  borderRadius: "36px",
  padding: "32px",
  background: "linear-gradient(135deg, #111827 0%, #2c2622 58%, #bf4e3b 140%)",
  color: "white",
  boxShadow: "0 30px 80px rgba(17, 24, 39, 0.18)",
};

const heroTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
  marginBottom: "30px",
};

const brandWrap = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const brandMark = {
  width: "54px",
  height: "54px",
  borderRadius: "18px",
  display: "grid",
  placeItems: "center",
  background: "linear-gradient(135deg, #bf4e3b, #c58a2c)",
  fontFamily: '"Outfit", sans-serif',
  fontWeight: 800,
  fontSize: "1.5rem",
};

const brandTitle = {
  fontSize: "1.7rem",
  letterSpacing: "-0.04em",
};

const brandSub = {
  color: "rgba(255,255,255,0.74)",
  marginTop: "2px",
};

const heroActions = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
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
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.14)",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  fontWeight: 800,
};

const heroTitle = {
  marginTop: "18px",
  fontSize: "clamp(3.4rem, 6vw, 5.8rem)",
  lineHeight: 0.92,
  maxWidth: "780px",
};

const heroCopy = {
  marginTop: "18px",
  maxWidth: "690px",
  color: "rgba(255,255,255,0.82)",
  fontSize: "1.06rem",
};

const heroCtas = {
  display: "flex",
  gap: "14px",
  flexWrap: "wrap",
  marginTop: "26px",
};

const heroPanelWrap = {
  display: "grid",
};

const heroFeatureCard = {
  padding: "24px",
  borderRadius: "28px",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.14)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
};

const featureTag = {
  display: "inline-flex",
  padding: "7px 10px",
  borderRadius: "999px",
  background: "rgba(17,24,39,0.4)",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  fontWeight: 800,
};

const featureTitle = {
  marginTop: "16px",
  fontSize: "2rem",
  lineHeight: 1,
};

const featureList = {
  display: "grid",
  gap: "12px",
  marginTop: "18px",
};

const featureItem = {
  padding: "14px 16px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.12)",
  color: "white",
  fontWeight: 600,
};

const primaryButton = {
  background: "linear-gradient(135deg, #bf4e3b, #c58a2c)",
  color: "white",
};

const secondaryButton = {
  background: "white",
  color: colors.text,
};

const ghostButton = {
  background: "rgba(255,255,255,0.12)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.14)",
};

const sectionHead = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "end",
  gap: "16px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const sectionTitle = {
  marginTop: "8px",
  fontSize: "2.8rem",
  color: colors.text,
  maxWidth: "620px",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "24px",
};

const restaurantCard = {
  background: "white",
  borderRadius: "28px",
  overflow: "hidden",
  border: `1px solid ${colors.border}`,
  boxShadow: "0 18px 44px rgba(17, 24, 39, 0.08)",
  padding: 0,
};

const imageWrap = {
  position: "relative",
};

const restaurantImage = {
  width: "100%",
  height: "240px",
  objectFit: "cover",
};

const imageBadge = {
  position: "absolute",
  left: "16px",
  bottom: "16px",
  padding: "10px 14px",
  borderRadius: "999px",
  background: "rgba(17,24,39,0.72)",
  color: "white",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  fontWeight: 800,
};

const cardBody = {
  padding: "22px",
  textAlign: "left",
};

const cardTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "start",
  gap: "12px",
};

const cardTitle = {
  fontSize: "2rem",
  color: colors.text,
};

const ratingChip = {
  minWidth: "48px",
  height: "48px",
  borderRadius: "16px",
  display: "grid",
  placeItems: "center",
  background: "rgba(191,78,59,0.08)",
  color: colors.primaryDark,
  fontWeight: 800,
};

const cardMeta = {
  color: colors.muted,
  marginTop: "8px",
  fontWeight: 600,
};

const cardDescription = {
  color: colors.muted,
  marginTop: "14px",
  minHeight: "48px",
};

const chipRow = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const chip = {
  padding: "8px 12px",
  borderRadius: "999px",
  background: colors.card,
  color: colors.secondary,
  fontSize: "13px",
  fontWeight: 700,
};

export default Explore;
