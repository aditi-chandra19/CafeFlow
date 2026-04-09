import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";

function BookTable() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleBooking = async () => {
    if (!name.trim() || !phone.trim() || !date || !time || guests < 1) {
      alert("Please fill all booking details.");
      return;
    }

    const res = await fetch("http://localhost:5000/book-table", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        guests,
        date,
        time,
      }),
    });

    const data = await res.json();

    alert(data.message);

    setTimeout(() => {
      navigate("/menu");
    }, 500);
  };

  return (
    <div className="page-shell" style={{ minHeight: "100vh", background: "transparent" }}>
      <div style={layout}>
        <section className="glass-panel" style={showcasePanel}>
          <div style={bookingGlow} />

          <button onClick={() => navigate("/menu")} style={backBtn}>
            Back to dining
          </button>

          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={eyebrow}>Reservation studio</p>
            <h1 style={heroHeading}>
              Book your
              <br />
              signature evening.
            </h1>
            <p style={heroCopy}>
              Designed for seamless arrivals, celebrated anniversaries, and
              long conversations over beautifully plated courses.
            </p>

            <div style={statsGrid}>
              <div style={statCard}>
                <span style={statLabel}>Guest experience</span>
                <strong style={statValue}>4.9/5</strong>
              </div>
              <div style={statCard}>
                <span style={statLabel}>Avg. confirmation</span>
                <strong style={statValue}>Under 2 min</strong>
              </div>
              <div style={statCard}>
                <span style={statLabel}>Best for</span>
                <strong style={statValue}>Date night</strong>
              </div>
            </div>

            <div style={highlightPanel}>
              <div style={highlightRow}>
                <span style={highlightTitle}>Chef's note</span>
                <span style={highlightCopy}>
                  Request a candle-lit table or tasting counter in advance.
                </span>
              </div>
              <div style={highlightRow}>
                <span style={highlightTitle}>Member benefit</span>
                <span style={highlightCopy}>
                  Priority seating windows unlock during peak dinner hours.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel" style={formPanel}>
          <div style={{ marginBottom: "22px" }}>
            <p style={eyebrow}>Guest details</p>
            <h2 style={{ fontSize: "2.6rem", color: colors.text }}>
              Complete your booking
            </h2>
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Full name</label>
            <input
              className="luxury-input"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Phone number</label>
            <input
              className="luxury-input"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div style={twoCol}>
            <div style={fieldGroup}>
              <label style={labelStyle}>Guests</label>
              <input
                className="luxury-input"
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              />
            </div>

            <div style={fieldGroup}>
              <label style={labelStyle}>Date</label>
              <input
                className="luxury-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Arrival time</label>
            <input
              className="luxury-input"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div style={summaryCard}>
            <strong style={{ display: "block", marginBottom: "6px" }}>
              Reservation summary
            </strong>
            <span style={{ color: colors.muted }}>
              {guests} guest{guests > 1 ? "s" : ""} • {date || "Select date"} • {time || "Select time"}
            </span>
          </div>

          <button onClick={handleBooking} className="luxury-button" style={btnPrimary}>
            Confirm reservation
          </button>
        </section>
      </div>
    </div>
  );
}

const layout = {
  maxWidth: "1280px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.1fr) minmax(340px, 0.8fr)",
  gap: "24px",
  alignItems: "stretch",
};

const showcasePanel = {
  borderRadius: "34px",
  padding: "clamp(24px, 4vw, 40px)",
  overflow: "hidden",
  position: "relative",
  background:
    "linear-gradient(180deg, rgba(255, 250, 244, 0.88) 0%, rgba(244, 232, 214, 0.82) 100%)",
};

const formPanel = {
  borderRadius: "34px",
  padding: "clamp(22px, 4vw, 34px)",
  background: "rgba(255, 250, 244, 0.94)",
};

const backBtn = {
  marginBottom: "22px",
  padding: "12px 18px",
  background: "rgba(32, 22, 17, 0.92)",
  color: "white",
  border: "none",
  borderRadius: "999px",
  fontWeight: "700",
  boxShadow: "0 14px 24px rgba(32, 22, 17, 0.16)",
};

const eyebrow = {
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  fontSize: "12px",
  color: colors.muted,
  marginBottom: "10px",
};

const heroHeading = {
  fontSize: "clamp(3rem, 7vw, 5rem)",
  color: colors.text,
  lineHeight: 0.92,
};

const heroCopy = {
  marginTop: "18px",
  color: colors.muted,
  maxWidth: "620px",
  fontSize: "1.02rem",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "14px",
  marginTop: "28px",
};

const statCard = {
  padding: "18px",
  borderRadius: "22px",
  background: "rgba(255, 255, 255, 0.52)",
  border: `1px solid ${colors.border}`,
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  position: "relative",
  zIndex: 1,
};

const statLabel = {
  color: colors.muted,
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  fontSize: "11px",
};

const statValue = {
  color: colors.text,
  fontSize: "1.1rem",
};

const highlightPanel = {
  marginTop: "26px",
  borderRadius: "26px",
  padding: "20px",
  background: "rgba(32, 22, 17, 0.92)",
  color: "#fff8f1",
  display: "grid",
  gap: "14px",
  position: "relative",
  zIndex: 1,
};

const highlightRow = {
  display: "grid",
  gap: "4px",
};

const highlightTitle = {
  fontSize: "12px",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "rgba(255, 248, 241, 0.68)",
};

const highlightCopy = {
  color: "#fff8f1",
};

const fieldGroup = {
  display: "grid",
  gap: "8px",
  marginBottom: "16px",
};

const labelStyle = {
  color: colors.text,
  fontWeight: "700",
  fontSize: "14px",
};

const twoCol = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "14px",
};

const summaryCard = {
  marginTop: "22px",
  padding: "16px 18px",
  borderRadius: "20px",
  background: "rgba(207, 176, 131, 0.18)",
  color: colors.text,
  border: `1px solid ${colors.border}`,
};

const btnPrimary = {
  width: "100%",
  padding: "16px",
  marginTop: "22px",
  background: colors.primary,
  color: "white",
  border: "none",
  borderRadius: "999px",
  fontSize: "15px",
  fontWeight: "700",
  boxShadow: "0 18px 36px rgba(140, 90, 54, 0.28)",
};

const bookingGlow = {
  position: "absolute",
  width: "320px",
  height: "320px",
  right: "-80px",
  top: "-110px",
  background: "radial-gradient(circle, rgba(207,176,131,0.5), transparent 70%)",
};

export default BookTable;
