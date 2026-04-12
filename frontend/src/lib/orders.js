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

  const orders = groupedOrders.map((order, index) => ({
    ...order,
    orderId: `${createdAt.getTime()}-${index}`,
    totalAmount: order.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    ),
    deliveryPartner: RIDERS_POOL[index % RIDERS_POOL.length],
    date: createdAt.toLocaleString(),
    status: "Preparing",
  }));

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
