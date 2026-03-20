import { useNavigate } from "react-router-dom";

function DiningTransactions() {
  const navigate = useNavigate();

  const transactions = [
    {
      id: 1,
      restaurant: "Cafe Mocha",
      date: "20 March 2026",
      amount: "₹450",
      status: "Completed",
    },
    {
      id: 2,
      restaurant: "Green Bowl",
      date: "18 March 2026",
      amount: "₹320",
      status: "Completed",
    },
  ];

  return (
    <div style={container}>
      <div style={card}>
        
        <button style={backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2 style={heading}>Dining Transactions</h2>

        {transactions.map((item) => (
          <div key={item.id} style={transactionCard}>
            <h4>{item.restaurant}</h4>
            <p>{item.date}</p>
            <p>{item.amount}</p>
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

const transactionCard = {
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

export default DiningTransactions;