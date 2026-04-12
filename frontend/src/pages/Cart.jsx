import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import {
  BackButton,
  PageContainer,
  PageHeading,
  SplitLayout,
  SurfacePanel,
  SummaryRow,
} from "../components/ui/AppShell";
import { formatCurrency } from "../lib/format";
import { getActiveCoupon, getCart, setActiveCoupon, setCart } from "../lib/storage";
import { colors } from "../theme";
import { couponRates, getOrderPricing, groupCartItems } from "../utils/pricing";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCartState] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [showCoupons, setShowCoupons] = useState(false);

  useEffect(() => {
    const savedCart = Object.values(groupCartItems(getCart()));
    const activeCoupon = getActiveCoupon();

    setCartState(savedCart);
    if (activeCoupon?.code) {
      setCoupon(activeCoupon.code);
      setDiscountRate(activeCoupon.rate || 0);
    }
  }, []);

  const pricing = useMemo(() => getOrderPricing(cart, discountRate), [cart, discountRate]);

  const groupedCart = useMemo(() => {
    return cart.reduce((acc, item) => {
      if (!acc[item.restaurantId]) acc[item.restaurantId] = [];
      acc[item.restaurantId].push(item);
      return acc;
    }, {});
  }, [cart]);

  const persistCart = (nextCart) => {
    setCartState(nextCart);
    setCart(nextCart);
  };

  const increaseQty = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].qty += 1;
    persistCart(updatedCart);
  };

  const decreaseQty = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].qty > 1) updatedCart[index].qty -= 1;
    else updatedCart.splice(index, 1);
    persistCart(updatedCart);
  };

  const clearCart = () => {
    persistCart([]);
    setActiveCoupon(null);
  };

  const applyCoupon = () => {
    const rate = couponRates[coupon.toUpperCase()];
    if (!rate) {
      alert("Invalid coupon");
      return;
    }

    setDiscountRate(rate);
    setActiveCoupon({ code: coupon.toUpperCase(), rate });
    alert(`${coupon.toUpperCase()} applied successfully`);
  };

  const pickCoupon = (code) => {
    setCoupon(code);
    setDiscountRate(couponRates[code]);
    setActiveCoupon({ code, rate: couponRates[code] });
  };

  const handleCheckout = () => {
    if (!cart.length) {
      alert("Your cart is empty");
      return;
    }

    setActiveCoupon({ code: coupon.toUpperCase(), rate: discountRate });
    navigate("/delivery");
  };

  return (
    <>
      <Toolbar />
      <PageContainer maxWidth="1360px">
        <BackButton onClick={() => navigate(-1)} style={backButton}>
          Back
        </BackButton>

        <SplitLayout columns="minmax(0, 1.22fr) minmax(360px, 0.78fr)">
          <SurfacePanel style={mainPanel}>
            <div style={headerRow}>
              <PageHeading
                title="Your cart"
                subtitle="Review items, confirm pricing, and move into delivery with a clearer app-like layout."
              />
              <div style={metricStrip}>
                <div style={metricCard}>
                  <span style={metricLabel}>Restaurants</span>
                  <strong style={metricValue}>{pricing.restaurantCount || 0}</strong>
                </div>
                <div style={metricCard}>
                  <span style={metricLabel}>Items</span>
                  <strong style={metricValue}>{cart.reduce((sum, item) => sum + item.qty, 0)}</strong>
                </div>
                <div style={metricCard}>
                  <span style={metricLabel}>Riders</span>
                  <strong style={metricValue}>{pricing.assignedRiders}</strong>
                </div>
              </div>
            </div>

            {!cart.length ? (
              <div style={emptyState}>
                <strong style={emptyTitle}>Your cart is empty.</strong>
                <p style={emptyCopy}>Add dishes from a restaurant to start your order.</p>
                <button className="luxury-button" style={primaryButton} onClick={() => navigate("/menu")}>
                  Browse restaurants
                </button>
              </div>
            ) : (
              <div style={groupStack}>
                {Object.keys(groupedCart).map((restId) => (
                  <section key={restId} style={restaurantGroup}>
                    <div style={groupHeader}>
                      <div>
                        <p className="muted-kicker">Restaurant</p>
                        <h2 style={groupTitle}>{groupedCart[restId][0].restaurantName || "Restaurant"}</h2>
                      </div>
                      <span style={groupBadge}>{groupedCart[restId].length} items</span>
                    </div>

                    <div style={itemList}>
                      {groupedCart[restId].map((item) => {
                        const index = cart.findIndex(
                          (cartItem) => cartItem._id === item._id && cartItem.restaurantId === item.restaurantId
                        );

                        return (
                          <article key={`${item.restaurantId}-${item._id}`} style={itemCard}>
                            <div style={itemInfo}>
                              <h3 style={itemName}>{item.name}</h3>
                              <p style={itemMeta}>{item.category} · {formatCurrency(item.price)} each</p>
                            </div>

                            <div style={itemActions}>
                              <div style={qtyControl}>
                                <button className="luxury-button" style={qtyButton} onClick={() => decreaseQty(index)}>-</button>
                                <strong style={{ color: colors.text }}>{item.qty}</strong>
                                <button className="luxury-button" style={qtyButton} onClick={() => increaseQty(index)}>+</button>
                              </div>
                              <strong style={itemTotal}>{formatCurrency(item.price * item.qty)}</strong>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </SurfacePanel>

          <SurfacePanel style={sidePanel}>
            <div style={billCard}>
              <h2 style={billTitle}>Bill summary</h2>
              <div style={rowsStack}>
                <SummaryRow label="Subtotal" value={formatCurrency(pricing.subtotal)} />
                <SummaryRow label="Delivery fee" value={formatCurrency(pricing.deliveryFee)} />
                <SummaryRow label="Platform fee" value={formatCurrency(pricing.platformFee)} />
                {pricing.multiRestaurantDiscount > 0 && (
                  <SummaryRow label="Multi-restaurant discount" value={`- ${formatCurrency(pricing.multiRestaurantDiscount)}`} highlight />
                )}
                {pricing.couponDiscount > 0 && (
                  <SummaryRow label="Coupon savings" value={`- ${formatCurrency(pricing.couponDiscount)}`} highlight />
                )}
                <SummaryRow label="Total" value={formatCurrency(pricing.grandTotal)} style={totalRow} />
              </div>
            </div>

            <div style={offerPanel}>
              <div style={offerHeader}>
                <h3 style={sectionTitle}>Offers</h3>
                <button type="button" onClick={() => setShowCoupons((prev) => !prev)} style={offersToggle}>
                  {showCoupons ? "Hide" : "Show"}
                </button>
              </div>

              <input className="luxury-input" placeholder="Enter coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
              <button className="luxury-button" style={lightButton} onClick={applyCoupon}>Apply coupon</button>

              {showCoupons && (
                <div style={offersList}>
                  <button type="button" style={offerCard} onClick={() => pickCoupon("SAVE10")}>
                    <strong>SAVE10</strong>
                    <span>10% off on subtotal</span>
                  </button>
                  <button type="button" style={offerCard} onClick={() => pickCoupon("SAVE20")}>
                    <strong>SAVE20</strong>
                    <span>20% off on higher value orders</span>
                  </button>
                  <button type="button" style={offerCard} onClick={() => pickCoupon("FEAST25")}>
                    <strong>FEAST25</strong>
                    <span>25% off on premium carts</span>
                  </button>
                </div>
              )}
            </div>

            <div style={opsCard}>
              <p className="muted-kicker">Delivery mode</p>
              <strong style={opsTitle}>
                {pricing.restaurantCount >= 2 ? "Parallel rider assignment" : "Single rider dispatch"}
              </strong>
              <p style={opsCopy}>
                {pricing.restaurantCount >= 2
                  ? "Orders from multiple restaurants will be split across separate delivery partners for faster fulfillment."
                  : "One restaurant in cart means one delivery partner will handle the order."}
              </p>
            </div>

            <div style={actionStack}>
              <button className="luxury-button" style={primaryButton} onClick={handleCheckout}>Proceed to delivery</button>
              <button className="luxury-button" style={neutralButton} onClick={clearCart}>Clear cart</button>
            </div>
          </SurfacePanel>
        </SplitLayout>
      </PageContainer>
    </>
  );
}

const backButton = {
  marginBottom: "18px",
  background: colors.card,
  color: colors.text,
};

const mainPanel = {
  borderRadius: "32px",
  padding: "28px",
};

const sidePanel = {
  borderRadius: "32px",
  padding: "24px",
  position: "sticky",
  top: "92px",
  display: "grid",
  gap: "18px",
};

const headerRow = {
  display: "grid",
  gap: "22px",
};

const metricStrip = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "14px",
};

const metricCard = {
  padding: "18px",
  borderRadius: "22px",
  background: colors.card,
  border: `1px solid ${colors.border}`,
  display: "grid",
  gap: "8px",
};

const metricLabel = {
  color: colors.muted,
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  fontWeight: 800,
};

const metricValue = {
  color: colors.text,
  fontSize: "1.16rem",
};

const emptyState = {
  marginTop: "24px",
  padding: "34px",
  borderRadius: "28px",
  background: colors.card,
  border: `1px solid ${colors.border}`,
  display: "grid",
  gap: "8px",
  justifyItems: "start",
};

const emptyTitle = {
  color: colors.text,
  fontSize: "1.2rem",
};

const emptyCopy = {
  color: colors.muted,
};

const groupStack = {
  display: "grid",
  gap: "18px",
  marginTop: "24px",
};

const restaurantGroup = {
  padding: "22px",
  borderRadius: "28px",
  background: "white",
  border: `1px solid ${colors.border}`,
  boxShadow: "0 16px 34px rgba(17, 24, 39, 0.06)",
};

const groupHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "start",
  gap: "12px",
};

const groupTitle = {
  color: colors.text,
  fontSize: "1.8rem",
  marginTop: "8px",
};

const groupBadge = {
  padding: "9px 12px",
  borderRadius: "999px",
  background: "rgba(47,106,96,0.1)",
  color: colors.secondary,
  fontWeight: 700,
};

const itemList = {
  display: "grid",
  gap: "12px",
  marginTop: "18px",
};

const itemCard = {
  display: "flex",
  justifyContent: "space-between",
  gap: "14px",
  alignItems: "center",
  padding: "16px 18px",
  borderRadius: "22px",
  background: colors.card,
  border: `1px solid ${colors.border}`,
};

const itemInfo = {
  display: "grid",
  gap: "6px",
};

const itemName = {
  color: colors.text,
  fontSize: "1.06rem",
};

const itemMeta = {
  color: colors.muted,
};

const itemActions = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const qtyControl = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const qtyButton = {
  background: "white",
  color: colors.text,
  minWidth: "40px",
  padding: "10px 12px",
};

const itemTotal = {
  color: colors.text,
  minWidth: "92px",
  textAlign: "right",
};

const billCard = {
  padding: "22px",
  borderRadius: "26px",
  background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,247,239,0.98) 100%)",
  border: `1px solid ${colors.border}`,
};

const billTitle = {
  color: colors.text,
  fontSize: "2rem",
};

const rowsStack = {
  display: "grid",
  gap: "12px",
  marginTop: "16px",
};

const totalRow = {
  marginTop: "10px",
  paddingTop: "14px",
  borderTop: `1px solid ${colors.border}`,
};

const offerPanel = {
  padding: "20px",
  borderRadius: "24px",
  background: "white",
  border: `1px solid ${colors.border}`,
  display: "grid",
  gap: "12px",
};

const offerHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
};

const sectionTitle = {
  color: colors.text,
  fontSize: "1.2rem",
};

const offersToggle = {
  border: "none",
  background: "transparent",
  color: colors.primary,
  fontWeight: 700,
  padding: 0,
};

const offersList = {
  display: "grid",
  gap: "10px",
};

const offerCard = {
  border: `1px solid ${colors.border}`,
  background: colors.card,
  borderRadius: "18px",
  padding: "14px 16px",
  display: "grid",
  gap: "4px",
  textAlign: "left",
  color: colors.text,
};

const opsCard = {
  padding: "20px",
  borderRadius: "24px",
  background: "rgba(197,138,44,0.12)",
  border: `1px solid ${colors.border}`,
  display: "grid",
  gap: "8px",
};

const opsTitle = {
  color: colors.text,
  fontSize: "1.1rem",
};

const opsCopy = {
  color: colors.muted,
};

const actionStack = {
  display: "grid",
  gap: "10px",
};

const primaryButton = {
  background: "linear-gradient(135deg, #bf4e3b, #c58a2c)",
  color: "white",
  width: "100%",
};

const lightButton = {
  background: colors.card,
  color: colors.text,
  width: "100%",
};

const neutralButton = {
  background: "#eceff3",
  color: colors.text,
  width: "100%",
};

export default Cart;
