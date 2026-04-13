export const RIDERS_POOL = [
  { name: "Rider Arjun", vehicle: "Bike", phone: "98765 43210" },
  { name: "Rider Meera", vehicle: "Scooter", phone: "98989 98989" },
  { name: "Rider Kabir", vehicle: "Bike", phone: "98111 22334" },
  { name: "Rider Sana", vehicle: "Scooter", phone: "98000 11223" },
];

export function groupOrdersByRestaurant(cart) {
  return Object.values(
    cart.reduce((accumulator, item) => {
      if (!accumulator[item.restaurantId]) {
        accumulator[item.restaurantId] = {
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName,
          orderMode: item.orderMode || "Delivery",
          preOrderTime: item.preOrderTime || "",
          items: [],
        };
      }

      accumulator[item.restaurantId].items.push(item);
      return accumulator;
    }, {})
  );
}

export function createOrderBatch({
  bank,
  cart,
  delivery,
  paymentMethod,
  pricing,
}) {
  const groupedOrders = groupOrdersByRestaurant(cart);
  const createdAt = new Date();

  const subtotalBase = pricing?.subtotal || groupedOrders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.price * item.qty, 0),
    0
  );

  const orders = groupedOrders.map((order, index) => {
    const subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    const ratio = subtotalBase > 0 ? subtotal / subtotalBase : 0;
    const couponDiscountShare = Math.round((pricing?.couponDiscount || 0) * ratio);
    const multiRestaurantDiscountShare = Math.round((pricing?.multiRestaurantDiscount || 0) * ratio);
    const deliveryFeeShare = Math.round((pricing?.deliveryFee || 0) * ratio);
    const platformFeeShare = Math.round((pricing?.platformFee || 0) * ratio);
    const finalTotalAmount = Math.max(
      0,
      subtotal + deliveryFeeShare + platformFeeShare - couponDiscountShare - multiRestaurantDiscountShare
    );

    return {
      ...order,
      orderId: `${createdAt.getTime()}-${index}`,
      subtotal,
      couponDiscountShare,
      multiRestaurantDiscountShare,
      deliveryFeeShare,
      platformFeeShare,
      totalAmount: finalTotalAmount,
      finalTotalAmount,
      deliveryPartner: order.orderMode === "Delivery" ? RIDERS_POOL[index % RIDERS_POOL.length] : null,
      date: createdAt.toLocaleString(),
      status: "Preparing",
    };
  });

  return {
    id: `${createdAt.getTime()}`,
    createdAt: createdAt.toISOString(),
    paymentMethod,
    bank,
    delivery,
    orders,
    pricing,
    estimatedMinutes: 28 + orders.length * 6,
  };
}
