import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton, PageContainer, SurfacePanel } from "../components/ui/AppShell";
import { colors } from "../theme";

function BookTable() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleBooking = async () => {
    if (!name.trim() || !phone.trim() || !date || !time || guests < 1) {
      alert("Please fill all booking details.");
      return;
    }

    const res = await fetch("http://localhost:5000/book-table", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, guests, date, time }),
    });

    const data = await res.json();
    alert(data.message);
    setTimeout(() => navigate("/menu"), 500);
  };

  return (
    <PageContainer maxWidth="1360px">
      <BackButton onClick={() => navigate("/menu")} style={{ marginBottom: "18px" }}>
        Back to dining
      </BackButton>

      <div style={layout}>
        <section style={heroPanel}>
          <div style={heroCard}>
            <div style={heroBadge}>Reservation studio</div>
            <h1 style={heroTitle}>Reserve your table with a more app-like booking flow.</h1>
            <p style={heroCopy}>
              Choose guests, date, and time in a simpler booking experience that feels faster,
              clearer, and more modern.
            </p>

            <div style={infoGrid}>
              <div style={infoTile}>
                <span style={infoLabel}>Confirmation</span>
                <strong style={infoValue}>Under 2 min</strong>
              </div>
              <div style={infoTile}>
                <span style={infoLabel}>Best for</span>
                <strong style={infoValue}>Date night and family dining</strong>
              </div>
              <div style={infoTile}>
                <span style={infoLabel}>Experience</span>
                <strong style={infoValue}>Quick and polished reservation flow</strong>
              </div>
            </div>
          </div>

          <div style={notePanel}>
            <div style={noteCard}>
              <p className="muted-kicker">Good to know</p>
              <strong style={noteTitle}>Peak dinner slots fill quickly.</strong>
              <p style={noteCopy}>Book early if you want quieter seating or celebration-friendly timing.</p>
            </div>
            <div style={noteCardDark}>
              <p className="muted-kicker" style={{ color: "rgba(255,255,255,0.64)" }}>Optional request</p>
              <strong style={{ color: "white" }}>Add window seat or celebration notes after confirmation.</strong>
            </div>
          </div>
        </section>

        <SurfacePanel style={formPanel}>
          <div style={formHeader}>
            <p className="muted-kicker">Guest details</p>
            <h2 style={formTitle}>Complete your reservation</h2>
            <p style={formCopy}>Fill in the booking details and confirm your preferred time slot.</p>
          </div>

          <div style={formGrid}>
            <label style={field}>
              <span style={label}>Full name</span>
              <input className="luxury-input" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
            </label>

            <label style={field}>
              <span style={label}>Phone number</span>
              <input className="luxury-input" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>

            <div style={doubleField}>
              <label style={field}>
                <span style={label}>Guests</span>
                <input className="luxury-input" type="number" min="1" value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
              </label>

              <label style={field}>
                <span style={label}>Date</span>
                <input className="luxury-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
            </div>

            <label style={field}>
              <span style={label}>Arrival time</span>
              <input className="luxury-input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </label>
          </div>

          <div style={summaryCard}>
            <span style={summaryLabel}>Reservation summary</span>
            <strong style={summaryValue}>{guests} guest{guests > 1 ? "s" : ""} · {date || "Select date"} · {time || "Select time"}</strong>
          </div>

          <button onClick={handleBooking} className="luxury-button" style={primaryButton}>
            Confirm reservation
          </button>
        </SurfacePanel>
      </div>
    </PageContainer>
  );
}

const layout = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.08fr) minmax(360px, 0.92fr)",
  gap: "24px",
  alignItems: "stretch",
};

const heroPanel = {
  display: "grid",
  gap: "18px",
};

const heroCard = {
  borderRadius: "34px",
  padding: "32px",
  minHeight: "420px",
  background: "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(255,244,238,0.96) 48%, rgba(191,78,59,0.14) 100%)",
  border: `1px solid ${colors.border}`,
  boxShadow: "0 24px 54px rgba(17, 24, 39, 0.10)",
};

const heroBadge = {
  display: "inline-flex",
  padding: "9px 12px",
  borderRadius: "999px",
  background: "rgba(191,78,59,0.1)",
  color: colors.primaryDark,
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  fontWeight: 800,
};

const heroTitle = {
  marginTop: "18px",
  fontSize: "clamp(3.2rem, 5vw, 5rem)",
  lineHeight: 0.92,
  color: colors.text,
  maxWidth: "660px",
};

const heroCopy = {
  marginTop: "18px",
  maxWidth: "580px",
  color: colors.muted,
  fontSize: "1.02rem",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "14px",
  marginTop: "28px",
};

const infoTile = {
  padding: "18px",
  borderRadius: "22px",
  background: "white",
  border: `1px solid ${colors.border}`,
  display: "grid",
  gap: "8px",
};

const infoLabel = {
  color: colors.muted,
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  fontWeight: 800,
};

const infoValue = {
  color: colors.text,
  fontSize: "1rem",
};

const notePanel = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
};

const noteCard = {
  padding: "22px",
  borderRadius: "26px",
  background: colors.card,
  border: `1px solid ${colors.border}`,
  display: "grid",
  gap: "8px",
};

const noteCardDark = {
  padding: "22px",
  borderRadius: "26px",
  background: "#111827",
  display: "grid",
  gap: "8px",
};

const noteTitle = {
  color: colors.text,
  fontSize: "1.05rem",
};

const noteCopy = {
  color: colors.muted,
};

const formPanel = {
  padding: "30px",
  borderRadius: "34px",
  display: "grid",
  gap: "22px",
};

const formHeader = {
  display: "grid",
  gap: "8px",
};

const formTitle = {
  color: colors.text,
  fontSize: "2.8rem",
};

const formCopy = {
  color: colors.muted,
};

const formGrid = {
  display: "grid",
  gap: "16px",
};

const field = {
  display: "grid",
  gap: "8px",
};

const label = {
  color: colors.text,
  fontWeight: 700,
  fontSize: "14px",
};

const doubleField = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "14px",
};

const summaryCard = {
  padding: "18px 20px",
  borderRadius: "22px",
  background: "rgba(197,138,44,0.12)",
  border: `1px solid ${colors.border}`,
  display: "grid",
  gap: "8px",
};

const summaryLabel = {
  color: colors.muted,
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  fontWeight: 800,
};

const summaryValue = {
  color: colors.text,
  fontSize: "1rem",
};

const primaryButton = {
  width: "100%",
  background: "linear-gradient(135deg, #bf4e3b, #c58a2c)",
  color: "white",
};

export default BookTable;
