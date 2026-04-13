import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import { getCurrentOrderBatch } from "../lib/storage";
import CafeIcon from "../components/CafeIcon";

function formatOrderCode(order) {
  const base = String(order.orderId || order._id || Date.now()).replace(/[^0-9a-z]/gi, "").toUpperCase();
  return `CF-${base.slice(-8)}`;
}

function LiveTracking() {
  const navigate = useNavigate();
  const batch = getCurrentOrderBatch();

  const orders = batch?.orders?.length ? batch.orders : [
    {
      orderId: "fallback-1",
      restaurantName: "Spice Junction",
      orderMode: "Delivery",
      deliveryPartner: { name: "Rajesh Kumar", phone: "+91 99999 11111", vehicle: "Bike", rating: 4.8 },
    },
  ];

  const primaryOrder = orders[0];
  const isDeliveryMode = (primaryOrder?.orderMode || "Delivery") === "Delivery";

  const mapPoints = useMemo(
    () => [
      { label: "You", top: "58%", left: "9%", accent: "green" },
      { label: "Partner 2", top: "25%", left: "46%", accent: "orange" },
      { label: "Partner 1", top: "8%", left: "68%", accent: "orange" },
    ],
    []
  );

  const nonDeliveryTitle = primaryOrder?.orderMode === "Dine-in"
    ? "Table order in progress"
    : primaryOrder?.orderMode === "Pre-order"
      ? `Scheduled for ${primaryOrder?.preOrderTime || "19:30"}`
      : "Pickup order in progress";

  return (
    <>
      <Toolbar />
      <div className="app-page-shell">
        <div className="app-content-shell">
          <div className="track-title-row">
            <button type="button" className="track-back-link" onClick={() => navigate(-1)}>
              <CafeIcon kind="arrowLeft" /> Back
            </button>
            <h1>Track Order</h1>
          </div>

          {isDeliveryMode ? (
            <section className="track-layout">
              <div className="track-map-card">
                <div className="track-map-stage">
                  {mapPoints.map((point) => (
                    <div key={point.label} className={`track-map-pin is-${point.accent}`} style={{ top: point.top, left: point.left }}>
                      <span><CafeIcon kind="track" /></span>
                      <small>{point.label}</small>
                    </div>
                  ))}
                </div>

                <div className="track-partners">
                  <h2>Delivery Partners</h2>
                  {orders.map((order) => (
                    <article key={order.orderId} className="track-partners__card">
                      <div className="track-partners__avatar"><CafeIcon kind="profile" /></div>
                      <div>
                        <strong>{order.deliveryPartner?.name || "Delivery Partner"}</strong>
                        <p>? {order.deliveryPartner?.rating || 4.8} • {order.deliveryPartner?.vehicle || "Bike"}</p>
                      </div>
                      <button type="button"><CafeIcon kind="chat" /></button>
                    </article>
                  ))}
                </div>
              </div>

              <div className="track-side">
                <section className="track-eta-card">
                  <p><CafeIcon kind="clock" /> Estimated Delivery</p>
                  <strong>{primaryOrder?.estimatedMinutes || 23} min</strong>
                  <span>Your order will arrive soon</span>
                  <div className="track-eta-card__bar"><div /></div>
                </section>

                <section className="track-status-card">
                  <h2>Order Status</h2>
                  <div className="track-timeline">
                    <div className="track-timeline__item is-active">
                      <span className="track-timeline__dot"><CafeIcon kind="rewards" /></span>
                      <div>
                        <strong>Order Confirmed</strong>
                        <p>Your order has been confirmed</p>
                        <small>In Progress</small>
                      </div>
                    </div>
                    <div className="track-timeline__item">
                      <span className="track-timeline__dot"><CafeIcon kind="browse" /></span>
                      <div>
                        <strong>Preparing</strong>
                        <p>Restaurant is preparing your food</p>
                      </div>
                    </div>
                    <div className="track-timeline__item">
                      <span className="track-timeline__dot"><CafeIcon kind="track" /></span>
                      <div>
                        <strong>Out for Delivery</strong>
                        <p>Delivery partner is on the way</p>
                      </div>
                    </div>
                    <div className="track-timeline__item">
                      <span className="track-timeline__dot"><CafeIcon kind="gift" /></span>
                      <div>
                        <strong>Delivered</strong>
                        <p>Order delivered successfully</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="track-items-card">
                  <h2>Order Items</h2>
                  <div className="track-items-card__list">
                    {orders.map((order) => (
                      <div key={order.orderId} className="track-items-card__item">
                        <strong>{order.restaurantName}</strong>
                        <span>{order.deliveryPartner?.vehicle || "Bike"}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </section>
          ) : (
            <section className="track-layout">
              <div className="track-map-card" style={{ display: "grid", gap: "18px", padding: "26px" }}>
                <div className="profile-card" style={{ margin: 0 }}>
                  <p className="muted-kicker">Order Number</p>
                  <h2 style={{ fontSize: "2.4rem", marginTop: "8px" }}>{formatOrderCode(primaryOrder)}</h2>
                  <p style={{ marginTop: "10px", color: "var(--app-muted, #6b7280)" }}>{primaryOrder?.restaurantName}</p>
                </div>

                <div className="profile-card" style={{ margin: 0 }}>
                  <p className="muted-kicker">Order Mode</p>
                  <h2 style={{ fontSize: "2.1rem", marginTop: "8px" }}>{primaryOrder?.orderMode}</h2>
                  <p style={{ marginTop: "10px", color: "var(--app-muted, #6b7280)" }}>{nonDeliveryTitle}</p>
                </div>
              </div>

              <div className="track-side">
                <section className="track-eta-card">
                  <p><CafeIcon kind="clock" /> {primaryOrder?.orderMode === "Pre-order" ? "Scheduled Time" : "Ready In"}</p>
                  <strong>{primaryOrder?.orderMode === "Pre-order" ? (primaryOrder?.preOrderTime || "19:30") : `${primaryOrder?.estimatedMinutes || 20} min`}</strong>
                  <span>{primaryOrder?.orderMode === "Dine-in" ? "Your table order is being prepared" : "We are preparing your order now"}</span>
                  <div className="track-eta-card__bar"><div /></div>
                </section>

                <section className="track-status-card">
                  <h2>Order Status</h2>
                  <div className="track-timeline">
                    <div className="track-timeline__item is-active">
                      <span className="track-timeline__dot"><CafeIcon kind="rewards" /></span>
                      <div>
                        <strong>Order Confirmed</strong>
                        <p>Your order number has been generated</p>
                        <small>{formatOrderCode(primaryOrder)}</small>
                      </div>
                    </div>
                    <div className="track-timeline__item is-active">
                      <span className="track-timeline__dot"><CafeIcon kind="browse" /></span>
                      <div>
                        <strong>Preparing</strong>
                        <p>Kitchen has started preparing your items</p>
                      </div>
                    </div>
                    <div className="track-timeline__item">
                      <span className="track-timeline__dot"><CafeIcon kind="clock" /></span>
                      <div>
                        <strong>{primaryOrder?.orderMode === "Dine-in" ? "Serving Soon" : primaryOrder?.orderMode === "Pre-order" ? "Ready At Time Slot" : "Ready for Pickup"}</strong>
                        <p>{primaryOrder?.orderMode === "Pre-order" ? `Be ready by ${primaryOrder?.preOrderTime || "19:30"}` : "We will notify you when the order is ready"}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="track-items-card">
                  <h2>Order Items</h2>
                  <div className="track-items-card__list">
                    {orders.map((order) => (
                      <div key={order.orderId} className="track-items-card__item">
                        <strong>{order.restaurantName}</strong>
                        <span>{order.orderMode}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

export default LiveTracking;
