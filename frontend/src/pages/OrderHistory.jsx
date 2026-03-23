import { useEffect, useState } from "react";
import Toolbar from "../components/Toolbar";
import { useNavigate } from "react-router-dom";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
 const navigate = useNavigate();  
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
    <>
    <Toolbar/>
    <button onClick={() => navigate(-1)} style={backBtn}>
  ← Back
</button>
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
    </>
  );
}
const backBtn = {
  marginBottom: "5px",
  padding: "8px 12px",
  background: "#588157",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};
export default OrderHistory;