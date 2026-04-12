import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";
import Toolbar from "../components/Toolbar";
import {
  getAddresses,
  getDeliveryDetails,
  setAddresses,
  setDeliveryDetails,
} from "../lib/storage";
import {
  BackButton,
  PageContainer,
  PageHeading,
  SplitLayout,
  SurfacePanel,
} from "../components/ui/AppShell";

function Delivery() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    lat: 12.9716,
    lng: 77.5946,
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    setSavedAddresses(getAddresses());
    const existing = getDeliveryDetails();
    if (existing) setForm((prev) => ({ ...prev, ...existing }));
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setForm((prev) => ({ ...prev, lat: latitude, lng: longitude }));
        setLoadingLocation(false);
      },
      () => {
        setLoadingLocation(false);
        alert("Location permission denied");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const saveAddress = () => {
    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      alert("Please fill all delivery details");
      return;
    }

    const updated = [
      form,
      ...savedAddresses.filter((item) => item.address !== form.address),
    ].slice(0, 4);
    setAddresses(updated);
    setDeliveryDetails(form);
    navigate("/payment");
  };

  return (
    <>
      <Toolbar />
      <PageContainer maxWidth="1100px">
        <SplitLayout>
          <SurfacePanel>
            <PageHeading
              title="Delivery details"
              subtitle="Choose your active delivery address before continuing to payment."
            />
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "20px" }}>
              <BackButton onClick={() => navigate(-1)}>Back</BackButton>
              <button className="luxury-button" style={primaryBtn} onClick={getLocation}>{loadingLocation ? "Detecting..." : "Use my location"}</button>
            </div>

            <div style={{ marginTop: "20px", display: "grid", gap: "14px" }}>
              <input className="luxury-input" name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
              <input className="luxury-input" name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} />
              <input className="luxury-input" name="address" placeholder="Address" value={form.address} onChange={handleChange} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                <input className="luxury-input" name="city" placeholder="City" value={form.city} onChange={handleChange} />
                <input className="luxury-input" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />
              </div>
            </div>

            <button className="luxury-button" style={{ ...primaryBtn, width: "100%", marginTop: "18px" }} onClick={saveAddress}>Save and continue to payment</button>
          </SurfacePanel>

          <SurfacePanel>
            <h2 style={{ fontSize: "2.2rem", color: colors.text }}>Saved addresses</h2>
            <div style={{ marginTop: "16px", display: "grid", gap: "12px" }}>
              {savedAddresses.length ? savedAddresses.map((address, index) => (
                <div key={`${address.address}-${index}`} style={addressCard}>
                  <strong>{address.name}</strong>
                  <p style={{ color: colors.muted }}>{address.phone}</p>
                  <p>{address.address}</p>
                  <p style={{ color: colors.muted }}>{address.city} - {address.pincode}</p>
                  <button className="luxury-button" style={secondaryBtn} onClick={() => {
                    setForm(address);
                    setDeliveryDetails(address);
                  }}>Use this address</button>
                </div>
              )) : <p style={{ color: colors.muted }}>No saved addresses yet.</p>}
            </div>
          </SurfacePanel>
        </SplitLayout>
      </PageContainer>
    </>
  );
}

const primaryBtn = { background: colors.primary, color: "white" };
const secondaryBtn = { background: colors.card, color: colors.text };
const addressCard = { display: "grid", gap: "6px", padding: "16px", borderRadius: "18px", background: colors.card, border: `1px solid ${colors.border}` };

export default Delivery;
