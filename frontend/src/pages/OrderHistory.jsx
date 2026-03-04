import { useEffect, useState } from "react";

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          "http://localhost:5000/my-orders",
          {
            headers: {
              Authorization: token
            }
          }
        );

        const data = await res.json();
        setOrders(data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>My Orders 📦</h1>

      {orders.length === 0 ? (
        <p>No previous orders.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              marginTop: "20px",
              padding: "15px",
              borderRadius: "12px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              background: "#fff"
            }}
          >
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <p>
              <strong>Total:</strong> ₹ {order.total}
            </p>

            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} — ₹ {item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderHistory;