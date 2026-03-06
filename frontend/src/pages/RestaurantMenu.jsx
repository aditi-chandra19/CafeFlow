import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RestaurantMenu() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [items,setItems] = useState([]);
  const [restaurant,setRestaurant] = useState(null);

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


  const addToCart = (item)=>{

    const existing = JSON.parse(localStorage.getItem("cart")) || [];

    localStorage.setItem(
      "cart",
      JSON.stringify([...existing,item])
    );

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

          <h1 style={{fontSize:"32px"}}>
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



      {/* MENU GRID */}
      <div
        style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",
          gap:"25px"
        }}
      >

        {items.length === 0 && (
          <p>No menu items found.</p>
        )}


        {items.map(item => (

          <div
            key={item._id}
            style={{
              background:"#fff",
              borderRadius:"16px",
              boxShadow:"0 10px 25px rgba(0,0,0,0.08)",
              overflow:"hidden"
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

            <div style={{padding:"15px"}}>

              <h3>{item.name}</h3>

              <p style={{fontSize:"14px",color:"#666"}}>
                ⭐ {item.rating}
              </p>

              <p style={{fontWeight:"bold"}}>
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
                    marginTop:"10px",
                    width:"100%",
                    padding:"10px",
                    borderRadius:"10px",
                    border:"none",
                    background:"linear-gradient(45deg,#10b981,#3b82f6)",
                    color:"white",
                    cursor:"pointer",
                    fontWeight:"bold"
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

      {JSON.parse(localStorage.getItem("cart") || "[]").length > 0 && (

        <button
          onClick={()=>navigate("/cart")}
          style={{
            position:"fixed",
            bottom:"30px",
            right:"30px",
            padding:"15px 20px",
            borderRadius:"50px",
            border:"none",
            background:"#10b981",
            color:"white",
            fontWeight:"bold",
            boxShadow:"0 10px 25px rgba(0,0,0,0.2)",
            cursor:"pointer"
          }}
        >
          Go To Cart 🛒
        </button>

      )}

    </div>

  );
}

export default RestaurantMenu;