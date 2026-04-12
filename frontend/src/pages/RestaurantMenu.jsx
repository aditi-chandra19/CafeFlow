import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import { SurfacePanel, PageContainer, BackButton } from "../components/ui/AppShell";
import { getLocalMenu, getLocalRestaurant } from "../data/mockData";
import { getCart, getFavorites, setCart, setFavorites } from "../lib/storage";
import { formatCurrency } from "../lib/format";
import { colors } from "../theme";

function RestaurantMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const savedCart = getCart();
    setCartCount(savedCart.reduce((sum, item) => sum + (item.qty || 1), 0));

    const localRestaurant = getLocalRestaurant(id);
    if (localRestaurant) {
      setRestaurant(localRestaurant);
      setItems(getLocalMenu(id));
      return;
    }

    fetch(`http://localhost:5000/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => setRestaurant(data))
      .catch(() => setRestaurant(null));

    fetch(`http://localhost:5000/menu/${id}`)
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, [id]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const categoryMatch =
        selectedCategory === "All" || item.category === selectedCategory;
      const searchMatch = item.name.toLowerCase().includes(search.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [items, search, selectedCategory]);

  const categories = ["All", ...new Set(items.map((item) => item.category))];

  const addToCart = (item) => {
    const cart = getCart();
    const nextCart = [
      ...cart,
      {
        ...item,
        qty: 1,
        restaurantId: restaurant?._id,
        restaurantName: restaurant?.name,
      },
    ];

    setCart(nextCart);
    setCartCount(nextCart.reduce((sum, cartItem) => sum + (cartItem.qty || 1), 0));
    alert(`${item.name} added to cart`);
  };

  const addToFavorites = (item) => {
    const favorites = getFavorites();
    if (!favorites.find((fav) => fav._id === item._id)) {
      setFavorites([...favorites, { ...item, restaurantName: restaurant?.name }]);
      alert("Added to favorites");
      return;
    }

    alert("Already in favorites");
  };

  return (
    <>
      <Toolbar />
      <PageContainer maxWidth="1380px">
        <BackButton onClick={() => navigate("/menu")} style={backButton}>
          Back to restaurants
        </BackButton>

        {restaurant && (
          <section className="responsive-two-col" style={heroLayout}>
            <div style={heroVisualWrap}>
              <img src={restaurant.image} alt={restaurant.name} style={heroVisual} />
              <div style={heroOverlayCard}>
                <span style={overlayLabel}>Restaurant</span>
                <strong style={overlayTitle}>{restaurant.name}</strong>
                <span style={overlayMeta}>{restaurant.deliveryTime} · {restaurant.priceRange}</span>
              </div>
            </div>

            <SurfacePanel style={heroPanel}>
              <p className="muted-kicker">Restaurant menu</p>
              <h1 style={title}>{restaurant.name}</h1>
              <p style={description}>
                {restaurant.description ||
                  "Browse dishes, shortlist favorites, and add items with a cleaner restaurant-first experience."}
              </p>

              <div style={metaRow}>
                <div style={metaCard}>
                  <span style={metaLabel}>Rating</span>
                  <strong style={metaValue}>{restaurant.rating}</strong>
                </div>
                <div style={metaCard}>
                  <span style={metaLabel}>Cuisine</span>
                  <strong style={metaValue}>{restaurant.cuisine?.[0] || "Curated dining"}</strong>
                </div>
                <div style={metaCard}>
                  <span style={metaLabel}>Cart</span>
                  <strong style={metaValue}>{cartCount} items</strong>
                </div>
              </div>

              <div style={ctaRow}>
                <button className="luxury-button" style={primaryButton} onClick={() => navigate("/book-table")}>
                  Reserve a table
                </button>
                <button className="luxury-button" style={darkButton} onClick={() => navigate("/cart")}>
                  Open cart
                </button>
              </div>
            </SurfacePanel>
          </section>
        )}

        <SurfacePanel style={filterPanel}>
          <div style={filterHeading}>
            <h2 style={{ fontSize: "2rem", color: colors.text }}>Find what to order</h2>
            <p style={{ color: colors.muted }}>
              Search dishes, switch categories, and add items in a modern menu layout.
            </p>
          </div>

          <div style={filterControls}>
            <input className="luxury-input" placeholder="Search dishes, desserts, combos..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="luxury-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ maxWidth: "240px" }}>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </SurfacePanel>

        <div style={menuGrid}>
          {filteredItems.map((item) => (
            <article key={item._id} className="spotlight-card" style={menuCard}>
              <img src={item.image} alt={item.name} style={menuImage} />
              <div style={menuBody}>
                <div style={cardTopRow}>
                  <div>
                    <h3 style={itemName}>{item.name}</h3>
                    <p style={itemCategory}>{item.category}</p>
                  </div>
                  <span style={ratingChip}>{item.rating}</span>
                </div>

                <div style={infoBand}>
                  <span style={priceText}>{formatCurrency(item.price)}</span>
                  <span style={dietTag(item.isVeg)}>{item.isVeg ? "Veg" : "Non-veg"}</span>
                </div>

                <div style={cardActions}>
                  <button className="luxury-button" style={lightButton} onClick={() => addToFavorites(item)}>Save</button>
                  <button className="luxury-button" style={primaryButton} onClick={() => addToCart(item)} disabled={!item.available}>
                    {item.available ? "Add to cart" : "Unavailable"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </PageContainer>
    </>
  );
}

const backButton = {
  marginBottom: "18px",
  background: colors.card,
  color: colors.text,
};

const heroLayout = {
  display: "grid",
  gridTemplateColumns: "minmax(340px, 1.05fr) minmax(0, 0.95fr)",
  gap: "24px",
  marginBottom: "24px",
  alignItems: "stretch",
};

const heroVisualWrap = {
  position: "relative",
  minHeight: "480px",
  borderRadius: "34px",
  overflow: "hidden",
  boxShadow: "0 26px 60px rgba(17, 24, 39, 0.12)",
};

const heroVisual = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const heroOverlayCard = {
  position: "absolute",
  left: "20px",
  bottom: "20px",
  padding: "18px 20px",
  borderRadius: "22px",
  background: "rgba(17,24,39,0.72)",
  color: "white",
  backdropFilter: "blur(14px)",
  display: "grid",
  gap: "4px",
  minWidth: "220px",
};

const overlayLabel = {
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  color: "rgba(255,255,255,0.66)",
  fontWeight: 800,
};

const overlayTitle = {
  fontSize: "1.2rem",
};

const overlayMeta = {
  color: "rgba(255,255,255,0.82)",
};

const heroPanel = {
  padding: "30px",
  borderRadius: "34px",
  display: "grid",
  alignContent: "start",
};

const title = {
  marginTop: "12px",
  fontSize: "clamp(3rem, 5vw, 4.8rem)",
  lineHeight: 0.92,
  color: colors.text,
};

const description = {
  marginTop: "16px",
  color: colors.muted,
  maxWidth: "560px",
  fontSize: "1.02rem",
};

const metaRow = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "14px",
  marginTop: "28px",
};

const metaCard = {
  padding: "18px",
  borderRadius: "22px",
  background: colors.card,
  border: `1px solid ${colors.border}`,
  display: "grid",
  gap: "8px",
};

const metaLabel = {
  color: colors.muted,
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  fontWeight: 800,
};

const metaValue = {
  color: colors.text,
  fontSize: "1rem",
};

const ctaRow = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "24px",
};

