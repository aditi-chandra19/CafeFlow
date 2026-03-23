import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";
import Toolbar from "../components/Toolbar";
function Delivery() {
  const navigate = useNavigate();
  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [address,setAddress] = useState("");
  const [city,setCity] = useState("");
  const [pincode,setPincode] = useState("");
  const [lat,setLat] = useState(null);
  const [lng,setLng] = useState(null);
  const [savedAddress,setSavedAddress] = useState([]);
  const [loadingLocation,setLoadingLocation] = useState(false);
  const [orders, setOrders] = useState([]);
  useEffect(()=>{
    const saved = JSON.parse(localStorage.getItem("addresses")) || [];
    setSavedAddress(saved);
  },[]);
  useEffect(() => {
  const savedOrders =
    JSON.parse(localStorage.getItem("orderHistory")) || [];

  setOrders(savedOrders);
}, []);
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const data = await res.json();
      const addr = data.address || {};

      setCity(addr.city || addr.town || addr.village || "");
      setPincode(addr.postcode || "");
      setAddress(data.display_name || "");

    } catch (err) {
      console.log("Error:", err);
    }
  };

  const getLocation = () => {

    if (!navigator.geolocation) {
      alert("Geolocation not supported ❗");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLat(latitude);
        setLng(longitude);

        await getAddressFromCoords(latitude, longitude);

        setLoadingLocation(false);

      },
      () => {
        alert("Location permission denied ❗");
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const saveAddress = () => {

    if(!name || !phone || !address || !city || !pincode){
      alert("Please fill all fields ❗");
      return;
    }

    if(pincode.length !== 6){
      alert("Enter valid pincode ❗");
      return;
    }

    const newAddress = {
      name,
      phone,
      address,
      city,
      pincode
    };

    const existing =
      JSON.parse(localStorage.getItem("addresses")) || [];

    const updated = [...existing, newAddress];

    localStorage.setItem("addresses", JSON.stringify(updated));
    localStorage.setItem("deliveryDetails", JSON.stringify(newAddress));

    navigate("/payment");
  };

  return(
    <>
    <Toolbar/>

    <div style={{
      minHeight:"100vh",
      background: colors.bg,
      padding:"40px"
    }}>

      <div style={{
        maxWidth:"600px",
        margin:"auto",
        background: colors.card,
        padding:"30px",
        borderRadius:"20px",
        boxShadow:"0 10px 25px rgba(0,0,0,0.05)"
      }}>

        <h1 style={{color: colors.text}}>Delivery Address </h1>

        <div style={{ display:"flex", gap:"12px", marginBottom:"15px" }}>

          <button onClick={() => navigate("/menu")} style={btnBack}>
            ← Back
          </button>

          <button onClick={getLocation} style={btnLocation}>
             Detect My Location
          </button>

        </div>

        {loadingLocation && (
          <p style={{color: colors.muted}}>Detecting location...</p>
        )}

        {lat && lng && (
          <div style={locationBox}>
            📍 Location detected
          </div>
        )}

        <p style={{color: colors.muted, fontSize:"13px"}}>
          Please verify your address before saving
        </p>

        {savedAddress.length > 0 && (
          <div style={{marginBottom:"20px"}}>

            <h3 style={{color: colors.text}}>Saved Addresses </h3>

            {savedAddress.map((addr,index)=>(

              <div key={index} style={card}>

                <button
                  onClick={() => {
                    const updated = savedAddress.filter((_, i) => i !== index);
                    setSavedAddress(updated);
                    localStorage.setItem("addresses", JSON.stringify(updated));
                  }}
                  style={deleteBtn}
                >
                  ✖
                </button>

                <p><strong>{addr.name}</strong></p>
                <p style={{color: colors.muted}}>{addr.phone}</p>
                <p style={{color: colors.text}}>{addr.address}</p>
                <p style={{color: colors.muted}}>
                  {addr.city} - {addr.pincode}
                </p>

                <button
                  onClick={()=>{
                    setName(addr.name);
                    setPhone(addr.phone);
                    setAddress(addr.address);
                    setCity(addr.city);
                    setPincode(addr.pincode);

                    localStorage.setItem("deliveryDetails", JSON.stringify(addr));
                  }}
                  style={btnUse}
                >
                  Use This Address
                </button>

              </div>

            ))}
          </div>
        )}

        <input placeholder="Full Name" value={name} onChange={(e)=>setName(e.target.value)} style={inputStyle}/>
        <input placeholder="Phone Number" value={phone} onChange={(e)=>setPhone(e.target.value)} style={inputStyle}/>
        <input placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)} style={inputStyle}/>
        <input placeholder="City" value={city} onChange={(e)=>setCity(e.target.value)} style={inputStyle}/>
        <input placeholder="Pincode" value={pincode} onChange={(e)=>setPincode(e.target.value)} style={inputStyle}/>

        <button onClick={saveAddress} style={btnSave}>
          Save & Continue to Payment
        </button>

      </div>
    </div>
    </>
  );
}

/* STYLES */

const inputStyle = {
  display:"block",
  width:"100%",
  padding:"12px",
  marginTop:"12px",
  borderRadius:"8px",
  border:"1px solid #d6ccc2"
};

const btnBack = {
  padding:"8px 16px",
  background: colors.primary,
  color:"white",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer"
};

const btnLocation = {
  padding:"8px 16px",
  background: colors.secondary,
  color:"white",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer"
};

const locationBox = {
  background: colors.accent,
  padding:"10px",
  borderRadius:"8px",
  marginBottom:"15px",
  color:"#fff"
};

const card = {
  background: colors.bg,
  padding:"15px",
  borderRadius:"10px",
  marginTop:"10px",
  border:"1px solid #e2e8f0",
  position:"relative"
};

const deleteBtn = {
  position:"absolute",
  top:"10px",
  right:"10px",
  border:"none",
  background:"transparent",
  cursor:"pointer",
  fontSize:"16px",
  color: colors.muted
};

const btnUse = {
  marginTop:"8px",
  padding:"6px 12px",
  background: colors.primary,
  color:"white",
  border:"none",
  borderRadius:"6px",
  cursor:"pointer"
};

const btnSave = {
  marginTop:"15px",
  width:"100%",
  padding:"12px",
  border:"none",
  borderRadius:"10px",
  background: colors.primary,
  color:"white",
  fontWeight:"bold",
  cursor:"pointer"
};

export default Delivery;