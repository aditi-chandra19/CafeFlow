import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import { colors } from "../theme";

function OrderSuccess() {
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);

  useEffect(() => {
    const savedBatch = JSON.parse(localStorage.getItem("currentOrderBatch") || "null");
    setBatch(savedBatch);
    const timer = setTimeout(() => navigate("/tracking"), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <Toolbar />
      <div className="page-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="glass-panel" style={card}>
          <div style={icon}>Paid</div>
          <h1 style={{ color: colors.text, fontSize: "3rem" }}>Order placed successfully</h1>
          <p style={{ color: colors.muted, marginTop: "10px" }}>Preparing your food and assigning riders now. Redirecting to live tracking.</p>

          {batch && (
            <div style={{ marginTop: "20px", display: "grid", gap: "10px" }}>
              <div style={miniCard}><strong>Total paid</strong><span>Rs {batch.pricing.grandTotal}</span></div>
              <div style={miniCard}><strong>Delivery partners</strong><span>{batch.orders.length}</span></div>
              <div style={miniCard}><strong>ETA</strong><span>{batch.estimatedMinutes} mins</span></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const card = { width: "min(540px, 100%)", borderRadius: "30px", padding: "32px", textAlign: "center", background: "rgba(255,255,255,0.92)" };
const icon = { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "88px", height: "88px", borderRadius: "50%", background: "rgba(22,163,74,0.1)", color: colors.success, fontWeight: 700, marginBottom: "14px" };
const miniCard = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: "18px", background: colors.card, border: `1px solid ${colors.border}` };

export default OrderSuccess;
