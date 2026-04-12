import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import { colors } from "../theme";
import { getUserProfile, setUserProfile } from "../lib/storage";
import {
  BackButton,
  PageContainer,
  PageHeading,
  SurfacePanel,
} from "../components/ui/AppShell";

function Profile() {
  const navigate = useNavigate();
  const storedUser = getUserProfile();
  const [name, setName] = useState(storedUser.name || "");
  const [phone, setPhone] = useState(storedUser.phone || "");
  const [email, setEmail] = useState(storedUser.email || "");
  const [dob, setDob] = useState(storedUser.dob || "");
  const [gender, setGender] = useState(storedUser.gender || "");

  const saveProfile = () => {
    setUserProfile({ name, phone, email, dob, gender });
    alert("Profile updated");
  };

  return (
    <>
      <Toolbar />
      <PageContainer maxWidth="560px">
        <SurfacePanel style={container}>
          <BackButton onClick={() => navigate(-1)} style={backBtn}>Back</BackButton>
          <div style={{ marginTop: "14px" }}>
            <PageHeading title="Your profile" />
          </div>
          <div style={{ marginTop: "20px", display: "grid", gap: "14px" }}>
            <input className="luxury-input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="luxury-input" placeholder="Mobile" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className="luxury-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="luxury-input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            <select className="luxury-select" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <button className="luxury-button" style={{ ...backBtn, width: "100%", marginTop: "18px" }} onClick={saveProfile}>Update profile</button>
        </SurfacePanel>
      </PageContainer>
    </>
  );
}
const container = { maxWidth: "560px", margin: "0 auto", borderRadius: "30px", padding: "24px" };
const backBtn = { background: colors.primary, color: "white" };
export default Profile;
