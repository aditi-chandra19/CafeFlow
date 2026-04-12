import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import { colors } from "../theme";

function Bookings() {
  const navigate = useNavigate();
  const bookings = [
    { id: 1, restaurant: "Royal Tandoor House", date: "22 April 2026", time: "7:30 PM", guests: 2, status: "Confirmed" },
    { id: 2, restaurant: "Coastal Thali Co.", date: "25 April 2026", time: "1:00 PM", guests: 4, status: "Pending" },
  ];

  return (
    <>
      <Toolbar />
      <div className="page-shell">
        <div className="glass-panel" style={card}>
          <button className="luxury-button" style={backBtn} onClick={() => navigate(-1)}>Back</button>
          <h1 style={{ fontSize: "3rem", color: colors.text, marginTop: "12px" }}>Your bookings</h1>
          <div style={{ marginTop: "20px", display: "grid", gap: "14px" }}>
            {bookings.map((item) => (
              <div key={item.id} style={bookingCard}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "start" }}>
                  <div>
                    <h3 style={{ fontSize: "2rem", color: colors.text }}>{item.restaurant}</h3>
                    <p style={{ color: colors.muted }}>{item.date} • {item.time}</p>
                    <p style={{ color: colors.text }}>Guests: {item.guests}</p>
                  </div>
                  <span style={statusPill}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
const card = { maxWidth: "760px", margin: "0 auto", borderRadius: "30px", padding: "24px" };
const bookingCard = { padding: "18px", borderRadius: "20px", background: colors.card, border: `1px solid ${colors.border}` };
const statusPill = { padding: "8px 12px", borderRadius: "999px", background: "rgba(15,118,110,0.12)", color: colors.secondary, fontWeight: 700 };
const backBtn = { background: colors.primary, color: "white" };
export default Bookings;
