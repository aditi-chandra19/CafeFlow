import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import {
  BackButton,
  PageContainer,
  PageHeading,
  SplitLayout,
  SurfacePanel,
} from "../components/ui/AppShell";
import { getCurrentOrderBatch } from "../lib/storage";
import { colors } from "../theme";

function LiveTracking() {
  const navigate = useNavigate();
  const batch = getCurrentOrderBatch();

  const mapSrc = useMemo(() => {
    const lat = batch?.delivery?.lat || 12.9716;
    const lng = batch?.delivery?.lng || 77.5946;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.03}%2C${lat - 0.02}%2C${lng + 0.03}%2C${lat + 0.02}&layer=mapnik&marker=${lat}%2C${lng}`;
  }, [batch]);

  if (!batch) {
    return (
      <>
        <Toolbar />
        <PageContainer maxWidth="760px">
          <SurfacePanel style={{ borderRadius: "32px", padding: "30px" }}>
            <PageHeading title="No active order" subtitle="Place an order first to unlock the live delivery view." />
            <button className="luxury-button" style={{ ...primaryButton, marginTop: "18px" }} onClick={() => navigate("/menu")}>
              Back to menu
            </button>
          </SurfacePanel>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Toolbar />
      <PageContainer maxWidth="1360px">
        <BackButton onClick={() => navigate("/menu")} style={{ marginBottom: "18px" }}>
          Back to menu
        </BackButton>

        <SplitLayout columns="minmax(0, 1.25fr) minmax(360px, 0.75fr)">
          <SurfacePanel style={mapPanel}>
            <PageHeading
              title="Live order tracking"
              subtitle="Monitor rider progress and destination status through a cleaner delivery dashboard."
            />

            <div style={mapWrap}>
              <iframe title="Live delivery map" src={mapSrc} style={mapFrame} />
            </div>

            <div style={statusStrip}>
              <div style={statusCard}>
                <span style={statusLabel}>Destination</span>
                <strong style={statusValue}>{batch.delivery?.label || "Saved address"}</strong>
              </div>
              <div style={statusCard}>
                <span style={statusLabel}>Riders active</span>
                <strong style={statusValue}>{batch.orders.length}</strong>
              </div>
              <div style={statusCard}>
                <span style={statusLabel}>Tracking mode</span>
                <strong style={statusValue}>Live</strong>
              </div>
            </div>
          </SurfacePanel>

          <SurfacePanel style={sidePanel}>
            <div style={panelHeader}>
              <h2 style={panelTitle}>Delivery activity</h2>
              <p style={panelCopy}>
                Multi-restaurant orders keep separate dispatch cards so the live view stays clear.
              </p>
            </div>

            <div style={deliveryStack}>
              {batch.orders.map((order, index) => (
                <article key={order.orderId} style={trackingCard}>
                  <div style={trackingHeader}>
                    <div>
                      <p className="muted-kicker">Restaurant</p>
                      <strong style={trackingTitle}>{order.restaurantName}</strong>
                    </div>
                    <span style={statusPill}>On the way</span>
                  </div>

                  <div style={detailGrid}>
                    <div style={detailBlock}>
                      <span style={detailLabel}>Partner</span>
                      <strong style={detailValue}>{order.deliveryPartner.name}</strong>
                    </div>
                    <div style={detailBlock}>
                      <span style={detailLabel}>Vehicle</span>
                      <strong style={detailValue}>{order.deliveryPartner.vehicle}</strong>
                    </div>
                    <div style={detailBlock}>
                      <span style={detailLabel}>Phone</span>
                      <strong style={detailValue}>{order.deliveryPartner.phone}</strong>
                    </div>
                  </div>

                  <div style={progressBlock}>
                    <div style={progressMeta}>
                      <span style={detailLabel}>Route progress</span>
                      <strong style={detailValue}>{index === 0 ? "72%" : "58%"}</strong>
                    </div>
                    <div style={progressBar}>
                      <div style={{ ...progressFill, width: index === 0 ? "72%" : "58%" }} />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button className="luxury-button" style={primaryButton} onClick={() => navigate("/menu")}>
              Continue browsing
            </button>
          </SurfacePanel>
        </SplitLayout>
      </PageContainer>
    </>
  );
}

const mapPanel = {
  borderRadius: "32px",
  padding: "24px",
};

const sidePanel = {
  borderRadius: "32px",
  padding: "24px",
  display: "grid",
  gap: "18px",
};

const mapWrap = {
  marginTop: "22px",
  borderRadius: "28px",
  overflow: "hidden",
  border: `1px solid ${colors.border}`,
  boxShadow: "0 18px 40px rgba(17, 24, 39, 0.08)",
};

const mapFrame = {
  width: "100%",
  height: "480px",
  border: "0",
};

const statusStrip = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "14px",
  marginTop: "18px",
};

const statusCard = {
  padding: "18px",
  borderRadius: "22px",
  background: colors.card,
  border: `1px solid ${colors.border}`,
  display: "grid",
  gap: "8px",
};

const statusLabel = {
  color: colors.muted,
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  fontWeight: 800,
};

const statusValue = {
  color: colors.text,
  fontSize: "1rem",
};

const panelHeader = {
  display: "grid",
  gap: "8px",
};

const panelTitle = {
  fontSize: "2rem",
  color: colors.text,
};

const panelCopy = {
  color: colors.muted,
};

const deliveryStack = {
  display: "grid",
  gap: "12px",
};

const trackingCard = {
  padding: "20px",
  borderRadius: "24px",
  background: "white",
  border: `1px solid ${colors.border}`,
  boxShadow: "0 16px 34px rgba(17, 24, 39, 0.06)",
  display: "grid",
  gap: "16px",
};

const trackingHeader = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "start",
};

const trackingTitle = {
  color: colors.text,
  marginTop: "8px",
  fontSize: "1.15rem",
};

const statusPill = {
  padding: "8px 12px",
  borderRadius: "999px",
  background: "rgba(47,106,96,0.1)",
  color: colors.secondary,
  fontWeight: 700,
};

const detailGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "12px",
};

const detailBlock = {
  display: "grid",
  gap: "5px",
};

const detailLabel = {
  color: colors.muted,
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  fontWeight: 800,
};

const detailValue = {
  color: colors.text,
  fontSize: "0.95rem",
};

const progressBlock = {
  display: "grid",
  gap: "10px",
};

const progressMeta = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  alignItems: "center",
};

const progressBar = {
  height: "10px",
  background: "rgba(191,78,59,0.1)",
  borderRadius: "999px",
  overflow: "hidden",
};

const progressFill = {
  height: "100%",
  borderRadius: "999px",
  background: "linear-gradient(90deg, #bf4e3b 0%, #2f6a60 100%)",
};

const primaryButton = {
  background: "linear-gradient(135deg, #bf4e3b, #c58a2c)",
  color: "white",
  width: "100%",
};

export default LiveTracking;
