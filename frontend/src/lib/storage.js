const STORAGE_KEYS = {
  addresses: "addresses",
  activeCoupon: "activeCoupon",
  cart: "cart",
  currentOrderBatch: "currentOrderBatch",
  deliveryDetails: "deliveryDetails",
  favorites: "favorites",
  language: "language",
  notifications: "notifications",
  orderHistory: "orderHistory",
  preferences: "preferences",
  theme: "theme",
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

export function getThemePreference() {
  return localStorage.getItem(STORAGE_KEYS.theme) || "light";
}

export function setThemePreference(theme) {
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

export function getLanguagePreference() {
  return localStorage.getItem(STORAGE_KEYS.language) || "English";
}

export function setLanguagePreference(language) {
  localStorage.setItem(STORAGE_KEYS.language, language);
}

export function getNotificationSettings() {
  return readJson(STORAGE_KEYS.notifications, {
    orderUpdates: true,
    dealsOffers: true,
    recommendations: true,
    loyaltyRewards: true,
    pushNotifications: true,
    sms: true,
    email: false,
  });
}

export function setNotificationSettings(settings) {
  writeJson(STORAGE_KEYS.notifications, settings);
}

export function getAppPreferences() {
  return readJson(STORAGE_KEYS.preferences, {
    language: "English",
    autoplayVideos: true,
    hapticFeedback: true,
    reducedMotion: false,
    dataSaver: false,
    cacheSize: "128.5 MB",
  });
}

export function setAppPreferences(preferences) {
  writeJson(STORAGE_KEYS.preferences, preferences);
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}
