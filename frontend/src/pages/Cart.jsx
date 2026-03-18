import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";
import Toolbar from "../components/Toolbar";
function Cart() {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

    const merged = [];

    savedCart.forEach(item => {
      const existing = merged.find(i => i._id === item._id);

      if (existing) {
        existing.qty += item.qty || 1;
      } else {
        merged.push({ ...item, qty: item.qty || 1 });
      }
    });

    setCart(merged);
  }, []);

  const increaseQty = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].qty += 1;
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQty = (index) => {
    const updatedCart = [...cart];

    if (updatedCart[index].qty > 1) {
      updatedCart[index].qty -= 1;
    } else {
      updatedCart.splice(index, 1);
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  const applyCoupon = () => {
    if (coupon === "SAVE10") {
      setDiscount(0.1);
      localStorage.setItem("discount", 0.1);
      alert("10% discount applied 🎉");
    } else if (coupon === "SAVE20") {
      setDiscount(0.2);
      localStorage.setItem("discount", 0.2);
      alert("20% discount applied 🎉");
    } else if (coupon === "LUCKYYOU") {
      setDiscount(0.5);
      localStorage.setItem("discount", 0.5);
      alert("50% discount applied 🎉");
    } else {
      alert("Invalid coupon");
    }
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const finalPrice = totalPrice - totalPrice * discount;

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
          maxWidth: "1000px",
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

        <h1 style={{ color: colors.text }}>Your Cart 🛒</h1>

        {cart.length === 0 ? (
          <p style={{ color: colors.muted }}>No items in cart.</p>
        ) : (
          <>
            {cart.map((item, index) => (
              <div key={index} style={itemCard}>
                <div>
                  <h3 style={{ color: colors.text }}>{item.name}</h3>
                  <p style={{ color: colors.muted }}>₹ {item.price}</p>
                </div>

                <div>
                  <button onClick={() => decreaseQty(index)} style={qtyBtn}>-</button>

                  <span style={{ margin: "0 10px" }}>
                    {item.qty}
                  </span>

                  <button onClick={() => increaseQty(index)} style={qtyBtn}>+</button>
                </div>
              </div>
            ))}

            <hr />

            <h3 style={{ color: colors.text }}>Total: ₹ {totalPrice}</h3>

            {discount > 0 && (
              <h3 style={{ color: colors.primary }}>
                Discount Applied 🎉
              </h3>
            )}

            <h2 style={{ color: colors.text }}>
              Final Price: ₹ {finalPrice}
            </h2>

            <div style={{ marginTop: "20px" }}>
              <input
                placeholder="Enter Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                style={inputStyle}
              />

              <button onClick={applyCoupon} style={btnStyle}>
                Apply Coupon
              </button>
            </div>

            <button
              onClick={() => {
                localStorage.setItem("finalPrice", finalPrice);
                navigate("/delivery");
              }}
              style={btnPrimary}
            >
              Proceed To Payment 
            </button>

            <button onClick={clearCart} style={btnSecondary}>
              Clear Cart
            </button>
          </>
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
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px",
  background: colors.bg,
  marginBottom: "10px",
  borderRadius: "10px"
};

const qtyBtn = {
  padding: "6px 10px",
  borderRadius: "6px",
  border: "none",
  background: colors.secondary,
  color: "white",
  cursor: "pointer"
};

const btnStyle = {
  marginLeft: "10px",
  padding: "10px 20px",
  background: colors.secondary,
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const btnPrimary = {
  marginTop: "20px",
  padding: "12px 20px",
  background: colors.primary,
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const btnSecondary = {
  marginTop: "10px",
  marginLeft: "10px",
  padding: "10px 16px",
  background: colors.secondary,
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #d6ccc2",
  background: colors.card
};

export default Cart;