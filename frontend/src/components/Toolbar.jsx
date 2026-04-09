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
      <div style={toolbar}>
        <div style={left}>
          <span style={logo} onClick={() => navigate("/menu")}>
            CafeFlow
          </span>

          <span
            style={{ ...location, cursor: "pointer" }}
            onClick={() => setShowAddress(!showAddress)}
          >
            <span style={locationBadge}>Now serving</span>
            {address?.city || "Set Location"}
          </span>
        </div>

        <div style={centerMeta}>
          <div style={metaPill}>Chef-curated dining</div>
          <div style={metaPill}>Priority reservations</div>
        </div>

        <div style={right}>
          <div style={welcomeBlock}>
            <span style={welcomeEyebrow}>Member lounge</span>
            <strong style={welcomeName}>{user.name}</strong>
          </div>

          <div style={{ position: "relative" }}>
            <button onClick={() => setOpenMenu(!openMenu)} style={menuBtn}>
              Menu
            </button>

            {openMenu && (
              <div style={dropdown}>
                <div style={menuItem} onClick={() => navigate("/profile")}>
                  <span style={icon}>Profile</span>
                  <span>Profile</span>
                </div>

                <div style={menuItem} onClick={() => navigate("/favorites")}>
                  <span style={icon}>Saved</span>
                  <span>Favorites</span>
                </div>

                <div style={menuItem} onClick={() => navigate("/orders")}>
                  <span style={icon}>Orders</span>
                  <span>Order Summary</span>
                </div>

                <div
                  style={menuItem}
                  onClick={() => {
                    navigator.clipboard.writeText("Join CafeFlow");
                    alert("Invite link copied!");
                  }}
                >
                  <span style={icon}>Share</span>
                  <span>Invite your friends</span>
                </div>

                <hr style={divider} />

                <div style={sectionTitle}>Your Experiences</div>

                <div style={item} onClick={() => navigate("/transactions")}>
                  Dining Transactions
                </div>

                <div style={item} onClick={() => navigate("/bookings")}>
                  Your Bookings
                </div>

                <div style={item} onClick={() => navigate("/help")}>
                  Dining Help
                </div>

                <hr style={divider} />

                <div
                  style={{ ...item, color: "#b91c1c", fontWeight: "bold" }}
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddress && (
        <div style={addressBox}>
          <h4 style={{ marginBottom: "12px", fontSize: "1.4rem" }}>Saved Addresses</h4>

          {savedAddresses.length ? (
            savedAddresses.map((addr, i) => (
              <div key={i} style={addressItem}>
                <p>
                  <strong>{addr.name}</strong>
                </p>
                <p>{addr.address}</p>
                <p>
                  {addr.city} - {addr.pincode}
                </p>

                <button
                  onClick={() => {
                    localStorage.setItem("deliveryDetails", JSON.stringify(addr));
                    setShowAddress(false);
                    window.location.reload();
                  }}
                  style={useBtn}
                >
                  Use
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: colors.muted }}>
              No saved address yet. Add one from delivery to personalize bookings.
            </p>
          )}
        </div>
      )}
    </>
  );
}

const toolbar = {
  width: "100%",
  padding: "18px 22px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "sticky",
  top: 0,
  zIndex: 3000,
  borderBottom: `1px solid ${colors.border}`,
  backgroundColor: "rgba(250, 242, 230, 0.74)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  gap: "16px",
  flexWrap: "wrap",
};

const left = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  flexWrap: "wrap",
};

const centerMeta = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  justifyContent: "center",
  flex: 1,
  minWidth: "220px",
};

const right = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const logo = {
  fontFamily: '"Cormorant Garamond", serif',
  fontWeight: "700",
  fontSize: "2rem",
  cursor: "pointer",
  color: colors.text,
};

const location = {
  fontSize: "14px",
  color: colors.text,
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "8px 14px",
  borderRadius: "999px",
  background: "rgba(255, 250, 244, 0.78)",
  border: `1px solid ${colors.border}`,
};

const locationBadge = {
  padding: "4px 8px",
  borderRadius: "999px",
  background: colors.text,
  color: "#fffaf4",
  fontSize: "11px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const metaPill = {
  padding: "8px 12px",
  borderRadius: "999px",
  border: `1px solid ${colors.border}`,
  background: "rgba(255, 250, 244, 0.65)",
  color: colors.muted,
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
};

const welcomeBlock = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  lineHeight: 1.1,
};

const welcomeEyebrow = {
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  color: colors.muted,
};

const welcomeName = {
  color: colors.text,
  fontSize: "14px",
};

const menuBtn = {
  fontSize: "14px",
  background: colors.text,
  color: "#fffaf4",
  border: "none",
  borderRadius: "999px",
  padding: "12px 18px",
  fontWeight: "700",
  boxShadow: "0 14px 30px rgba(32, 22, 17, 0.18)",
};

const dropdown = {
  position: "absolute",
  right: 0,
  top: "62px",
  background: "rgba(255, 250, 244, 0.95)",
  borderRadius: "22px",
  padding: "14px",
  width: "260px",
  zIndex: 2000,
  border: `1px solid ${colors.border}`,
  boxShadow: "0 22px 50px rgba(34, 22, 14, 0.18)",
};

const menuItem = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 10px",
  cursor: "pointer",
  borderRadius: "14px",
  color: colors.text,
};

const icon = {
  minWidth: "56px",
  display: "flex",
  justifyContent: "center",
  color: colors.muted,
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const item = {
  padding: "12px",
  cursor: "pointer",
  borderRadius: "14px",
  color: colors.text,
};

const divider = {
  margin: "10px 0",
  border: "none",
  borderTop: `1px solid ${colors.border}`,
};

const sectionTitle = {
  fontSize: "12px",
  color: colors.muted,
  padding: "6px 10px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
};

const addressBox = {
  position: "absolute",
  top: "86px",
  left: "24px",
  background: "rgba(255, 250, 244, 0.96)",
  padding: "18px",
  borderRadius: "20px",
  width: "290px",
  zIndex: 2000,
  border: `1px solid ${colors.border}`,
  boxShadow: "0 18px 44px rgba(41, 26, 16, 0.14)",
};

const addressItem = {
  marginBottom: "10px",
  padding: "12px",
  border: `1px solid ${colors.border}`,
  borderRadius: "14px",
  background: "#fffdf9",
};

const useBtn = {
  marginTop: "8px",
  padding: "8px 14px",
  background: colors.primary,
  color: "white",
  border: "none",
  borderRadius: "999px",
  fontWeight: "700",
};

export default Toolbar;
