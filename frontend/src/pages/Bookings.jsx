import { useNavigate } from "react-router-dom";

function Bookings() {
  const navigate = useNavigate();

  const bookings = [
    {
      id: 1,
      restaurant: "Cafe Mocha",
      date: "22 March 2026",
      time: "7:30 PM",
      guests: 2,
      status: "Confirmed",
    },
    {
      id: 2,
      restaurant: "Green Bowl",
      date: "25 March 2026",
      time: "1:00 PM",
      guests: 4,
      status: "Pending",
    },
  ];

  return (
    <div style={container}>
      <div style={card}>
        
        <button style={backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2 style={heading}>Your Bookings</h2>

        {bookings.map((item) => (
          <div key={item.id} style={bookingCard}>
            <h4>{item.restaurant}</h4>
            <p>{item.date} • {item.time}</p>
            <p>Guests: {item.guests}</p>
            <span style={status}>{item.status}</span>
          </div>
        ))}

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
};

const card = {
  background: "var(--card)",
  color: "var(--text)",
  padding: "30px",
  borderRadius: "20px",
  width: "400px",
};

const heading = {
  marginBottom: "20px",
};

const bookingCard = {
  background: "#FAF7F2",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "10px",
};

const status = {
  color: "#588157",
  fontWeight: "bold",
};

const backBtn = {
  background: "#588157",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  marginBottom: "15px",
};

export default Bookings;