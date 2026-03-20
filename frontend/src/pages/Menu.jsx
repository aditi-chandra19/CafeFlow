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

  return (
    <>
    <Toolbar/>
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: colors.bg   // ✅ fixed
      }}
    >
      <h1 style={{ 
        marginBottom: "30px",
        color: colors.text      // ✅ fixed
      }}>
        Explore Restaurants 🍽️
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "30px"
        }}
      >
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            onClick={() => navigate(`/restaurant/${restaurant._id}`)}
            style={{
              background: colors.card,   // ✅ fixed
              borderRadius: "18px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)", // softer
              overflow: "hidden",
              cursor: "pointer",
              transition: "0.25s ease"
            }}

            onMouseEnter={(e)=>{
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e)=>{
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover"
              }}
            />

            <div style={{ padding: "18px" }}>
              <h2 style={{ 
                color: colors.text,
                marginBottom: "6px"
              }}>
                {restaurant.name}
              </h2>

              <p style={{ color: colors.muted }}>
                ⭐ {restaurant.rating}
              </p>

              <p style={{ color: colors.muted }}>
                {restaurant.deliveryTime}
              </p>

              <p style={{ color: colors.muted }}>
                {restaurant.priceRange}
              </p>

              <p
                style={{
                  marginTop: "6px",
                  fontWeight: "500",
                  color: restaurant.isOpen 
                    ? colors.primary   // ✅ green tone
                    : "#b91c1c"        // soft red (keep for clarity)
                }}
              >
                {restaurant.isOpen ? "Open" : "Closed"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default Menu;