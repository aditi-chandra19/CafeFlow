import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { colors } from "../theme";

function Success() {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [seconds, setSeconds] = useState(10);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
      setProgress((prev) => prev + 10);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      setShowConfetti(false);
      navigate("/orders");
    }
  }, [seconds, navigate]);

  return (
    <div style={styles.container}>
      {showConfetti && <Confetti numberOfPieces={180} />}

      <div style={styles.card}>
        <div style={styles.checkmark}>✓</div>

        <h1 style={styles.title}>Order Confirmed 🎉</h1>

        <p style={styles.subtitle}>
          Estimated Delivery: 20–25 mins
        </p>

        <p style={styles.timer}>
          Redirecting in {seconds}s...
        </p>

        {/* Progress */}
        <div style={styles.progressContainer}>
          <div
            style={{
              ...styles.progressBar,
              width: `${progress}%`
            }}
          />
        </div>

        <button
          onClick={() => navigate("/orders")}
          style={styles.button}
        >
          View Orders
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#faf7f2" // parchment
  },

  card: {
    background: "#eadbc8", // almond cream
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    width: "360px"
  },

  checkmark: {
    fontSize: "60px",
    color: "#588157", // fern
    marginBottom: "10px"
  },

  title: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#2f2f2f"
  },

  subtitle: {
    color: "#848560", // dusty olive
    marginBottom: "10px"
  },

  timer: {
    fontSize: "14px",
    marginBottom: "15px",
    color: "#848560"
  },

  progressContainer: {
    height: "8px",
    width: "100%",
    background: "#faf7f2",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "15px"
  },

  progressBar: {
    height: "100%",
    background: "#588157", // fern
    transition: "width 1s linear"
  },

  button: {
    marginTop: "10px",
    padding: "10px 20px",
    background: "#b08968", // faded copper
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500"
  }
};

export default Success;