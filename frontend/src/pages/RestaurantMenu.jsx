import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RestaurantMenu() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [items,setItems] = useState([]);
  const [restaurant,setRestaurant] = useState(null);
  const [search,setSearch] = useState("");
  const cartCount = JSON.parse(localStorage.getItem("cart") || "[]").length;

  useEffect(()=>{

    if(!id) return;

    fetch(`http://localhost:5000/restaurants/${id}`)
      .then(res => res.json())
      .then(data => setRestaurant(data))
      .catch(err => console.log(err));

    fetch(`http://localhost:5000/menu/${id}`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.log(err));

  },[id]);


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


  return(

    <div style={{maxWidth:"1200px",margin:"auto",padding:"40px 20px"}}>

      {/* BACK BUTTON */}
      <button
        onClick={()=>navigate("/menu")}
        style={{
          marginBottom:"20px",
          padding:"8px 16px",
          background:"black",
          color:"white",
          border:"none",
          borderRadius:"8px",
          cursor:"pointer"
        }}
      >
        ← Back to Restaurants
      </button>


      {/* RESTAURANT HEADER */}
      {restaurant ? (

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

  <h1 style={{fontSize:"36px",fontWeight:"700",}}>
    {restaurant.name}
  </h1>

  <div style={{display:"flex",gap:"20px",color:"#555"}}>

    <span>⭐ {restaurant.rating}</span>
    <span>{restaurant.deliveryTime}</span>
    <span>{restaurant.priceRange}</span>

  </div>

          <button
            onClick={()=>navigate("/book-table")}
            style={{
              padding:"8px 16px",
              background:"black",
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

      ) : (

        <p>Loading restaurant...</p>

      )}
      {/* SEARCH BAR */}
<input
  type="text"
  placeholder="🔍 Search dishes..."
  value={search}
  onChange={(e)=>setSearch(e.target.value)}
  style={{
    width:"100%",
    padding:"12px",
    borderRadius:"10px",
    border:"1px solid #ccc",
    marginBottom:"25px",
    fontSize:"16px"
  }}
/>


      {/* MENU GRID */}
      <div
        style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",
          gap:"25px"
        }}
      >

        {items.length === 0 && (
          <p>No menu items found.</p>
        )}

        {items
  .filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )
  .map(item => (

          <div
            key={item._id}
            style={{
              background:"#fff",
              borderRadius:"16px",
              boxShadow:"0 10px 25px rgba(0,0,0,0.08)",
              overflow:"hidden",
              transition:"transform 0.2s ease, box-shadow 0.2s ease",
              cursor:"pointer",
              display:"flex",
              flexDirection:"column",
              height:"100%"
            }}

            onMouseEnter={(e)=>{
              e.currentTarget.style.transform="translateY(-6px)";
              e.currentTarget.style.boxShadow="0 15px 35px rgba(0,0,0,0.15)";
            }}

            onMouseLeave={(e)=>{
              e.currentTarget.style.transform="translateY(0)";
              e.currentTarget.style.boxShadow="0 10px 25px rgba(0,0,0,0.08)";
            }}
          >

            <img
              src={item.image}
              alt={item.name}
              style={{
                width:"100%",
                height:"180px",
                objectFit:"cover"
              }}
            />

            <div
              style={{
                padding:"15px",
                display:"flex",
                flexDirection:"column",
                flexGrow:1
              }}
            >

              <h3
                style={{
                  fontSize:"22px",
                  fontWeight:"600",
                  marginBottom:"5px"
                }}
              >
                {item.name}
              </h3>

              <p style={{fontSize:"14px",color:"#666"}}>
                ⭐ {item.rating}
              </p>

              <p
                style={{
                  fontWeight:"bold",
                  fontSize:"18px"
                }}
              >
                ₹ {item.price}
              </p>

              <p
                style={{
                  color:item.isVeg ? "green" : "red",
                  fontWeight:"bold",
                  fontSize:"13px"
                }}
              >
                {item.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
              </p>

              {item.isPopular && (
                <p style={{color:"#f97316",fontWeight:"bold"}}>
                  🔥 Popular
                </p>
              )}

              {item.isBestseller && (
                <p style={{color:"#eab308",fontWeight:"bold"}}>
                  🏆 Bestseller
                </p>
              )}

              <p
                style={{
                  color:item.available ? "green" : "red",
                  fontWeight:"bold",
                  fontSize:"13px"
                }}
              >
                {item.available ? "Available" : "Out of Stock"}
              </p>

              {item.available && (
                <button
                  onClick={()=>addToCart(item)}
                  style={{
                    marginTop:"auto",
                    width:"100%",
                    padding:"14px",
                    borderRadius:"12px",
                    border:"none",
                    background:"linear-gradient(45deg,#10b981,#3b82f6)",
                    color:"white",
                    cursor:"pointer",
                    fontWeight:"bold",
                    fontSize:"16px",
                    letterSpacing:"0.4px",
                    boxShadow:"0 6px 15px rgba(0,0,0,0.15)",
                    transition:"transform 0.15s ease"
                  }}
                  onMouseEnter={(e)=>{
                    e.currentTarget.style.transform="scale(1.03)";
                  }}
                  onMouseLeave={(e)=>{
                    e.currentTarget.style.transform="scale(1)";
                  }}
                >
                  Add to Cart 🛒
                </button>
              )}

            </div>

          </div>

        ))}

      </div>


      {/* FLOATING CART BUTTON */}

      {cartCount > 0 && (

        <button
          onClick={()=>navigate("/cart")}
          style={{
            position:"fixed",
            bottom:"30px",
            right:"30px",
            padding:"16px 24px",
            borderRadius:"50px",
            border:"none",
            background:"#10b981",
            color:"white",
            fontWeight:"bold",
            fontSize:"16px",
            boxShadow:"0 10px 25px rgba(0,0,0,0.2)",
            cursor:"pointer"
          }}
        >
          Go To Cart 🛒 ({cartCount})
        </button>

      )}

    </div>

  );
}

export default RestaurantMenu;