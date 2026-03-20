import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { colors } from "../theme";
import Toolbar from "../components/Toolbar";

function RestaurantMenu() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [search, setSearch] = useState(""); // ✅ correct place
  const [selectedCategory, setSelectedCategory] = useState("All");

  const cartCount = JSON.parse(localStorage.getItem("cart") || "[]").length;

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/restaurants/${id}`)
      .then(res => res.json())
      .then(data => setRestaurant(data));

    fetch(`http://localhost:5000/menu/${id}`)
      .then(res => res.json())
      .then(data => setItems(data));

  }, [id]);

  // ADD TO CART
  const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(i => i._id === item._id);

    if (existingItem) {
      existingItem.qty = (existingItem.qty || 1) + 1;
    } else {
      cart.push({ ...item, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${item.name} added to cart 🛒`);
  };

  // FAVORITES
  const addToFavorites = (item) => {
    const fav = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!fav.find(i => i._id === item._id)) {
      fav.push(item);
      localStorage.setItem("favorites", JSON.stringify(fav));
      alert("Added to favorites ❤️");
    } else {
      alert("Already in favorites ❤️");
    }
  };

  // CATEGORY COUNT
  const categoryCount = {};
  items.forEach(item => {
    categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
  });

  return (
    <>
      <Toolbar />

      <div style={container}>

        {/* BACK */}
        <button onClick={() => navigate("/menu")} style={backBtn}>
          ← Back to Restaurants
        </button>

        {/* HEADER */}
        {restaurant && (
          <div style={{ marginBottom: "30px" }}>

            <img
              src={restaurant.image}
              alt={restaurant.name}
              style={banner}
            />

            <h1 style={title}>{restaurant.name}</h1>

            <div style={info}>
              <span>⭐ {restaurant.rating}</span>
              <span>{restaurant.deliveryTime}</span>
              <span>{restaurant.priceRange}</span>
            </div>

            <button
              onClick={() => navigate("/book-table")}
              style={bookBtn}
            >
              Book Table 🍽
            </button>

            <hr style={{ marginTop: "20px" }} />
          </div>
        )}

        {/* SEARCH */}
        <div style={searchBox}>
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={input}
          />

          {search && (
            <span style={clearBtn} onClick={() => setSearch("")}>
              ✖
            </span>
          )}
        </div>

        {/* CATEGORY */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={categorySelect}
        >
          <option value="All">All ({items.length})</option>

          {[...new Set(items.map(i => i.category))].map(cat => (
            <option key={cat} value={cat}>
              {cat} ({categoryCount[cat]})
            </option>
          ))}
        </select>

        {/* GRID */}
        <div style={grid}>

          {items
            .filter(item =>
              (selectedCategory === "All" || item.category === selectedCategory) &&
              item.name.toLowerCase().includes(search.toLowerCase())
            )
            .map(item => (

              <div key={item._id} style={card}>

                <img src={item.image} alt={item.name} style={cardImg} />

                <div style={cardBody}>

                  <h3>{item.name}</h3>

                  <p>⭐ {item.rating}</p>

                  <p style={{ fontWeight: "bold" }}>₹ {item.price}</p>

                  <p style={{
                    color: item.isVeg ? colors.primary : "#b91c1c",
                    fontSize: "13px"
                  }}>
                    {item.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
                  </p>

                  <button onClick={() => addToFavorites(item)} style={favBtn}>
                    ❤️
                  </button>

                  {item.available && (
                    <button onClick={() => addToCart(item)} style={cartBtn}>
                      Add to Cart 🛒
                    </button>
                  )}

                </div>
              </div>
            ))}

        </div>

        {/* CART FLOAT BUTTON */}
        {cartCount > 0 && (
          <button onClick={() => navigate("/cart")} style={floatingCart}>
            Go To Cart 🛒 ({cartCount})
          </button>
        )}

      </div>
    </>
  );
}

/* STYLES */

const container = {
  maxWidth: "1200px",
  margin: "auto",
  padding: "40px 20px",
  background: colors.bg,
};

const backBtn = {
  marginBottom: "20px",
  padding: "8px 16px",
  background: colors.primary,
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const banner = {
  width: "100%",
  height: "250px",
  objectFit: "cover",
  borderRadius: "16px",
  marginBottom: "20px"
};

const title = { fontSize: "36px", color: colors.text };

const info = {
  display: "flex",
  gap: "20px",
  color: colors.muted
};

const bookBtn = {
  padding: "8px 16px",
  background: colors.secondary,
  color: "white",
  border: "none",
  borderRadius: "8px",
  marginTop: "10px"
};

const searchBox = {
  display: "flex",
  alignItems: "center",
  background: "#EADBC8",
  border: "2px solid black",
  borderRadius: "12px",
  padding: "8px 12px",
  marginBottom: "20px"
};

const input = {
  flex: 1,
  border: "none",
  outline: "none",
  background: "transparent",
  marginLeft: "8px"
};

const clearBtn = {
  cursor: "pointer",
  marginLeft: "8px"
};

const categorySelect = {
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "25px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
  gap: "25px"
};

const card = {
  background: colors.card,
  borderRadius: "16px",
  overflow: "hidden"
};

const cardImg = {
  height: "180px",
  width: "100%",
  objectFit: "cover"
};

const cardBody = { padding: "15px" };

const favBtn = {
  marginTop: "8px",
  padding: "6px 10px",
  background: colors.secondary,
  color: "white",
  border: "none",
  borderRadius: "6px"
};

const cartBtn = {
  marginTop: "10px",
  width: "100%",
  padding: "12px",
  background: colors.primary,
  color: "white",
  border: "none",
  borderRadius: "8px"
};

const floatingCart = {
  position: "fixed",
  bottom: "30px",
  right: "30px",
  padding: "14px 20px",
  borderRadius: "50px",
  background: colors.primary,
  color: "white"
};

export default RestaurantMenu;