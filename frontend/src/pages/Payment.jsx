import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";
import Toolbar from "../components/Toolbar";
function Payment() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [delivery, setDelivery] = useState(null);
  const [discount, setDiscount] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState(null);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    const details =
      JSON.parse(localStorage.getItem("deliveryDetails"));
    setDelivery(details);

    const savedDiscount = localStorage.getItem("discount");
    if (savedDiscount) {
      setDiscount(Number(savedDiscount));
    }
  }, []);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * (item.qty || 1),
    0
  );

  const totalPrice = subtotal - subtotal * discount;

  const placeOrder = async () => {
    if (!delivery) {
      alert("Delivery address missing ❗");
      navigate("/delivery");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "http://localhost:5000/place-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
          body: JSON.stringify({
            items: cart,
            total: totalPrice,
            delivery
          })
        }
      );

      const data = await res.json();
      alert(data.message);

      localStorage.removeItem("cart");
      navigate("/success");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <Toolbar/>
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        padding: "40px 20px"
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "auto",
          background: colors.card,
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
        }}
      >
        <button onClick={() => navigate(-1)} style={backBtn}>
          ← Back
        </button>

        <h1 style={{ color: colors.text }}>Payment 💳</h1>

        <h3 style={{ color: colors.text }}>Order Summary</h3>

        {cart.map((item, index) => (
          <div key={index} style={itemCard}>
            <div>
              <strong style={{ fontSize: "16px", color: colors.text }}>
                {item.name}
              </strong>
              <p style={{ color: colors.muted }}>
                Qty: {item.qty || 1}
              </p>
            </div>

            <div style={{ fontWeight: "bold", color: colors.text }}>
              ₹ {item.price * (item.qty || 1)}
            </div>
          </div>
        ))}

        {/* BILL BOX */}
        <div style={billBox}>
          <p>Subtotal: ₹ {subtotal}</p>

          {discount > 0 && (
            <p style={{ color: colors.primary }}>
              Discount: -{discount * 100}%
            </p>
          )}

          <h2 style={{ marginTop: "10px", color: colors.text }}>
            Total: ₹ {totalPrice.toFixed(2)}
          </h2>
        </div>

        <hr style={{ margin: "20px 0" }} />

        {/* DELIVERY */}
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

        {/* CARD */}
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

        {/* UPI */}
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

const backBtn = {
  marginBottom: "20px",
  padding: "8px 16px",
  background: colors.primary,
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const itemCard = {
  padding: "15px",
  marginBottom: "12px",
  background: colors.bg,
  borderRadius: "12px",
  display: "flex",
  justifyContent: "space-between"
};

const billBox = {
  background: colors.bg,
  padding: "18px",
  borderRadius: "12px",
  marginTop: "20px"
};

const deliveryCard = {
  background: colors.bg,
  padding: "15px",
  borderRadius: "12px",
  marginBottom: "20px"
};

const btn = {
  display: "block",
  width: "100%",
  margin: "10px 0",
  padding: "12px",
  background: colors.secondary,
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer"
};

const btnPrimary = {
  display: "block",
  width: "100%",
  marginTop: "12px",
  padding: "12px",
  background: colors.primary,
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer"
};

const input = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "1px solid #d6ccc2",
  background: colors.card
};

export default Payment;