import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";

function BookTable() {

  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [guests,setGuests] = useState(1);
  const [date,setDate] = useState("");
  const [time,setTime] = useState("");

  const handleBooking = async () => {

    if (!name.trim() || !phone.trim() || !date || !time || guests < 1) {
      alert("Please fill all booking details ❗");
      return;
    }

    const res = await fetch("http://localhost:5000/book-table",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        name,
        phone,
        guests,
        date,
        time
      })
    });

    const data = await res.json();

    alert(data.message);

    setTimeout(()=>{
      navigate("/menu");
    },500);

  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: colors.bg
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "580px",
          background: colors.card,
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
        }}
      >

        <button
          onClick={() => navigate("/menu")}
          style={backBtn}
        >
          ← Back
        </button>

        <h1 style={{ marginBottom:"20px", color: colors.text }}>
          Book a Table 🍽
        </h1>

        <input
          placeholder="Your Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
          style={inputStyle}
        />

        <input
          type="number"
          value={guests}
          onChange={(e)=>setGuests(Number(e.target.value))}
          style={inputStyle}
        />

        <input
          type="date"
          value={date}
          onChange={(e)=>setDate(e.target.value)}
          style={inputStyle}
        />

        <input
          type="time"
          value={time}
          onChange={(e)=>setTime(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleBooking}
          style={btnPrimary}
        >
          Book Table
        </button>

      </div>
    </div>
  );
}

/* STYLES */

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #d6ccc2",
  background: colors.bg,
  fontSize: "15px"
};

const backBtn = {
  marginBottom:"20px",
  padding:"8px 16px",
  background: colors.primary,
  color:"white",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer"
};

const btnPrimary = {
  width:"100%",
  padding:"12px",
  marginTop:"10px",
  background: colors.primary,
  color:"white",
  border:"none",
  borderRadius:"10px",
  fontSize:"15px",
  cursor:"pointer",
  fontWeight:"500"
};

export default BookTable;