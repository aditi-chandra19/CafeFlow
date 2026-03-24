import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";
import Toolbar from "../components/Toolbar";

function Payment() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [delivery, setDelivery] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState(null);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const [upiId, setUpiId] = useState("");

  // ✅ LOAD CART → CONVERT TO ORDERS
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

    const grouped = savedCart.reduce((acc, item) => {
      if (!acc[item.restaurantId]) {
        acc[item.restaurantId] = [];
      }
      acc[item.restaurantId].push(item);
      return acc;
    }, {});

    const formattedOrders = Object.keys(grouped).map((restId) => {
      const items = grouped[restId];

      const total = items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );

      return {
        orderId: Date.now() + Math.random(),
        restaurantId: restId,
        restaurantName: items[0].restaurantName,
        items,
        totalAmount: total
      };
    });

    setOrders(formattedOrders);

    const details = JSON.parse(localStorage.getItem("deliveryDetails"));
    setDelivery(details);
  }, []);

  // ✅ TOTAL
  const totalAmount = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  // ✅ PLACE ORDER 
  const placeOrder = () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    if (!orders || orders.length === 0) {
      alert("Cart is empty ❗");
      return;
    }

    if (!delivery) {
      alert("Delivery address missing ❗");
      navigate("/menu");
      return;
    }

    // ✅ SAVE ORDER HISTORY
    const existingHistory =
      JSON.parse(localStorage.getItem("orderHistory")) || [];

     const deliveryBoys = [
      "Rider 21 🚴",
      "Rider 45 🛵",
      "Rider 60 🚲",
      "Rider 88 🚗"
    ];

    // ✅ ADDED: UNIQUE RIDER LOGIC
    const usedRiders = new Set();

const ordersWithDate = orders.map(order => {

      let rider;

      do {
        rider = deliveryBoys[Math.floor(Math.random() * deliveryBoys.length)];
      } while (usedRiders.has(rider));

      usedRiders.add(rider);

      return {
        ...order,
        date: new Date().toLocaleString(),
        deliveryPartner: rider,
        status: "Preparing"
      };
    });


    localStorage.setItem(
      "orderHistory",
      JSON.stringify([...existingHistory, ...ordersWithDate])
    );

    // ✅ CLEAR CART
    localStorage.removeItem("cart");

    // ✅ SUCCESS FLOW
    alert("Order placed successfully 🎉");
    navigate("/success");
  };

  return (
    <>
      <Toolbar />

      <div style={page}>
        <div style={card}>

          <button onClick={() => navigate(-1)} style={backBtn}>
            ← Back
          </button>

          <h1 style={{ color: colors.text }}>Payment 💳</h1>

          <h3 style={{ color: colors.text }}>Order Summary</h3>

          {orders.map((order) => (
            <div key={order.orderId} style={itemCard}>
              <div>
                <h3 style={{ color: colors.primary }}>
                  {order.restaurantName}
                </h3>

                {order.items.map((item) => (
                  <p key={item._id}>
                    {item.name} x {item.qty}
                  </p>
                ))}
              </div>

              <div style={{ fontWeight: "bold", color: colors.text }}>
                ₹ {order.totalAmount}
              </div>
            </div>
          ))}

          <div style={billBox}>
            <p>Subtotal: ₹ {totalAmount}</p>

            <h2 style={{ marginTop: "10px", color: colors.text }}>
              Total: ₹ {totalAmount}
            </h2>
          </div>

          <hr style={{ margin: "20px 0" }} />

          <h3 style={{ color: colors.text }}>Delivery Details</h3>

          {delivery ? (
            <div style={deliveryCard}>
              <p><strong>{delivery.name}</strong></p>
              <p>{delivery.phone}</p>
              <p>{delivery.address}</p>
              <p>{delivery.city} - {delivery.pincode}</p>
            </div>
          ) : (
            <p style={{ color: "red" }}>No delivery address found</p>
          )}

          <hr style={{ margin: "20px 0" }} />

          <h3 style={{ color: colors.text }}>Payment Method</h3>

          <button onClick={() => setPaymentMethod("card")} style={btn}>
            Card 💳
          </button>

          <button onClick={() => setPaymentMethod("upi")} style={btn}>
            UPI 📱
          </button>

          <button onClick={placeOrder} style={btnPrimary}>
            Cash on Delivery 💵
          </button>

          {paymentMethod === "card" && (
            <div style={{ marginTop: "20px" }}>
              <input placeholder="Card Name" value={cardName}
                onChange={(e) => setCardName(e.target.value)} style={input} />

              <input placeholder="Card Number" value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)} style={input} />

              <input placeholder="MM/YY" value={expiry}
                onChange={(e) => setExpiry(e.target.value)} style={input} />

              <input placeholder="CVV" value={cvv}
                onChange={(e) => setCvv(e.target.value)} style={input} />

              <button
                onClick={() => {
                  if (!cardName || !cardNumber || !expiry || !cvv) {
                    alert("Fill all details ❗");
                    return;
                  }
                  placeOrder();
                }}
                style={btnPrimary}
              >
                Pay Now ✅
              </button>
            </div>
          )}

          {paymentMethod === "upi" && (
            <div style={{ marginTop: "20px" }}>
              <input
                placeholder="example@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={input}
              />

              <button
                onClick={() => {
                  if (!upiId.includes("@")) {
                    alert("Invalid UPI ❗");
                    return;
                  }
                  placeOrder();
                }}
                style={btnPrimary}
              >
                Pay via UPI ✅
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

/* STYLES */

const page = {
  minHeight: "100vh",
  background: "#FAF7F2",
  padding: "40px 20px"
};

const card = {
  maxWidth: "1100px",
  margin: "auto",
  background: "#EADBC8",
  padding: "30px",
  borderRadius: "20px"
};

const backBtn = {
  marginBottom: "20px",
  padding: "8px 16px",
  background: "#588157",
  color: "white",
  border: "none",
  borderRadius: "8px"
};

const itemCard = {
  padding: "15px",
  marginBottom: "12px",
  background: "#FAF7F2",
  borderRadius: "12px",
  display: "flex",
  justifyContent: "space-between"
};

const billBox = {
  background: "#FAF7F2",
  padding: "18px",
  borderRadius: "12px",
  marginTop: "20px"
};

const deliveryCard = {
  background: "#FAF7F2",
  padding: "15px",
  borderRadius: "12px",
  marginBottom: "20px"
};

const btn = {
  display: "block",
  width: "100%",
  margin: "10px 0",
  padding: "12px",
  background: "#A3B18A",
  color: "white",
  border: "none",
  borderRadius: "10px"
};

const btnPrimary = {
  display: "block",
  width: "100%",
  marginTop: "12px",
  padding: "12px",
  background: "#588157",
  color: "white",
  border: "none",
  borderRadius: "10px"
};

const input = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "1px solid #d6ccc2",
  background: "#FAF7F2"
};

export default Payment;