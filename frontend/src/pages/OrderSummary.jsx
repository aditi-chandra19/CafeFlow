import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import { colors } from "../theme";

function OrderSummary() {

  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  const totalAmount = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  return (
    <>
      <Toolbar />

      <div style={page}>
        <div style={card}>

          <button onClick={() => navigate(-1)} style={backBtn}>
            ← Back
          </button>

          <h1 style={{ color: colors.text }}>
            Order Summary 🧾
          </h1>

          {orders.map((order) => (
            <div key={order.orderId} style={orderCard}>

              <h3 style={{ color: colors.primary }}>
                {order.restaurantName}
              </h3>

              {order.items.map((item) => (
                <p key={item._id}>
                  {item.name} x {item.qty}
                </p>
              ))}

              <p style={{ fontWeight: "bold" }}>
                ₹ {order.totalAmount}
              </p>

              <p style={{ color: colors.muted }}>
                🚴 {order.deliveryPartner}
              </p>

            </div>
          ))}

          <div style={billBox}>
            <h2>Total: ₹ {totalAmount}</h2>
          </div>

          <button
            onClick={() => navigate("/payment")}
            style={btn}
          >
            Proceed to Payment 💳
          </button>

        </div>
      </div>
    </>
  );
}

/* STYLES */

const page = {
  minHeight: "100vh",
  background: "#FAF7F2",
  padding: "40px"
};

const card = {
  maxWidth: "800px",
  margin: "auto",
  background: "#EADBC8",
  padding: "30px",
  borderRadius: "20px"
};

const orderCard = {
  background: "#FAF7F2",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "15px"
};

const billBox = {
  marginTop: "20px"
};

const btn = {
  marginTop: "20px",
  padding: "12px",
  width: "100%",
  background: "#588157",
  color: "white",
  border: "none",
  borderRadius: "10px"
};

const backBtn = {
  marginBottom: "15px",
  padding: "8px 16px",
  background: "#588157",
  color: "white",
  border: "none",
  borderRadius: "8px"
};

export default OrderSummary;