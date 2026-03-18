import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <>
    <Toolbar/>
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#f8fafc,#e2e8f0)"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 15px 40px rgba(0,0,0,0.1)"
        }}
      >
        <h1>🎉 Order Placed Successfully</h1>

        <p style={{ marginTop: "10px" }}>
          Your food will arrive in about 25 minutes
        </p>

        <button
          onClick={() => navigate("/menu")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            background: "black",
            color: "white",
            cursor: "pointer"
          }}
        >
          Back To Restaurants
        </button>
      </div>
    </div>
    </>
  );
}

export default OrderSuccess;