const filterPanel = {
  padding: "24px",
  borderRadius: "30px",
  marginBottom: "24px",
};

const filterHeading = {
  display: "grid",
  gap: "6px",
  marginBottom: "18px",
};

const filterControls = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 240px",
  gap: "14px",
};

const menuGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "24px",
};

const menuCard = {
  background: "white",
  borderRadius: "28px",
  overflow: "hidden",
  border: `1px solid ${colors.border}`,
  boxShadow: "0 20px 46px rgba(17, 24, 39, 0.08)",
};

const menuImage = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
};

const menuBody = {
  padding: "22px",
};

const cardTopRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "start",
};

const itemName = {
  color: colors.text,
  fontSize: "1.6rem",
};

const itemCategory = {
  color: colors.muted,
  marginTop: "6px",
  fontWeight: 600,
};

const ratingChip = {
  minWidth: "48px",
  height: "48px",
  borderRadius: "16px",
  display: "grid",
  placeItems: "center",
  background: "rgba(47,106,96,0.1)",
  color: colors.secondary,
  fontWeight: 800,
};

const infoBand = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  marginTop: "18px",
};

const priceText = {
  color: colors.text,
  fontWeight: 800,
  fontSize: "1.08rem",
};

const dietTag = (isVeg) => ({
  padding: "8px 12px",
  borderRadius: "999px",
  background: isVeg ? "rgba(21,128,61,0.1)" : "rgba(191,78,59,0.1)",
  color: isVeg ? colors.success : colors.primary,
  fontWeight: 700,
  fontSize: "0.9rem",
});

const cardActions = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  marginTop: "18px",
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

export default RestaurantMenu;
