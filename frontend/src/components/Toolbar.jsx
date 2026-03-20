import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Toolbar() {

  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  const address = JSON.parse(localStorage.getItem("deliveryDetails"));
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Aditi" };

  return (
    <>
      <div style={toolbar}>

        {/* LEFT */}
        <div style={left}>
          
          

          <span style={logo} onClick={()=>navigate("/menu")}>
            ☕ CafeFlow
          </span>

          <span
            style={{...location, cursor:"pointer"}}
            onClick={()=>setShowAddress(!showAddress)}
          >
            📍 {address?.city || "Set Location"}
          </span>
        </div>

        {/* RIGHT */}
        <div style={{position:"relative"}}>
          <button onClick={()=>setOpenMenu(!openMenu)} style={menuBtn}>
            ☰
          </button>

          {openMenu && (
            <div style={dropdown}>

              <div style={item} onClick={()=>navigate("/profile")}>
                👤 Profile
              </div>

              <div style={item} onClick={()=>navigate("/favorites")}>
                ❤️ Favorites
              </div>

              <div
                style={item}
                onClick={()=>{
                  navigator.clipboard.writeText("Join CafeFlow 🍽");
                  alert("Invite link copied!");
                }}
              >
                🎁 Invite your friends
              </div>

              <hr style={divider}/>

              <div style={sectionTitle}>Your Experiences</div>

              <div style={item} onClick={()=>navigate("/transactions")}>
                🕒 Dining Transactions
              </div>

              <div style={item} onClick={()=>navigate("/bookings")}>
                🍽 Your Bookings
              </div>

              <div style={item} onClick={()=>navigate("/help")}>
                ❓ Dining Help
              </div>

            </div>
          )}
        </div>
      </div>

      {/* ADDRESS DROPDOWN */}
      {showAddress && (
        <div style={addressBox}>
          <h4>Saved Addresses</h4>

          {(JSON.parse(localStorage.getItem("addresses")) || []).map((addr, i) => (
            <div key={i} style={addressItem}>
              <p><strong>{addr.name}</strong></p>
              <p>{addr.address}</p>
              <p>{addr.city} - {addr.pincode}</p>

              <button
                onClick={()=>{
                  localStorage.setItem("deliveryDetails", JSON.stringify(addr));
                  setShowAddress(false);
                  window.location.reload();
                }}
                style={useBtn}
              >
                Use
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* STYLES */

const toolbar = {
  width: "100%",
  padding: "12px 20px",
  background: "#EADBC8",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "sticky",
  top: 0,
  zIndex: 3000,
};

const left = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const logo = {
  fontWeight: "700",
  cursor: "pointer",
};

const location = {
  fontSize: "13px",
};

const backBtn = {
  background: "none",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
};

const menuBtn = {
  fontSize: "20px",
  background: "none",
  border: "none",
  cursor: "pointer",
};

const dropdown = {
  position: "absolute",
  right: 0,
  top: "45px",
  background: "white",
  borderRadius: "12px",
  padding: "10px",
  width: "220px",
  zIndex: 2000,
};

const item = {
  padding: "10px",
  cursor: "pointer",
  borderRadius: "8px",
};

const divider = {
  margin: "8px 0",
  border: "none",
  borderTop: "1px solid #eee",
};

const sectionTitle = {
  fontSize: "12px",
  color: "#888",
  padding: "5px 10px",
};

const addressBox = {
  position: "absolute",
  top: "60px",
  left: "20px",
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  width: "260px",
  zIndex: 2000,
};

const addressItem = {
  marginBottom: "10px",
  padding: "10px",
  border: "1px solid #eee",
  borderRadius: "8px",
};

const useBtn = {
  marginTop: "5px",
  padding: "5px 10px",
  background: "#588157",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default Toolbar;