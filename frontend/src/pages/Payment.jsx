import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [delivery, setDelivery] = useState(null);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Card states
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // UPI state
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    const details =
      JSON.parse(localStorage.getItem("deliveryDetails"));
    setDelivery(details);
  }, []);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price,
    0
  );

  const placeOrder = async () => {
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
            total: totalPrice
          })
        }
      );

      const data = await res.json();
      alert(data.message);

      localStorage.removeItem("cart");
      localStorage.removeItem("deliveryDetails");

      navigate("/success");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        padding: "40px 20px"
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "auto",
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow:
            "0 15px 40px rgba(0,0,0,0.08)"
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={backBtn}
        >
          ← Back
        </button>

        <h1>Payment 💳</h1>

        <h3>Order Summary</h3>

        {cart.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "12px",
              marginBottom: "10px",
              background: "#f9fafb",
              borderRadius: "10px"
            }}
          >
            {item.name} - ₹ {item.price}
          </div>
        ))}

        <h2 style={{ marginTop: "20px" }}>
          Total: ₹ {totalPrice}
        </h2>

        <hr style={{ margin: "20px 0" }} />

        <h3>Delivery Details</h3>

        {delivery && (
          <div style={{ marginBottom: "20px" }}>
            <p><strong>{delivery.name}</strong></p>
            <p>{delivery.phone}</p>
            <p>{delivery.address}</p>
            <p>{delivery.city} - {delivery.pincode}</p>
          </div>
        )}

        <hr style={{ margin: "20px 0" }} />

        <h3>Select Payment Method</h3>

        <button
          onClick={() => setPaymentMethod("card")}
          style={btnStyle}
        >
          Pay via Card 💳
        </button>

        <button
          onClick={() => setPaymentMethod("upi")}
          style={btnStyle}
        >
          Pay via UPI 📱
        </button>

        <button
          onClick={placeOrder}
          style={btnStyle}
        >
          Cash on Delivery 💵
        </button>

        {/* CARD FORM */}
        {paymentMethod === "card" && (
          <div style={{ marginTop: "20px" }}>
            <h3>Enter Card Details</h3>

            <input
              placeholder="Card Holder Name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Expiry (MM/YY)"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              style={inputStyle}
            />

            <button
              onClick={() => {
                if (!cardName || !cardNumber || !expiry || !cvv) {
                  alert("Please fill all card details");
                  return;
                }
                alert("Processing Card Payment...");
                setTimeout(() => {
                  placeOrder();
                }, 1200);
              }}
              style={{ ...btnStyle, background: "green" }}
            >
              Confirm Card Payment ✅
            </button>
          </div>
        )}

        {/* UPI FORM */}
        {paymentMethod === "upi" && (
          <div style={{ marginTop: "20px" }}>
            <h3>Enter UPI ID</h3>

            <input
              placeholder="example@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              style={inputStyle}
            />

            <button
              onClick={() => {
                if (!upiId.includes("@")) {
                  alert("Enter valid UPI ID");
                  return;
                }
                alert("Processing UPI Payment...");
                setTimeout(() => {
                  placeOrder();
                }, 1200);
              }}
              style={{ ...btnStyle, background: "#4f46e5" }}
            >
              Confirm UPI Payment ✅
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const backBtn = {
  marginBottom: "20px",
  padding: "8px 16px",
  background: "#444",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const btnStyle = {
  display: "block",
  margin: "10px 0",
  padding: "10px 20px",
  background: "black",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

export default Payment;