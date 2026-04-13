import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import { colors } from "../theme";
import { formatCurrency } from "../lib/format";
import { getCurrentOrderBatch } from "../lib/storage";
import {
  BackButton,
  PageContainer,
  PageHeading,
  SurfacePanel,
} from "../components/ui/AppShell";

function OrderSummary() {
  const navigate = useNavigate();
  const batch = getCurrentOrderBatch();
  const totalAmount = useMemo(() => batch?.pricing?.grandTotal || 0, [batch]);

  return (
    <>
      <Toolbar />
      <PageContainer maxWidth="820px">
        <SurfacePanel style={card}>
          <BackButton onClick={() => navigate(-1)} style={backBtn}>Back</BackButton>
          <div style={{ marginTop: "14px" }}>
            <PageHeading title="Order summary" />
          </div>
          <div style={{ marginTop: "20px", display: "grid", gap: "12px" }}>
            {batch?.orders?.map((order) => (
              <div key={order.orderId} style={orderCard}>
                <h3 style={{ color: colors.primaryDark, fontSize: "2rem" }}>{order.restaurantName}</h3>
                {order.items.map((item) => <p key={`${order.orderId}-${item._id}`} style={{ color: colors.muted }}>{item.name} x {item.qty}</p>)}
                <p style={{ fontWeight: 700, marginTop: "8px" }}>{formatCurrency(order.finalTotalAmount || order.totalAmount)}</p>
              </div>
            )) || <p style={{ color: colors.muted }}>No active summary found.</p>}
          </div>
          <div style={billBox}><h2>Total: {formatCurrency(totalAmount)}</h2></div>
          <button className="luxury-button" style={backBtn} onClick={() => navigate("/payment")}>Proceed to payment</button>
        </SurfacePanel>
      </PageContainer>
    </>
  );
}
const card = { maxWidth: "820px", margin: "0 auto", borderRadius: "30px", padding: "24px" };
const orderCard = { padding: "16px", borderRadius: "18px", background: colors.card, border: `1px solid ${colors.border}` };
const billBox = { marginTop: "20px", marginBottom: "16px" };
const backBtn = { background: colors.primary, color: "white" };
export default OrderSummary;
