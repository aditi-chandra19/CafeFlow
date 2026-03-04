import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        navigate("/restaurants");
      }
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div style={container}>
      <form onSubmit={handleLogin} style={card}>
        <h2 style={{ marginBottom: "20px" }}>☕ CafeFlow Login</h2>

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

        <p style={{ marginTop: "15px" }}>
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              cursor: "pointer",
              padding: 0,
            }}  
          >
            Register
            </button>
        </p>
      </form>
    </div>
  );
}

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "#f4f6f9",
};

const card = {
  background: "white",
  padding: "40px",
  borderRadius: "12px",
  width: "350px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  textAlign: "center",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const button = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#3b82f6",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

export default Login;