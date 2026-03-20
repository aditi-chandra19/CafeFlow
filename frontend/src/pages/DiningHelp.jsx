import { useNavigate } from "react-router-dom";

function DiningHelp() {
  const navigate = useNavigate(); // ✅ THIS WAS MISSING

  return (
    <div style={container}>
      <div style={card}>
        
        <button style={backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2 style={heading}>Dining Help ❓</h2>

        <p style={subtext}>
          Need help with bookings, orders, or payments? We’ve got you covered.
        </p>

        <div style={section} onClick={() => navigate("/bookings")}>
  <h4>🍽️ Booking Issues</h4>
  <p>Having trouble reserving a table? Make sure your selected time slot is available.</p>
</div>

        <div style={section} onClick={() => navigate("/payment")}>
  <h4>💳 Payment Problems</h4>
  <p>If your payment fails, please try again or use a different payment method.</p>
</div>

        <div style={section} onClick={() => navigate("/transactions")}>
  <h4>📦 Order Not Found</h4>
  <p>Check your order history under Dining Transactions for updates.</p>
</div>

        <div style={section}>
  <h4>📞 Contact Support</h4>
  <p>Email: support@cafeflow.com</p>
  <p>Phone: +91 98765 43210</p>
</div>

      </div>
    </div>
  );
}

/* 🎨 STYLES */

const container = {
  minHeight: "100vh",
  background: "#FAF7F2",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const card = {
  background: "var(--card)",
color: "var(--text)",
  padding: "30px",
  borderRadius: "20px",
  width: "400px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const heading = {
  textAlign: "center",
  marginBottom: "10px",
  color: "#2F2F2F",
};

const subtext = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#848560",
};

const section = {
  marginBottom: "15px",
  padding: "10px",
  background: "#FAF7F2",
  borderRadius: "10px",
  cursor: "pointer", // 👈 THIS MAKES IT FEEL CLICKABLE
  transition: "0.2s",
};

/* ✅ THIS WAS MISSING */
const backBtn = {
  background: "#588157",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  marginBottom: "15px",
};

export default DiningHelp;