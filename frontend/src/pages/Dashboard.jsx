import { useEffect, useState } from "react";
import { colors } from "../theme";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/dashboard")
      .then((res) => res.json())
      .then((response) => setData(response))
      .catch(() => setData({ totalUsers: 0, totalOrders: 0, totalMenuItems: 0, totalRevenue: 0 }));
  }, []);

  if (!data) return <div className="page-shell"><h2>Loading...</h2></div>;

  return (
    <div className="page-shell">
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "3.2rem", color: colors.text }}>Admin dashboard</h1>
        <div style={grid}>
          <Card title="Total Users" value={data.totalUsers} />
          <Card title="Total Orders" value={data.totalOrders} />
          <Card title="Menu Items" value={data.totalMenuItems} />
          <Card title="Total Revenue" value={`Rs ${data.totalRevenue}`} />
        </div>
      </div>
    </div>
  );
}

const Card = ({ title, value }) => (
  <div className="glass-panel" style={card}>
    <h3 style={{ fontSize: "2rem", color: colors.text }}>{title}</h3>
    <h2 style={{ color: colors.primaryDark, marginTop: "8px" }}>{value}</h2>
  </div>
);

const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginTop: "24px" };
const card = { padding: "22px", borderRadius: "24px" };

export default Dashboard;
