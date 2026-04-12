import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";
import Toolbar from "../components/Toolbar";
import { couponRates, getOrderPricing, groupCartItems } from "../utils/pricing";
import { createOrderBatch, groupOrdersByRestaurant } from "../lib/orders";
import {
  appendOrderHistory,
  clearCart,
  getActiveCoupon,
  getCart,
  getDeliveryDetails,
  setCurrentOrderBatch,
} from "../lib/storage";
import { formatCurrency } from "../lib/format";
import {
  BackButton,
  PageContainer,
  PageHeading,
  SplitLayout,
  SummaryRow,
  SurfacePanel,
} from "../components/ui/AppShell";

function Payment() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("HDFC Bank");

  const cart = Object.values(groupCartItems(getCart()));
  const delivery = getDeliveryDetails();
  const activeCoupon = getActiveCoupon();
  const pricing = useMemo(
    () => getOrderPricing(cart, activeCoupon?.rate || 0),
    [cart, activeCoupon]
  );
  const groupedOrders = useMemo(() => groupOrdersByRestaurant(cart), [cart]);

  const validateAndPay = () => {
    if (!cart.length) {
      alert("Cart is empty");
      return;
    }

    if (!delivery) {
      alert("Delivery details are missing");
      navigate("/delivery");
      return;
    }

    if (paymentMethod === "card" && (!cardName || cardNumber.length < 12 || !expiry || cvv.length < 3)) {
      alert("Fill valid card details");
      return;
    }

    if (paymentMethod === "upi" && !upiId.includes("@")) {
      alert("Enter a valid UPI ID");
      return;
    }

    const batch = createOrderBatch({
      bank,
      cart,
      delivery,
      paymentMethod,
      pricing,
    });

    appendOrderHistory(batch.orders);
    setCurrentOrderBatch(batch);
    clearCart();
    navigate("/success");
  };

  return (
    <>
      <Toolbar />
      <PageContainer>
        <SplitLayout>
          <SurfacePanel>
            <BackButton onClick={() => navigate(-1)}>Back</BackButton>
            <div style={{ marginTop: "16px" }}>
              <PageHeading
                title="Payment options"
                subtitle="Choose how you want to pay. Platform fees and discounts are already included."
              />
            </div>

            <div style={methodGrid}>
              {[
                ["upi", "UPI"],
                ["card", "Card"],
                ["netbanking", "Net Banking"],
                ["cod", "Cash on Delivery"],
              ].map(([value, label]) => (
                <button key={value} className="luxury-button" style={paymentMethod === value ? selectedMethod : methodButton} onClick={() => setPaymentMethod(value)}>{label}</button>
              ))}
            </div>

            {paymentMethod === "card" && (
              <div style={formStack}>
                <input className="luxury-input" placeholder="Cardholder name" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                <input className="luxury-input" placeholder="Card number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                  <input className="luxury-input" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                  <input className="luxury-input" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} />
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div style={formStack}>
                <input className="luxury-input" placeholder="example@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
              </div>
            )}

            {paymentMethod === "netbanking" && (
              <div style={formStack}>
                <select className="luxury-select" value={bank} onChange={(e) => setBank(e.target.value)}>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>SBI</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}

            <button className="luxury-button" style={{ ...primaryBtn, width: "100%", marginTop: "18px" }} onClick={validateAndPay}>Pay Rs {pricing.grandTotal}</button>
          </SurfacePanel>

          <SurfacePanel>
            <h2 style={{ fontSize: "2.3rem", color: colors.text }}>Order summary</h2>
            <div style={{ marginTop: "16px", display: "grid", gap: "12px" }}>
              {groupedOrders.map((order) => (
                <div key={order.restaurantId} style={summaryCard}>
                  <strong>{order.restaurantName}</strong>
                  {order.items.map((item) => <p key={`${item.restaurantId}-${item._id}`} style={{ color: colors.muted }}>{item.name} x {item.qty}</p>)}
                </div>
              ))}
            </div>

            <div style={{ marginTop: "18px", display: "grid", gap: "10px" }}>
              <SummaryRow label="Subtotal" value={formatCurrency(pricing.subtotal)} />
              <SummaryRow label="Delivery fee" value={formatCurrency(pricing.deliveryFee)} />
              <SummaryRow label="Platform fee" value={formatCurrency(pricing.platformFee)} />
              {pricing.multiRestaurantDiscount > 0 && (
                <SummaryRow
                  label="Multi-order discount"
                  value={`- ${formatCurrency(pricing.multiRestaurantDiscount)}`}
                  highlight
                />
              )}
              {pricing.couponDiscount > 0 && (
                <SummaryRow
                  label="Coupon discount"
                  value={`- ${formatCurrency(pricing.couponDiscount)}`}
                  highlight
                />
              )}
              <SummaryRow
                label="Total"
                value={formatCurrency(pricing.grandTotal)}
                style={{
                  borderTop: `1px solid ${colors.border}`,
                  paddingTop: "12px",
                  marginTop: "6px",
                }}
              />
            </div>

            {delivery && (
              <div style={{ ...summaryCard, marginTop: "18px" }}>
                <strong>Delivering to</strong>
                <p>{delivery.name}</p>
                <p style={{ color: colors.muted }}>{delivery.address}</p>
                <p style={{ color: colors.muted }}>{delivery.city} - {delivery.pincode}</p>
              </div>
            )}
          </SurfacePanel>
        </SplitLayout>
      </PageContainer>
    </>
  );
}

const methodGrid = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px", marginTop: "18px" };
const methodButton = { background: colors.card, color: colors.text };
const selectedMethod = { background: colors.primary, color: "white" };
const formStack = { display: "grid", gap: "12px", marginTop: "18px" };
const summaryCard = { padding: "16px", borderRadius: "18px", background: colors.card, border: `1px solid ${colors.border}` };
const primaryBtn = { background: colors.primary, color: "white" };
const secondaryBtn = { background: colors.card, color: colors.text };

export default Payment;
