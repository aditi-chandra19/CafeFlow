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
        <h2 style={{ marginBottom: "20px" }}>CafeFlow Register</h2>
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

export default Register;