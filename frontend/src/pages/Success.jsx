import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

function Success() {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [seconds, setSeconds] = useState(10); // delivery countdown
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // countdown timer
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
      {showConfetti && <Confetti numberOfPieces={250} />}

      <div style={styles.card}>
        <div style={styles.checkmark}>✓</div>

        <h1 style={styles.title}>Order Confirmed 🎉</h1>

        <p style={styles.subtitle}>
          Estimated Delivery Time: 20–25 mins
        </p>

        <p style={styles.timer}>
          Redirecting in {seconds} seconds...
        </p>

        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div
            style={{
              ...styles.progressBar,
              width: `${progress}%`
            }}
          />
        </div>
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
    background: "linear-gradient(135deg, #10b981, #3b82f6)",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
    width: "350px"
  },
  checkmark: {
    fontSize: "70px",
    color: "#10b981",
    marginBottom: "15px",
    animation: "pop 0.6s ease"
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px"
  },
  subtitle: {
    color: "#555",
    marginBottom: "10px"
  },
  timer: {
    fontSize: "14px",
    marginBottom: "15px",
    color: "#888"
  },
  progressContainer: {
    height: "8px",
    width: "100%",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden"
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #10b981, #3b82f6)",
    transition: "width 1s linear"
  }
};

export default Success;