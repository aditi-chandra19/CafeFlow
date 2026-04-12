import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { colors } from "../theme";

function Toolbar() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  const address = JSON.parse(localStorage.getItem("deliveryDetails"));
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Aditi" };
  const savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];

  return (
    <>
      <header style={toolbarWrap}>
        <div style={toolbar}>
          <button type="button" style={brandButton} onClick={() => navigate("/menu")}>
            <span style={brandDot} />
            <span style={brandText}>CafeFlow</span>
          </button>

          <div style={centerRow}>
            <button type="button" style={locationChip} onClick={() => setShowAddress((prev) => !prev)}>
              <span style={chipLabel}>Location</span>
              <strong>{address?.city || "Set delivery area"}</strong>
            </button>
            <div style={utilityChip}>Dining + delivery</div>
            <div style={utilityChip}>Live tracking</div>
          </div>

          <div style={rightRow}>
            <div style={accountPill}>
              <span style={chipLabel}>Account</span>
              <strong>{user.name}</strong>
            </div>

            <div style={{ position: "relative" }}>
              <button type="button" style={menuButton} onClick={() => setOpenMenu((prev) => !prev)}>
                Menu
              </button>

              {openMenu && (
                <div className="spotlight-card" style={dropdown}>
                  <button type="button" style={dropdownItem} onClick={() => navigate("/profile")}>Profile</button>
                  <button type="button" style={dropdownItem} onClick={() => navigate("/favorites")}>Favorites</button>
                  <button type="button" style={dropdownItem} onClick={() => navigate("/orders")}>Orders</button>
                  <button type="button" style={dropdownItem} onClick={() => navigate("/transactions")}>Transactions</button>
                  <button type="button" style={dropdownItem} onClick={() => navigate("/bookings")}>Bookings</button>
                  <button type="button" style={dropdownItem} onClick={() => navigate("/help")}>Support</button>
                  <div style={divider} />
                  <button
                    type="button"
                    style={{ ...dropdownItem, color: "#b42318" }}
                    onClick={() => {
                      localStorage.clear();
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showAddress && (
        <div className="spotlight-card" style={addressBox}>
          <div>
            <p className="muted-kicker">Saved addresses</p>
            <h4 style={addressTitle}>Choose a delivery point</h4>
          </div>

          {savedAddresses.length ? (
            savedAddresses.map((addr, index) => (
              <div key={index} style={addressCard}>
                <div>
                  <strong style={{ color: colors.text }}>{addr.name}</strong>
                  <p style={addressText}>{addr.address}</p>
                  <p style={addressText}>{addr.city} - {addr.pincode}</p>
                </div>
                <button
                  type="button"
                  style={useButton}
                  onClick={() => {
                    localStorage.setItem("deliveryDetails", JSON.stringify(addr));
                    setShowAddress(false);
                    window.location.reload();
                  }}
                >
                  Use address
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: colors.muted }}>
              No saved addresses yet. Add one during delivery to personalize the app.
            </p>
          )}
        </div>
      )}
    </>
  );
}

const toolbarWrap = {
  position: "sticky",
  top: 0,
  zIndex: 3000,
  padding: "18px 24px 0",
};

const toolbar = {
  maxWidth: "1440px",
  margin: "0 auto",
  background: "rgba(17, 24, 39, 0.88)",
  color: "white",
  borderRadius: "24px",
  padding: "14px 18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px",
  flexWrap: "wrap",
  boxShadow: "0 22px 54px rgba(17, 24, 39, 0.18)",
};

const brandButton = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  border: "none",
  background: "transparent",
  color: "white",
  minHeight: "auto",
  padding: 0,
  boxShadow: "none",
};

const brandDot = {
  width: "14px",
  height: "14px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #bf4e3b, #c58a2c)",
  boxShadow: "0 0 0 6px rgba(191,78,59,0.12)",
};

const brandText = {
  fontFamily: '"Outfit", sans-serif',
  fontWeight: 800,
  fontSize: "1.55rem",
  letterSpacing: "-0.04em",
};

const centerRow = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
  flex: 1,
  justifyContent: "center",
};

const chipLabel = {
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  color: "rgba(255,255,255,0.62)",
  fontWeight: 800,
};

const locationChip = {
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  borderRadius: "16px",
  padding: "10px 14px",
  minHeight: "auto",
  display: "grid",
  gap: "2px",
  textAlign: "left",
  boxShadow: "none",
};

const utilityChip = {
  padding: "11px 14px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.88)",
  fontWeight: 600,
  fontSize: "0.9rem",
};

const rightRow = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const accountPill = {
  padding: "10px 14px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.08)",
  display: "grid",
  gap: "2px",
  minWidth: "120px",
};

const menuButton = {
  background: "linear-gradient(135deg, #bf4e3b, #c58a2c)",
  color: "white",
  border: "none",
  borderRadius: "16px",
  padding: "12px 16px",
  fontWeight: 800,
};

const dropdown = {
  position: "absolute",
  right: 0,
  top: "58px",
  width: "240px",
  padding: "10px",
  borderRadius: "22px",
  background: "rgba(255,255,255,0.98)",
  border: `1px solid ${colors.border}`,
  boxShadow: "0 24px 56px rgba(17, 24, 39, 0.18)",
  zIndex: 3001,
  display: "grid",
  gap: "4px",
};

const dropdownItem = {
  border: "none",
  background: "transparent",
  textAlign: "left",
  color: colors.text,
  padding: "12px 12px",
  borderRadius: "14px",
  minHeight: "auto",
  boxShadow: "none",
  fontWeight: 600,
};

const divider = {
  height: "1px",
  background: colors.border,
  margin: "6px 2px",
};

const addressBox = {
  position: "absolute",
  top: "92px",
  left: "24px",
  width: "340px",
  padding: "18px",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.98)",
  border: `1px solid ${colors.border}`,
  boxShadow: "0 24px 56px rgba(17, 24, 39, 0.15)",
  zIndex: 3001,
  display: "grid",
  gap: "12px",
};

const addressTitle = {
  marginTop: "8px",
  color: colors.text,
  fontSize: "1.45rem",
};

const addressCard = {
  padding: "14px",
  borderRadius: "18px",
  background: colors.card,
  border: `1px solid ${colors.border}`,
  display: "grid",
  gap: "10px",
};

const addressText = {
  color: colors.muted,
  marginTop: "4px",
};

const useButton = {
  background: colors.primary,
  color: "white",
  border: "none",
  borderRadius: "14px",
  fontWeight: 800,
  justifySelf: "start",
  padding: "10px 14px",
  minHeight: "auto",
};

export default Toolbar;
