import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import { colors } from "../theme";

function LiveTracking() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  // ✅ LOAD ONLY LATEST ORDER GROUP
  useEffect(() => {
    const savedOrders =
      JSON.parse(localStorage.getItem("orderHistory")) || [];

    if (savedOrders.length > 0) {
      const lastOrderTime = savedOrders[savedOrders.length - 1]?.date;

      const latestOrders = savedOrders.filter(
        (order) => order.date === lastOrderTime
      );

      setOrders(latestOrders);
    }

    const timer = setTimeout(() => {
      navigate("/menu");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  // ✅ STATUS CHANGE LOGIC
  useEffect(() => {
    const timers = [];

    orders.forEach((order) => {
      setStatusMap(prev => ({
        ...prev,
        [order.orderId]: "Preparing 🍳"
      }));

      timers.push(setTimeout(() => {
        setStatusMap(prev => ({
          ...prev,
          [order.orderId]: "On the way 🚴"
        }));
      }, 3000));

      timers.push(setTimeout(() => {
        setStatusMap(prev => ({
          ...prev,
          [order.orderId]: "Delivered ✅"
        }));
      }, 6000));
    });

    return () => timers.forEach(clearTimeout);
  }, [orders]);
const getProgressWidth = (status) => {
  if (status?.includes("Preparing")) return "30%";
  if (status?.includes("On the way")) return "70%";
  if (status?.includes("Delivered")) return "100%";
  return "30%";
};
  return (
    <>
      <Toolbar />

      <div style={page}>
        <h1 style={{ color: colors.text }}>
          Live Order Tracking 🚚
        </h1>

        {orders.map((order, index) => (
          <div key={index + order.restaurantName} style={card}>

            <h2 style={{ color: colors.primary }}>
              {order.restaurantName}
            </h2>

            {order.items.map((item) => (
              <p key={item._id}>
                {item.name} x {item.qty}
              </p>
            ))}

            <p>🚴 {order.deliveryPartner || "Rider Assigned"}</p>

            <p>
              Status: {statusMap[order.orderId] || "Preparing 🍳"}
            </p>

            <div style={progressBar}>
  <div
    style={{
      ...progressFill,
      width: getProgressWidth(statusMap[order.orderId])
    }}
  ></div>
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
  padding: "40px"
};

const card = {
  background: "#EADBC8",
  padding: "20px",
  borderRadius: "15px",
  marginTop: "20px"
};

const progressBar = {
  height: "8px",
  background: "#ddd",
  borderRadius: "10px",
  marginTop: "10px"
};

const progressFill = {
  height: "100%",
  width: "60%",
  background: "#588157",
  borderRadius: "10px"
};

export default LiveTracking;