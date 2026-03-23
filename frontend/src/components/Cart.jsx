import React from "react";
import { groupCart } from "../utils/groupCart";

const colors = {
  bg: "#FAF7F2",
  card: "#EADBC8",
  greenLight: "#A3B18A",
  greenDark: "#588157",
  olive: "#848560",
  brown: "#B08968",
  text: "#2F2F2F"
};

function Cart({ cartItems }) {
  const grouped = groupCart(cartItems);

  return (
    <div style={{ background: colors.bg, padding: "20px", minHeight: "100vh" }}>
      
      <h2 style={{ color: colors.greenDark }}>Your Cart ☕</h2>

      {Object.keys(grouped).map((restId) => (
        <div
          key={restId}
          style={{
            background: colors.card,
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "12px"
          }}
        >
          <h3 style={{ color: colors.greenDark }}>
            {grouped[restId][0].restaurantName}
          </h3>

          {grouped[restId].map((item) => (
            <div
              key={item.itemId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "8px 0",
                color: colors.text
              }}
            >
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      ))}

    </div>
  );
}

export default Cart;