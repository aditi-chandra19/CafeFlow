import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";
import Toolbar from "../components/Toolbar";

function Cart() {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showCoupons, setShowCoupons] = useState(false);

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
      alert("10% discount applied 🎉");
    } else if (coupon === "SAVE20") {
      setDiscount(0.2);
      alert("20% discount applied 🎉");
    } else if (coupon === "LUCKYYOU") {
      setDiscount(0.5);
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
      <Toolbar />

      <div style={page}>
        <div style={card}>

          <button onClick={() => navigate(-1)} style={backBtn}>
            ← Back
          </button>

          <h1>Your Cart 🛒</h1>

          {cart.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <>
              {cart.map((item, index) => (
                <div key={index} style={itemCard}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>₹ {item.price}</p>
                  </div>

                  <div>
                    <button onClick={() => decreaseQty(index)} style={qtyBtn}>-</button>
                    <span style={{ margin: "0 10px" }}>{item.qty}</span>
                    <button onClick={() => increaseQty(index)} style={qtyBtn}>+</button>
                  </div>
                </div>
              ))}

              <hr />

              <h3>Total: ₹ {totalPrice}</h3>

              {discount > 0 && <h3 style={{ color: "green" }}>Discount Applied 🎉</h3>}

              <h2>Final Price: ₹ {finalPrice}</h2>

              {/* COUPON INPUT */}
              <div style={{ marginTop: "20px" }}>
                <input
                  placeholder="Enter Coupon Code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  style={input}
                />

                <button onClick={applyCoupon} style={btn}>
                  Apply Coupon
                </button>
              </div>

              {/* BUTTONS */}
              <button
                onClick={() => {
                  localStorage.setItem("finalPrice", finalPrice);
                  navigate("/delivery");
                }}
                style={primaryBtn}
              >
                Proceed To Payment
              </button>

              <button onClick={clearCart} style={secondaryBtn}>
                Clear Cart
              </button>

              {/* ✅ AVAILABLE COUPONS (FIXED POSITION) */}
              <div style={couponBox}>
                <div
                  style={couponHeader}
                  onClick={() => setShowCoupons(prev => !prev)}
                >
                  🎁 Available Coupons
                </div>

                {showCoupons && (
                  <div style={couponDropdown}>
                    <div
  style={couponItem}
  onClick={() => {
    setCoupon("SAVE10");
    setDiscount(0.1);
  }}
>
  <h4>FLAT10</h4>
  <p>10% off above ₹500</p>
</div>

                    <div
  style={couponItem}
  onClick={() => {
    setCoupon("SAVE20");
    setDiscount(0.2);
  }}
>
  <h4>FLAT20</h4>
  <p>20% off up to ₹1000</p>
</div>

                    <div
  style={couponItem}
  onClick={() => {
    setCoupon("LUCKYYOU");
    setDiscount(0.5);
  }}
>
  <h4>LUCKYYOU</h4>
  <p>50% on order above ₹2000</p>
</div>
                  </div>
                )}
              </div>

            </>
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
  maxWidth: "900px",
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
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px"
};

const qtyBtn = {
  padding: "5px 10px"
};

const input = {
  padding: "10px",
  borderRadius: "8px"
};

const btn = {
  marginLeft: "10px",
  padding: "10px"
};

const primaryBtn = {
  marginTop: "20px",
  padding: "12px",
  background: "#588157",
  color: "white",
  border: "none",
  borderRadius: "8px"
};

const secondaryBtn = {
  marginTop: "10px",
  marginLeft: "10px",
  padding: "10px",
  background: "#b08968",
  color: "white",
  border: "none",
  borderRadius: "8px"
};

const couponBox = {
  marginTop: "20px"
};

const couponHeader = {
  padding: "12px",
  background: "#EADBC8",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "500"
};

const couponDropdown = {
  marginTop: "10px",
  background: "#FAF7F2",
  padding: "15px",
  borderRadius: "10px"
};

const couponItem = {
  padding: "10px",
  borderBottom: "1px solid #ccc"
};

export default Cart;