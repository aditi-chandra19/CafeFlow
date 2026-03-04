import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleContinue = () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill required details");
      return;
    }

    localStorage.setItem("deliveryDetails", JSON.stringify(form));
    navigate("/payment");
  };

  return (
    <div style={{ padding: "40px" }}>
      <button
  onClick={() => navigate(-1)}
  style={backBtn}
>
  ← Back
</button>  
      <h1>Delivery Details 📍</h1>

      <input name="name" placeholder="Full Name" onChange={handleChange} style={inputStyle}/>
      <input name="phone" placeholder="Phone Number" onChange={handleChange} style={inputStyle}/>
      <input name="address" placeholder="Address" onChange={handleChange} style={inputStyle}/>
      <input name="city" placeholder="City" onChange={handleChange} style={inputStyle}/>
      <input name="pincode" placeholder="Pincode" onChange={handleChange} style={inputStyle}/>

      <button onClick={handleContinue} style={btnStyle}>
        Continue to Payment 💳
      </button>
    </div>
  );
}

const inputStyle = {
  display: "block",
  margin: "10px 0",
  padding: "10px",
  width: "300px"
};

const btnStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  background: "black",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};
const backBtn = {
  marginBottom: "20px",
  padding: "8px 16px",
  background: "#444",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};
export default Checkout;