import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar";

function DiningTransactions() {

  const navigate = useNavigate();

  const transactions = [
    {
      name: "Cafe Mocha",
      date: "20 March 2026",
      amount: 450
    },
    {
      name: "Green Bowl",
      date: "18 March 2026",
      amount: 320
    }
  ];

  return (
    <>
      <Toolbar />

      <div style={page}>

        <button onClick={() => navigate(-1)} style={backBtn}>
          ← Back
        </button>

        <h1 style={title}>Dining Transactions</h1>

        {transactions.map((t, index) => (
          <div key={index} style={card}>

            <div style={topRow}>
              <h2 style={restaurant}>{t.name}</h2>
              <span style={status}>Completed</span>
            </div>

            <p style={date}>{t.date}</p>

            <div style={bottomRow}>
              <span style={amount}>₹ {t.amount}</span>
            </div>

          </div>
        ))}

      </div>
    </>
  );
}

/* STYLES */

const page = {
  minHeight: "100vh",
  background: "#FAF7F2",
  padding: "40px 20px"
};

const title = {
  marginBottom: "20px",
  color: "#2F2F2F"
};

const card = {
  background: "#EADBC8",
  padding: "20px",
  borderRadius: "15px",
  marginBottom: "20px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const restaurant = {
  margin: 0
};

const date = {
  marginTop: "5px",
  color: "#555"
};

const bottomRow = {
  marginTop: "10px"
};

const amount = {
  fontWeight: "bold",
  fontSize: "18px"
};

const status = {
  background: "#A3B18A",
  color: "white",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "12px"
};

const backBtn = {
  marginBottom: "20px",
  padding: "8px 16px",
  background: "#588157",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

export default DiningTransactions;