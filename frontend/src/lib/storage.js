const STORAGE_KEYS = {
  addresses: "addresses",
  activeCoupon: "activeCoupon",
  cart: "cart",
  currentOrderBatch: "currentOrderBatch",
  deliveryDetails: "deliveryDetails",
  favorites: "favorites",
  orderHistory: "orderHistory",
  user: "user",
};

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getAddresses() {
  return readJson(STORAGE_KEYS.addresses, []);
}

export function setAddresses(addresses) {
  writeJson(STORAGE_KEYS.addresses, addresses);
}

export function getActiveCoupon() {
  return readJson(STORAGE_KEYS.activeCoupon, null);
}

export function setActiveCoupon(coupon) {
  writeJson(STORAGE_KEYS.activeCoupon, coupon);
}

export function getCart() {
  return readJson(STORAGE_KEYS.cart, []);
}

export function setCart(cart) {
  writeJson(STORAGE_KEYS.cart, cart);
}

export function clearCart() {
  localStorage.removeItem(STORAGE_KEYS.cart);
}

export function getCurrentOrderBatch() {
  return readJson(STORAGE_KEYS.currentOrderBatch, null);
}

export function setCurrentOrderBatch(batch) {
  writeJson(STORAGE_KEYS.currentOrderBatch, batch);
}

export function getDeliveryDetails() {
  return readJson(STORAGE_KEYS.deliveryDetails, null);
}

export function setDeliveryDetails(details) {
  writeJson(STORAGE_KEYS.deliveryDetails, details);
}

export function getFavorites() {
  return readJson(STORAGE_KEYS.favorites, []);
}

export function setFavorites(favorites) {
  writeJson(STORAGE_KEYS.favorites, favorites);
}

export function getOrderHistory() {
  return readJson(STORAGE_KEYS.orderHistory, []);
}

export function appendOrderHistory(orders) {
  writeJson(STORAGE_KEYS.orderHistory, [...getOrderHistory(), ...orders]);
}

export function getUserProfile() {
  return readJson(STORAGE_KEYS.user, {});
}

export function setUserProfile(profile) {
  writeJson(STORAGE_KEYS.user, profile);
}
