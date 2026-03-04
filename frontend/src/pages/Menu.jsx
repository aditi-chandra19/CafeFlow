import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Menu() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "linear-gradient(to right, #fdfbfb, #ebedee)"
      }}
    >
      <h1 style={{ marginBottom: "30px" }}>
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
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
              overflow: "hidden",
              cursor: "pointer",
              transition: "0.3s"
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

            <div style={{ padding: "20px" }}>
              <h2>{restaurant.name}</h2>
              <p>⭐ {restaurant.rating}</p>
              <p>{restaurant.deliveryTime}</p>
              <p>{restaurant.priceRange}</p>
              <p style={{ color: restaurant.isOpen ? "green" : "red" }}>
                {restaurant.isOpen ? "Open" : "Closed"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;