import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import { colors } from "../theme";

function DiningHelp() {
  const navigate = useNavigate();
  const sections = [
    { title: "Booking issues", copy: "Having trouble reserving a table? Check time slots and guest count.", route: "/bookings" },
    { title: "Payment problems", copy: "Retry with another payment option like UPI, COD, card, or net banking.", route: "/payment" },
    { title: "Order tracking", copy: "Use live tracking to see riders and map location after payment.", route: "/tracking" },
    { title: "Contact support", copy: "support@cafeflow.com • +91 98765 43210", route: null },
  ];

  return (
    <>
      <Toolbar />
      <div className="page-shell">
        <div className="glass-panel" style={card}>
          <button className="luxury-button" style={backBtn} onClick={() => navigate(-1)}>Back</button>
          <h1 style={{ fontSize: "3rem", color: colors.text, marginTop: "12px" }}>Dining help</h1>
          <p style={{ color: colors.muted, marginTop: "8px" }}>Support for bookings, orders, payments, and delivery updates.</p>
          <div style={{ marginTop: "22px", display: "grid", gap: "14px" }}>
            {sections.map((section) => (
              <div key={section.title} style={helpCard} onClick={() => section.route && navigate(section.route)}>
                <h3 style={{ fontSize: "2rem", color: colors.text }}>{section.title}</h3>
                <p style={{ color: colors.muted, marginTop: "6px" }}>{section.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
const card = { maxWidth: "820px", margin: "0 auto", borderRadius: "30px", padding: "24px" };
const helpCard = { padding: "18px", borderRadius: "20px", background: colors.card, border: `1px solid ${colors.border}`, cursor: "pointer" };
const backBtn = { background: colors.primary, color: "white" };
export default DiningHelp;
