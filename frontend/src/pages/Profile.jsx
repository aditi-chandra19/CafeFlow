import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar";

function Profile() {

  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [name, setName] = useState(storedUser.name || "");
  const [phone, setPhone] = useState(storedUser.phone || "");
  const [email, setEmail] = useState(storedUser.email || "");
  const [dob, setDob] = useState(storedUser.dob || "");
  const [gender, setGender] = useState(storedUser.gender || "");

  const saveProfile = () => {

    const updatedUser = {
      name,
      phone,
      email,
      dob,
      gender
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Profile Updated ✅");
  };

  return (
    <>
      <Toolbar />

      <div style={container}>

        <h2 style={{marginBottom:"20px"}}>Your Profile</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          style={input}
        />

        <input
          placeholder="Mobile"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
          style={input}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          style={input}
        />

        <input
          type="date"
          value={dob}
          onChange={(e)=>setDob(e.target.value)}
          style={input}
        />

        <select
          value={gender}
          onChange={(e)=>setGender(e.target.value)}
          style={input}
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <button onClick={saveProfile} style={saveBtn}>
          Update Profile
        </button>

      </div>
    </>
  );
}

/* STYLES */

const container = {
  maxWidth:"500px",
  margin:"auto",
  padding:"30px",
  background:"#faf7f2",
  borderRadius:"12px",
  marginTop:"20px"
};

const input = {
  width:"100%",
  padding:"12px",
  marginBottom:"15px",
  borderRadius:"10px",
  border:"1px solid #ccc"
};

const saveBtn = {
  width:"100%",
  padding:"12px",
  background:"#588157",
  color:"white",
  border:"none",
  borderRadius:"10px",
  cursor:"pointer",
  fontWeight:"bold"
};

export default Profile;