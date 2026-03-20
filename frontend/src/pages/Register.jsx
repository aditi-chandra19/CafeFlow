import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registered successfully!");
      navigate("/");
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div style={container}>
      <form onSubmit={handleRegister} style={card}>
        <h2 style={heading}>CafeFlow</h2>
        <p style={subtext}>Create your account</p>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
          required
        />

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
          Register
        </button>

        {/* LOGIN LINE */}
        <p style={loginText}>
          Already have an account?{" "}
          <span style={loginLink} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

/* 🎨 EXACT PALETTE */

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "#FAF7F2", // main background
};

const card = {
  background: "var(--card)",
color: "var(--text)", // card beige
  padding: "40px",
  borderRadius: "25px",
  width: "350px",
  textAlign: "center",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const heading = {
  marginBottom: "5px",
  color: "#2F2F2F",
};

const subtext = {
  marginBottom: "20px",
  color: "#848560", // olive tone
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "none",
  background: "#FAF7F2",
  outline: "none",
  color: "#2F2F2F",
};

const button = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  background: "#588157", // main green
  color: "white",
  fontWeight: "500",
  cursor: "pointer",
};

const loginText = {
  marginTop: "15px",
  color: "#848560",
};

const loginLink = {
  color: "#B08968", // brown accent
  cursor: "pointer",
  fontWeight: "500",
};

export default Register;