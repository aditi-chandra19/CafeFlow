import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Delivery() {

  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [address,setAddress] = useState("");
  const [city,setCity] = useState("");
  const [pincode,setPincode] = useState("");

  const [savedAddress,setSavedAddress] = useState(null);

  // Load saved address when page opens
  useEffect(()=>{

    const saved = JSON.parse(localStorage.getItem("deliveryDetails"));

    if(saved){
      setSavedAddress(saved);
    }

  },[]);


  const saveAddress = () => {

    if(!name || !phone || !address || !city || !pincode){
      alert("Please fill all fields ❗");
      return;
    }

    const deliveryDetails = {
      name,
      phone,
      address,
      city,
      pincode
    };

    // Save address
    localStorage.setItem(
      "deliveryDetails",
      JSON.stringify(deliveryDetails)
    );

    navigate("/payment");
  };



  return(

    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#f8fafc,#e2e8f0)",
      padding:"40px"
    }}>

      <div style={{
        maxWidth:"600px",
        margin:"auto",
        background:"white",
        padding:"30px",
        borderRadius:"20px",
        boxShadow:"0 15px 40px rgba(0,0,0,0.08)"
      }}>

        <h1>Delivery Address 📍</h1>

        <button
          onClick={() => navigate("/menu")}
          style={{
            marginBottom: "20px",
            padding: "8px 16px",
            background: "#444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          ← Back
        </button>


        {/* SAVED ADDRESS CARD */}

        {savedAddress && (

        <div
        style={{
          background:"#f1f5f9",
          padding:"15px",
          borderRadius:"10px",
          marginBottom:"20px"
        }}
        >

        <h3 style={{marginBottom:"8px"}}>Saved Address 🏠</h3>

        <p><strong>{savedAddress.name}</strong></p>
        <p>{savedAddress.phone}</p>
        <p>{savedAddress.address}</p>
        <p>{savedAddress.city} - {savedAddress.pincode}</p>

        <button
        onClick={()=>{
          setName(savedAddress.name);
          setPhone(savedAddress.phone);
          setAddress(savedAddress.address);
          setCity(savedAddress.city);
          setPincode(savedAddress.pincode);
        }}

        style={{
          marginTop:"10px",
          padding:"8px 14px",
          background:"#111",
          color:"white",
          border:"none",
          borderRadius:"6px",
          cursor:"pointer"
        }}
        >
        Use This Address
        </button>

        </div>

        )}



        {/* ADDRESS FORM */}

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Address"
          value={address}
          onChange={(e)=>setAddress(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="City"
          value={city}
          onChange={(e)=>setCity(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Pincode"
          value={pincode}
          onChange={(e)=>setPincode(e.target.value)}
          style={inputStyle}
        />



        <button
          onClick={saveAddress}
          style={{
            marginTop:"15px",
            width:"100%",
            padding:"12px",
            border:"none",
            borderRadius:"10px",
            background:"#10b981",
            color:"white",
            fontWeight:"bold",
            cursor:"pointer"
          }}
        >
          Save & Continue to Payment
        </button>

      </div>

    </div>
  );
}


const inputStyle = {
  display:"block",
  width:"100%",
  padding:"12px",
  marginTop:"12px",
  borderRadius:"8px",
  border:"1px solid #ccc"
};

export default Delivery;