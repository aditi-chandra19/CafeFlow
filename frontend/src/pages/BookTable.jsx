import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BookTable() {

  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [guests,setGuests] = useState(1);
  const [date,setDate] = useState("");
  const [time,setTime] = useState("");

  const handleBooking = async () => {

    // validation check
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
        background: "linear-gradient(135deg,#f8fafc,#e2e8f0)"
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "580px",  
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}
      >

        <button
          onClick={() => navigate("/menu")}
          style={{
            marginBottom:"20px",
            padding:"8px 16px",
            background:"#444",
            color:"white",
            border:"none",
            borderRadius:"8px",
            cursor:"pointer"
          }}
        >
          ← Back
        </button>

        <h1 style={{marginBottom:"20px"}}>Book a Table 🍽</h1>

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
          style={{
            width:"100%",
            padding:"12px",
            marginTop:"10px",
            background:"#16a34a",
            color:"white",
            border:"none",
            borderRadius:"10px",
            fontSize:"16px",
            cursor:"pointer"
          }}
        >
          Book Table
        </button>

      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "15px"
};

export default BookTable;