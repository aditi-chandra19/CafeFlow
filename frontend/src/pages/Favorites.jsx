import { useEffect, useState } from "react";
import Toolbar from "../components/Toolbar";
import { colors } from "../theme";
import { useNavigate } from "react-router-dom";
function Favorites() {
const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fav = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(fav);
  }, []);

  const removeFromFavorites = (index) => {
    const updated = [...favorites];
    updated.splice(index, 1);

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <>
      <Toolbar />
<button onClick={() => navigate(-1)} style={backBtn}>
  ← Back
</button>
      <div style={{
        maxWidth:"1000px",
        margin:"auto",
        padding:"40px 20px",
        background: colors.bg,
        minHeight:"100vh"
      }}>

        <h1 style={{marginBottom:"20px"}}>
           Your Favorites
        </h1>

        {favorites.length === 0 ? (
          <p>No favorite items yet.</p>
        ) : (
          favorites.map((item, index) => (
            <div
              key={index}
              style={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                background: colors.card,
                padding:"15px",
                borderRadius:"10px",
                marginBottom:"10px"
              }}
            >
              <div>
                <h3>{item.name}</h3>
                <p>₹ {item.price}</p>
              </div>

              <button
                onClick={()=>removeFromFavorites(index)}
                style={{
                  background: colors.secondary,
                  color:"white",
                  border:"none",
                  borderRadius:"6px",
                  padding:"6px 12px",
                  cursor:"pointer"
                }}
              >
                X
              </button>

            </div>
          ))
        )}

      </div>
    </>
  );
}
const backBtn = {
  margin: "20px",
  padding: "8px 16px",
  background: "#588157",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};
export default Favorites;