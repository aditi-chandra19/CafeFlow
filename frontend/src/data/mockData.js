export const localRestaurants = [
  {
    _id: "local-royal-tandoor",
    name: "Royal Tandoor House",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    deliveryTime: "25-30 mins",
    priceRange: "Rs 350 for two",
    cuisine: ["North Indian", "Tandoor", "Biryani"],
    isOpen: true,
    description: "Signature kebabs, dum biryani, and indulgent thalis in a polished dining setting."
  },
  {
    _id: "local-coastal-thali",
    name: "Coastal Thali Co.",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    deliveryTime: "30-35 mins",
    priceRange: "Rs 420 for two",
    cuisine: ["South Indian", "Seafood", "Thali"],
    isOpen: true,
    description: "Elegant regional thalis, neer dosa, and coastal curries with a contemporary touch."
  },
  {
    _id: "local-bombay-chat-room",
    name: "Bombay Chat Room",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    deliveryTime: "20-25 mins",
    priceRange: "Rs 280 for two",
    cuisine: ["Street Food", "Chaat", "Desserts"],
    isOpen: true,
    description: "Luxury-style chaat, rolls, kulfi, and quick comfort bowls for casual cravings."
  }
];

export const localMenus = {
  "local-royal-tandoor": [
    { _id: "rt-1", restaurantId: "local-royal-tandoor", restaurantName: "Royal Tandoor House", name: "Butter Chicken", category: "Main Course", price: 345, rating: 4.9, isVeg: false, available: true, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80" },
    { _id: "rt-2", restaurantId: "local-royal-tandoor", restaurantName: "Royal Tandoor House", name: "Paneer Lababdar", category: "Main Course", price: 295, rating: 4.8, isVeg: true, available: true, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80" },
    { _id: "rt-3", restaurantId: "local-royal-tandoor", restaurantName: "Royal Tandoor House", name: "Dum Chicken Biryani", category: "Biryani", price: 389, rating: 4.9, isVeg: false, available: true, image: "https://images.unsplash.com/photo-1633945274309-2c16c9682a8b?auto=format&fit=crop&w=800&q=80" },
    { _id: "rt-4", restaurantId: "local-royal-tandoor", restaurantName: "Royal Tandoor House", name: "Garlic Naan Basket", category: "Breads", price: 145, rating: 4.7, isVeg: true, available: true, image: "https://images.unsplash.com/photo-1626132647523-66d6a5f8dcb9?auto=format&fit=crop&w=800&q=80" },
    { _id: "rt-5", restaurantId: "local-royal-tandoor", restaurantName: "Royal Tandoor House", name: "Seekh Kebab Platter", category: "Starters", price: 325, rating: 4.8, isVeg: false, available: true, image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" }
  ],
  "local-coastal-thali": [
    { _id: "ct-1", restaurantId: "local-coastal-thali", restaurantName: "Coastal Thali Co.", name: "Malabar Prawn Curry", category: "Seafood", price: 365, rating: 4.8, isVeg: false, available: true, image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=800&q=80" },
    { _id: "ct-2", restaurantId: "local-coastal-thali", restaurantName: "Coastal Thali Co.", name: "Mini Kerala Sadya", category: "Thali", price: 275, rating: 4.7, isVeg: true, available: true, image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80" },
    { _id: "ct-3", restaurantId: "local-coastal-thali", restaurantName: "Coastal Thali Co.", name: "Mysore Masala Dosa", category: "South Indian", price: 190, rating: 4.8, isVeg: true, available: true, image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80" },
    { _id: "ct-4", restaurantId: "local-coastal-thali", restaurantName: "Coastal Thali Co.", name: "Neer Dosa with Chicken Gassi", category: "Combos", price: 320, rating: 4.9, isVeg: false, available: true, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80" }
  ],
  "local-bombay-chat-room": [
    { _id: "bc-1", restaurantId: "local-bombay-chat-room", restaurantName: "Bombay Chat Room", name: "Papdi Chaat Royale", category: "Chaat", price: 165, rating: 4.7, isVeg: true, available: true, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80" },
    { _id: "bc-2", restaurantId: "local-bombay-chat-room", restaurantName: "Bombay Chat Room", name: "Vada Pav Slider Box", category: "Street Food", price: 210, rating: 4.6, isVeg: true, available: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80" },
    { _id: "bc-3", restaurantId: "local-bombay-chat-room", restaurantName: "Bombay Chat Room", name: "Mumbai Tawa Pulao", category: "Street Food", price: 245, rating: 4.5, isVeg: true, available: true, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80" },
    { _id: "bc-4", restaurantId: "local-bombay-chat-room", restaurantName: "Bombay Chat Room", name: "Rabdi Kulfi Jar", category: "Desserts", price: 155, rating: 4.8, isVeg: true, available: true, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80" }
  ]
};

export function getLocalRestaurant(id) {
  return localRestaurants.find((restaurant) => restaurant._id === id) || null;
}

export function getLocalMenu(id) {
  return localMenus[id] || [];
}
