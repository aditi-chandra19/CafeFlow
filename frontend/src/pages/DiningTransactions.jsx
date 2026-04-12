import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import { colors } from "../theme";

function DiningTransactions() {
  const navigate = useNavigate();
  const transactions = [
    { name: "Royal Tandoor House", date: "20 April 2026", amount: 850 },
    { name: "Bombay Chat Room", date: "18 April 2026", amount: 420 },
  ];

  return (
    <>
      <Toolbar />
      <div className="page-shell">
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <button className="luxury-button" style={backBtn} onClick={() => navigate(-1)}>Back</button>
          <h1 style={{ fontSize: "3rem", color: colors.text, marginTop: "14px" }}>Dining transactions</h1>
          <div style={{ marginTop: "20px", display: "grid", gap: "14px" }}>
            {transactions.map((transaction) => (
              <div key={`${transaction.name}-${transaction.date}`} className="glass-panel" style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "2rem", color: colors.text }}>{transaction.name}</h3>
                    <p style={{ color: colors.muted }}>{transaction.date}</p>
                  </div>
                  <span style={status}>Completed</span>
                </div>
                <strong style={{ display: "block", marginTop: "12px", color: colors.text }}>Rs {transaction.amount}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
const backBtn = { background: colors.primary, color: "white" };
const card = { borderRadius: "24px", padding: "20px" };
const status = { padding: "8px 12px", borderRadius: "999px", background: "rgba(21,128,61,0.12)", color: colors.success, fontWeight: 700 };
export default DiningTransactions;
