export function groupCartItems(items) {
  return items.reduce((acc, item) => {
    const key = `${item.restaurantId}::${item._id}`;

    if (!acc[key]) {
      acc[key] = { ...item, qty: item.qty || 1 };
    } else {
      acc[key].qty += item.qty || 1;
    }

    return acc;
  }, {});
}

export function getOrderPricing(cart, discountRate = 0) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const restaurantCount = new Set(cart.map((item) => item.restaurantId)).size;
  const deliveryFee = restaurantCount * 35;
  const platformFee = Math.max(8, restaurantCount * 6 + Math.round(subtotal * 0.015));
  const couponDiscount = Math.round(subtotal * discountRate);
  const multiRestaurantDiscount = restaurantCount >= 2 ? Math.round(subtotal * 0.08) : 0;
  const totalDiscount = couponDiscount + multiRestaurantDiscount;
  const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee - totalDiscount);

  return {
    subtotal,
    restaurantCount,
    deliveryFee,
    platformFee,
    couponDiscount,
    multiRestaurantDiscount,
    totalDiscount,
    grandTotal,
    assignedRiders: restaurantCount,
  };
}

export const couponRates = {
  SAVE10: 0.1,
  SAVE20: 0.2,
  FEAST25: 0.25,
};
