import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { colors } from "../theme";
import Toolbar from "../components/Toolbar";

function RestaurantMenu() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [items,setItems] = useState([]);
  const [restaurant,setRestaurant] = useState(null);
  const [search,setSearch] = useState("");
  const [selectedCategory,setSelectedCategory] = useState("All");

  const cartCount = JSON.parse(localStorage.getItem("cart") || "[]").length;

  useEffect(()=>{
    if(!id) return;

    fetch(`http://localhost:5000/restaurants/${id}`)
      .then(res => res.json())
      .then(data => setRestaurant(data));

    fetch(`http://localhost:5000/menu/${id}`)
      .then(res => res.json())
      .then(data => setItems(data));

  },[id]);

  // ✅ ADD TO CART
  const addToCart = (item) => {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(i => i._id === item._id);

    if (existingItem) {
      existingItem.qty = (existingItem.qty || 1) + 1;
    } else {
      cart.push({ ...item, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${item.name} added to cart 🛒`);
  };

  // ✅ FAVORITES
  const addToFavorites = (item) => {
    const fav = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!fav.find(i => i._id === item._id)) {
      fav.push(item);
      localStorage.setItem("favorites", JSON.stringify(fav));
      alert("Added to favorites ❤️");
    } else {
      alert("Already in favorites ❤️");
    }
  };

  // CATEGORY COUNT
  const categoryCount = {};
  items.forEach(item => {
    categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
  });

  return(
    <>
      <Toolbar/>

      <div style={{
        maxWidth:"1200px",
        margin:"auto",
        padding:"40px 20px",
        background: colors.bg,
        marginTop:"10px"
      }}>

        {/* BACK */}
        <button
          onClick={()=>navigate("/menu")}
          style={{
            marginBottom:"20px",
            padding:"8px 16px",
            background: colors.primary,
            color:"white",
            border:"none",
            borderRadius:"8px",
            cursor:"pointer"
          }}
        >
          ← Back to Restaurants
        </button>

        {/* HEADER */}
        {restaurant && (
          <div style={{marginBottom:"30px"}}>

            <img
              src={restaurant.image}
              alt={restaurant.name}
              style={{
                width:"100%",
                height:"250px",
                objectFit:"cover",
                borderRadius:"16px",
                marginBottom:"20px"
              }}
            />

            <h1 style={{fontSize:"36px", color: colors.text}}>
              {restaurant.name}
            </h1>

            <div style={{display:"flex",gap:"20px",color: colors.muted}}>
              <span>⭐ {restaurant.rating}</span>
              <span>{restaurant.deliveryTime}</span>
              <span>{restaurant.priceRange}</span>
            </div>

            <button
              onClick={()=>navigate("/book-table")}
              style={{
                padding:"8px 16px",
                background: colors.secondary,
                color:"white",
                border:"none",
                borderRadius:"8px",
                marginTop:"10px"
              }}
            >
              Book Table 🍽
            </button>

            <hr style={{marginTop:"20px"}}/>
          </div>
        )}

        {/* SEARCH */}
        <input
          placeholder="🔍 Search dishes..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          style={{
            width:"100%",
            padding:"12px",
            borderRadius:"10px",
            border:"1px solid #d6ccc2",
            marginBottom:"20px",
            background: colors.card
          }}
        />

        {/* CATEGORY */}
        <select
          value={selectedCategory}
          onChange={(e)=>setSelectedCategory(e.target.value)}
          style={{
            padding:"10px",
            borderRadius:"8px",
            border:"1px solid #d6ccc2",
            background: colors.card,
            marginBottom:"25px"
          }}
        >
          <option value="All">All ({items.length})</option>

          {[...new Set(items.map(i=>i.category))].map(cat=>(
            <option key={cat} value={cat}>
              {cat} ({categoryCount[cat]})
            </option>
          ))}
        </select>

        {/* GRID */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",
          gap:"25px"
        }}>

          {items
            .filter(item =>
              (selectedCategory==="All" || item.category===selectedCategory) &&
              item.name.toLowerCase().includes(search.toLowerCase())
            )
            .map(item => (

            <div
              key={item._id}
              style={{
                background: colors.card,
                borderRadius:"16px",
                boxShadow:"0 6px 18px rgba(0,0,0,0.05)",
                overflow:"hidden",
                display:"flex",
                flexDirection:"column"
              }}
            >

              <img
                src={item.image}
                alt={item.name}
                style={{height:"180px",objectFit:"cover"}}
              />

              <div style={{padding:"15px",flexGrow:1}}>

                <h3 style={{color: colors.text}}>
                  {item.name}
                </h3>

                <p style={{color: colors.muted}}>
                  ⭐ {item.rating}
                </p>

                <p style={{fontWeight:"bold", color: colors.text}}>
                  ₹ {item.price}
                </p>

                <p style={{
                  color: item.isVeg ? colors.primary : "#b91c1c",
                  fontSize:"13px"
                }}>
                  {item.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
                </p>

                {/* FAVORITE BUTTON */}
                <button
                  onClick={()=>addToFavorites(item)}
                  style={{
                    marginTop:"8px",
                    padding:"6px 10px",
                    borderRadius:"6px",
                    border:"none",
                    background: colors.secondary,
                    color:"white",
                    cursor:"pointer",
                    fontSize:"12px"
                  }}
                >
                  ❤️ 
                </button>

                {/* CART BUTTON */}
                {item.available && (
                  <button
                    onClick={()=>addToCart(item)}
                    style={{
                      marginTop:"10px",
                      width:"100%",
                      padding:"12px",
                      borderRadius:"8px",
                      border:"none",
                      background: colors.primary,
                      color:"white",
                      fontWeight:"500",
                      cursor:"pointer"
                    }}
                  >
                    Add to Cart 🛒
                  </button>
                )}

              </div>

            </div>
          ))}

        </div>

        {/* CART BUTTON */}
        {cartCount > 0 && (
          <button
            onClick={()=>navigate("/cart")}
            style={{
              position:"fixed",
              bottom:"30px",
              right:"30px",
              padding:"14px 20px",
              borderRadius:"50px",
              border:"none",
              background: colors.primary,
              color:"white",
              fontWeight:"bold",
              boxShadow:"0 6px 20px rgba(0,0,0,0.15)"
            }}
          >
            Go To Cart 🛒 ({cartCount})
          </button>
        )}

      </div>
    </>
  );
}

export default RestaurantMenu;