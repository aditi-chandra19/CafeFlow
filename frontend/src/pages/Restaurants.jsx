import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "30px" }}>
        Explore Restaurants 🍽
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px"
        }}
      >
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            onClick={() => navigate(`/restaurant/${restaurant._id}`)}
            style={{
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              cursor: "pointer",
              overflow: "hidden",
              transition: "0.3s"
            }}
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover"
              }}
            />

            <div style={{ padding: "15px" }}>
              <h3>{restaurant.name}</h3>
              <p>⭐ {restaurant.rating}</p>
              <p>{restaurant.deliveryTime}</p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                {restaurant.priceRange}
              </p>
              <p style={{ fontSize: "13px", color: "#888" }}>
                {restaurant.cuisine.join(", ")}
              </p>
              <p
                style={{
                  color: restaurant.isOpen ? "green" : "red",
                  fontWeight: "bold"
                }}
              >
                {restaurant.isOpen ? "Open" : "Closed"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Restaurants;