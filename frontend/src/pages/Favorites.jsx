import { useEffect, useState } from "react";
import Toolbar from "../components/Toolbar";
import { colors } from "../theme";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../lib/format";
import { getFavorites, setFavorites as persistFavorites } from "../lib/storage";
import {
  BackButton,
  PageContainer,
  PageHeading,
  SurfacePanel,
} from "../components/ui/AppShell";

function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const removeFromFavorites = (index) => {
    const updated = [...favorites];
    updated.splice(index, 1);
    setFavorites(updated);
    persistFavorites(updated);
  };

  return (
    <>
      <Toolbar />
      <PageContainer maxWidth="920px">
          <BackButton onClick={() => navigate(-1)} style={backBtn}>Back</BackButton>
          <SurfacePanel style={panel}>
            <PageHeading title="Saved favorites" />
            <div style={{ marginTop: "20px", display: "grid", gap: "12px" }}>
              {favorites.length === 0 ? <p style={{ color: colors.muted }}>No favorite items yet.</p> : favorites.map((item, index) => (
                <div key={`${item._id}-${index}`} style={itemCard}>
                  <div>
                    <h3 style={{ color: colors.text }}>{item.name}</h3>
                    <p style={{ color: colors.muted }}>{item.restaurantName || "Saved from menu"}</p>
                    <p style={{ color: colors.text }}>{formatCurrency(item.price)}</p>
                  </div>
                  <button className="luxury-button" style={removeBtn} onClick={() => removeFromFavorites(index)}>Remove</button>
                </div>
              ))}
            </div>
          </SurfacePanel>
      </PageContainer>
    </>
  );
}
const backBtn = { background: colors.primary, color: "white", marginBottom: "16px" };
const panel = { borderRadius: "30px", padding: "24px" };
const itemCard = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "16px", borderRadius: "18px", background: colors.card, border: `1px solid ${colors.border}` };
const removeBtn = { background: colors.secondary, color: "white" };
export default Favorites;
