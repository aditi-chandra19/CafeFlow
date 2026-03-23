import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import { colors } from "../theme";

function OrderSuccess() {

  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  console.log("SUCCESS PAGE");

  const timer = setTimeout(() => {
    console.log("GOING TO DELIVERY");
    navigate("/menu");
  }, 3000);

  return () => clearTimeout(timer);
}, [navigate]);

  return (
    <>
      <Toolbar />

      <div style={page}>

        <div style={card}>

          {/* 🎉 SUCCESS ICON */}
          <div style={icon}>✅</div>

          <h1 style={{ color: colors.text }}>
            Order Placed Successfully!
          </h1>

          <p style={{ color: "#555", marginTop: "10px" }}>
            Your order is being prepared 🍽️
          </p>

          {/* OPTIONAL ORDER PREVIEW */}
          {orders.map((order, index) => (
            <div key={index} style={miniCard}>
              <h3 style={{ color: colors.primary }}>
                {order.restaurantName}
              </h3>
              <p>₹ {order.totalAmount}</p>
            </div>
          ))}

        </div>

      </div>
    </>
  );
}

/* STYLES */

const page = {
  minHeight: "100vh",
  background: "#FAF7F2",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const card = {
  background: "#EADBC8",
  padding: "40px",
  borderRadius: "20px",
  textAlign: "center",
  width: "350px"
};

const icon = {
  fontSize: "50px",
  marginBottom: "10px"
};

const miniCard = {
  marginTop: "15px",
  padding: "10px",
  background: "#FAF7F2",
  borderRadius: "10px"
};

export default OrderSuccess;