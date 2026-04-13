import { useEffect, useState } from "react";
import Toolbar from "../components/Toolbar";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";
import { apiGet } from "../lib/api";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const localOrders = JSON.parse(localStorage.getItem("orderHistory") || "[]");

    apiGet("/my-orders")
      .then((data) => setOrders(Array.isArray(data) && data.length ? data : localOrders))
      .catch(() => setOrders(localOrders));
  }, []);

  return (
    <>
      <Toolbar />
      <div className="page-shell">
        <div style={{ maxWidth: "920px", margin: "0 auto" }}>
          <button className="luxury-button" style={backBtn} onClick={() => navigate(-1)}>Back</button>
          <div className="glass-panel" style={panel}>
            <h1 style={{ fontSize: "3rem", color: colors.text }}>My orders</h1>
            {orders.length === 0 ? <p style={{ color: colors.muted, marginTop: "16px" }}>No previous orders.</p> : orders.map((order, index) => (
              <div key={order._id || order.orderId || index} style={orderCard}>
                <p><strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : order.date}</p>
                <p><strong>Total:</strong> Rs {order.total || order.finalTotalAmount || order.totalAmount}</p>
                <p><strong>Status:</strong> {order.status || "Preparing"}</p>
                <ul>
                  {(order.items || []).map((item, itemIndex) => <li key={itemIndex}>{item.name} - Rs {item.price} x {item.qty || 1}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
const backBtn = { background: colors.primary, color: "white", marginBottom: "16px" };
const panel = { borderRadius: "30px", padding: "24px" };
const orderCard = { marginTop: "16px", padding: "16px", borderRadius: "18px", background: colors.card, border: `1px solid ${colors.border}` };
export default OrderHistory;
