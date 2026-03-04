import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price,
    0
  );

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

        <h1>Your Cart 🛒</h1>

        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            {cart.map((item, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "15px",
                  padding: "15px",
                  borderRadius: "12px",
                  background: "#f9fafb"
                }}
              >
                <h3>{item.name}</h3>
                <p>₹ {item.price}</p>
              </div>
            ))}

            <h2 style={{ marginTop: "20px" }}>
              Total: ₹ {totalPrice}
            </h2>

            <button
              onClick={() => navigate("/checkout")}
              style={payBtn}
            >
              Proceed To Payment 💳
            </button>

            <button
              onClick={clearCart}
              style={clearBtn}
            >
              Clear Cart
            </button>
          </>
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

const payBtn = {
  marginTop: "15px",
  padding: "10px 18px",
  background: "green",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px"
};

const clearBtn = {
  marginTop: "15px",
  padding: "8px 16px",
  background: "black",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

export default Cart;