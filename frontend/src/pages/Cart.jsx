import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // quantity increase
  const increaseQty = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].qty = (updatedCart[index].qty || 1) + 1;
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // quantity decrease
  const decreaseQty = (index) => {
    const updatedCart = [...cart];

    if ((updatedCart[index].qty || 1) > 1) {
      updatedCart[index].qty -= 1;
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
    } else if (coupon === "CAFE20") {
      setDiscount(0.2);
      alert("20% discount applied 🎉");
    } else {
      alert("Invalid coupon");
    }
  };

  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * (item.qty || 1),
    0
  );

  const finalPrice = totalPrice - totalPrice * discount;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#f8fafc,#e2e8f0)",
        padding: "40px 20px"
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
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
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  background: "#f9fafb",
                  marginBottom: "10px",
                  borderRadius: "10px"
                }}
              >
                <div>
                  <h3>{item.name}</h3>
                  <p>₹ {item.price}</p>
                </div>

                <div>
                  <button
                    onClick={() => decreaseQty(index)}
                  >
                    -
                  </button>

                  <span
                    style={{ margin: "0 10px" }}
                  >
                    {item.qty || 1}
                  </span>

                  <button
                    onClick={() => increaseQty(index)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <hr />

            <h3>Total: ₹ {totalPrice}</h3>

            {discount > 0 && (
              <h3 style={{ color: "green" }}>
                Discount Applied 🎉
              </h3>
            )}

            <h2>Final Price: ₹ {finalPrice}</h2>

            <div style={{ marginTop: "20px" }}>
              <input
                placeholder="Enter Coupon Code"
                value={coupon}
                onChange={(e) =>
                  setCoupon(e.target.value)
                }
                style={inputStyle}
              />

              <button
                onClick={applyCoupon}
                style={btnStyle}
              >
                Apply Coupon
              </button>
            </div>

            <button
              onClick={() => navigate("/payment")}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "green",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Proceed To Payment 💳
            </button>

            <button
              onClick={clearCart}
              style={{
                marginTop: "10px",
                marginLeft: "10px",
                padding: "8px 16px",
                background: "black",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
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

const btnStyle = {
  marginLeft: "10px",
  padding: "10px 20px",
  background: "black",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

export default Cart;