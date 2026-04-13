import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import CafeIcon from "../components/CafeIcon";
import { getLocalMenu, getLocalRestaurant } from "../data/mockData";
import { getCart, getFavorites, setCart, setFavorites } from "../lib/storage";
import { formatCurrency } from "../lib/format";
import { apiGet } from "../lib/api";

const baseOrderModes = [
  { label: "Delivery", time: "25-30 min", icon: "gift" },
  { label: "Takeaway", time: "15-20 min", icon: "browse" },
  { label: "Dine-in", time: "Immediate", icon: "settings" },
  { label: "Pre-order", time: "Time only", icon: "clock" },
];

function buildCombos(items) {
  if (items.length < 2) return [];

  const first = items[0];
  const second = items[1];
  const third = items[2] || items[0];
  const fourth = items[3] || items[1];

  return [
    {
      name: `${first?.name || "Starter"} + ${second?.name || "Dish"} Combo`,
      description: `${first?.name || "Starter"} + ${second?.name || "Dish"}`,
      originalPrice: (first?.price || 0) + (second?.price || 0),
      comboPrice: Math.round(((first?.price || 0) + (second?.price || 0)) * 0.86),
    },
    {
      name: `${third?.name || "Meal"} + ${fourth?.name || "Side"} Combo`,
      description: `${third?.name || "Meal"} + ${fourth?.name || "Side"}`,
      originalPrice: (third?.price || 0) + (fourth?.price || 0),
      comboPrice: Math.round(((third?.price || 0) + (fourth?.price || 0)) * 0.84),
    },
  ];
}

function RestaurantMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMode, setSelectedMode] = useState("Delivery");
  const [preOrderTime, setPreOrderTime] = useState("19:30");

  useEffect(() => {
    const localRestaurant = getLocalRestaurant(id);
    const localMenu = getLocalMenu(id);

    if (localRestaurant) {
      setRestaurant(localRestaurant);
      setItems(localMenu);
    }

    Promise.allSettled([apiGet(`/restaurants/${id}`), apiGet(`/menu/${id}`)]).then(([restaurantResult, menuResult]) => {
      if (restaurantResult.status === "fulfilled") {
        setRestaurant(restaurantResult.value);
      } else if (!localRestaurant) {
        setRestaurant(null);
      }

      if (menuResult.status === "fulfilled") {
        setItems(Array.isArray(menuResult.value) && menuResult.value.length ? menuResult.value : localMenu);
      } else {
        setItems(localMenu);
      }
    });
  }, [id]);

  const categories = useMemo(() => ["All", ...new Set(items.map((item) => item.category))], [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const recommendedItems = useMemo(() => items.slice(0, 3), [items]);
  const combos = useMemo(() => buildCombos(items), [items]);
  const orderModes = useMemo(
    () => baseOrderModes.map((mode) => (
      mode.label === "Pre-order" ? { ...mode, time: preOrderTime } : mode
    )),
    [preOrderTime]
  );

  const addToCart = (item) => {
    const cart = getCart();
    const nextCart = [
      ...cart,
      {
        ...item,
        qty: 1,
        restaurantId: restaurant?._id,
        restaurantName: restaurant?.name,
        orderMode: selectedMode,
        preOrderTime: selectedMode === "Pre-order" ? preOrderTime : "",
      },
    ];

    setCart(nextCart);
  };

  const addComboToCart = (combo) => {
    const syntheticItem = {
      _id: `${restaurant?._id}-${combo.name}`,
      name: combo.name,
      category: "Combos",
      price: combo.comboPrice,
      rating: 4.9,
      isVeg: true,
      available: true,
      image: restaurant?.image,
    };

    addToCart(syntheticItem);
  };

  const addToFavorites = (item) => {
    const favorites = getFavorites();
    if (!favorites.find((fav) => fav._id === item._id)) {
      setFavorites([...favorites, { ...item, restaurantName: restaurant?.name }]);
    }
  };

  if (!restaurant) {
    return (
      <>
        <Toolbar />
        <div className="app-page-shell">
          <div className="app-content-shell">
            <section className="restaurant-page-shell"><h1>Loading restaurant...</h1></section>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toolbar />
      <div className="app-page-shell">
        <div className="app-content-shell">
          <button type="button" className="track-back-link" onClick={() => navigate("/menu")}>
            <CafeIcon kind="arrowLeft" /> Back
          </button>

          <section className="restaurant-page-shell">
            <div className="restaurant-page-shell__hero">
              <img src={restaurant.image} alt={restaurant.name} />
              <div>
                <p className="muted-kicker">Restaurant Menu</p>
                <h1>{restaurant.name}</h1>
                <p>{restaurant.description}</p>
                <div className="restaurant-page-shell__meta">
                  <span>? {restaurant.rating}</span>
                  <span>{restaurant.deliveryTime}</span>
                  <span>{restaurant.priceRange}</span>
                </div>
              </div>
            </div>

            <section className="restaurant-order-mode">
              <h2>Select Order Mode</h2>
              <div className="restaurant-order-mode__grid">
                {orderModes.map((mode) => (
                  <button
                    key={mode.label}
                    type="button"
                    className={`restaurant-order-mode__card ${selectedMode === mode.label ? "is-active" : ""}`}
                    onClick={() => setSelectedMode(mode.label)}
                  >
                    <CafeIcon kind={mode.icon} />
                    <strong>{mode.label}</strong>
                    <span>{mode.time}</span>
                  </button>
                ))}
              </div>

              {selectedMode === "Pre-order" ? (
                <div style={{ marginTop: "16px", maxWidth: "280px" }}>
                  <label className="muted-kicker" style={{ display: "block", marginBottom: "8px" }}>Select pickup time</label>
                  <input className="luxury-input" type="time" value={preOrderTime} onChange={(event) => setPreOrderTime(event.target.value)} />
                </div>
              ) : null}
            </section>

            <section className="section-block">
              <div className="section-title-row">
                <h2><CafeIcon kind="star" /> Recommended for You</h2>
              </div>
              <div className="restaurant-recommended-grid">
                {recommendedItems.map((item) => (
                  <article key={item._id} className="restaurant-recommended-card">
                    <div className="restaurant-recommended-card__emoji">{item.category === "Desserts" ? "Dessert" : item.category === "Biryani" ? "Biryani" : item.category === "Breads" ? "Bread" : "Drink"}</div>
                    <h3>{item.name}</h3>
                    <strong>{formatCurrency(item.price)}</strong>
                    <button type="button" onClick={() => addToCart(item)}>+</button>
                  </article>
                ))}
              </div>
            </section>

            <section className="section-block">
              <div className="section-title-row">
                <h2><CafeIcon kind="heart" /> Special Combos</h2>
              </div>
              <div className="restaurant-combo-grid">
                {combos.map((combo) => (
                  <article key={combo.name} className="restaurant-combo-card">
                    <div>
                      <div className="restaurant-combo-card__badge">Save {formatCurrency(combo.originalPrice - combo.comboPrice)}</div>
                      <h3>{combo.name}</h3>
                      <p>{combo.description}</p>
                      <div className="restaurant-combo-card__price">
                        <span>{formatCurrency(combo.originalPrice)}</span>
                        <strong>{formatCurrency(combo.comboPrice)}</strong>
                      </div>
                    </div>
                    <button type="button" onClick={() => addComboToCart(combo)}>Add Combo</button>
                  </article>
                ))}
              </div>
            </section>

            <section className="restaurant-category-pills">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={selectedCategory === category ? "is-active" : ""}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </section>

            <section className="restaurant-menu-grid">
              {filteredItems.map((item) => (
                <article key={item._id} className="restaurant-menu-card">
                  <img src={item.image} alt={item.name} />
                  <div className="restaurant-menu-card__body">
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.category}</p>
                    </div>
                    <div className="restaurant-menu-card__footer">
                      <strong>{formatCurrency(item.price)}</strong>
                      <div className="restaurant-menu-card__actions">
                        <button type="button" className="restaurant-menu-card__save" onClick={() => addToFavorites(item)}>Save</button>
                        <button type="button" className="restaurant-menu-card__add" onClick={() => addToCart(item)}>Add</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </section>
        </div>
      </div>
    </>
  );
}

export default RestaurantMenu;
