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
    setTimeout(()=> {navigate("/menu");
    },500);
    
  };

  return (
    <div style={{padding:"40px"}}>

      {/* BACK BUTTON */}
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

      <h1>Book a Table 🍽</h1>

      <input
        placeholder="Your Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e)=>setPhone(e.target.value)}
      />

      <br/><br/>

      <input
        type="number"
        value={guests}
        onChange={(e)=>setGuests(e.target.value)}
      />

      <br/><br/>

      <input
        type="date"
        value={date}
        onChange={(e)=>setDate(e.target.value)}
      />

      <br/><br/>

      <input
        type="time"
        value={time}
        onChange={(e)=>setTime(e.target.value)}
      />

      <br/><br/>

      <button onClick={handleBooking}>
        Book Table
      </button>

    </div>
  );
}

export default BookTable;