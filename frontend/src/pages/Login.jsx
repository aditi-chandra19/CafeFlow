import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/menu");
      }
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div style={container}>
      <form onSubmit={handleLogin} style={card}>
        
        <h2 style={title}> CafeFlow </h2>
        <p style={subtitle}>Welcome Back</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
          required
        />

        <button type="submit" style={button}>
          Login
        </button>

        <p style={{ marginTop: "15px", color: colors.muted }}>
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            style={linkBtn}
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
}

/* STYLES */

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "#faf7f2" // parchment
};

const card = {
  background: "var(--card)",
color: "var(--text)", // almond cream
  padding: "40px",
  borderRadius: "20px",
  width: "350px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  textAlign: "center"
};

const title = {
  marginBottom: "5px",
  color: "rgb(0, 0, 0)"
};

const subtitle = {
  marginBottom: "20px",
  color: "#848560",
  fontSize: "14px"
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #d6ccc2",
  background: "#faf7f2"
};

const button = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#588157", // fern
  color: "white",
  fontWeight: "500",
  cursor: "pointer"
};

const linkBtn = {
  background: "none",
  border: "none",
  color: "#b08968", // copper
  cursor: "pointer",
  padding: 0,
  fontWeight: "500"
};

export default Login;