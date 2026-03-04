import { useEffect, useState } from "react";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/dashboard")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Dashboard 📊</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "30px"
        }}
      >
        <Card title="Total Users" value={data.totalUsers} />
        <Card title="Total Orders" value={data.totalOrders} />
        <Card title="Menu Items" value={data.totalMenuItems} />
        <Card title="Total Revenue" value={`₹ ${data.totalRevenue}`} />
      </div>
    </div>
  );
}

const Card = ({ title, value }) => (
  <div
    style={{
      padding: "20px",
      background: "white",
      borderRadius: "15px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
    }}
  >
    <h3>{title}</h3>
    <h2 style={{ color: "#3b82f6" }}>{value}</h2>
  </div>
);

export default Dashboard;