import { BrowserRouter, Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import RestaurantMenu from "./pages/RestaurantMenu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";
import Dashboard from "./pages/Dashboard";
import BookTable from "./pages/BookTable";
import Delivery from "./pages/Delivery";
import DiningTransactions from "./pages/DiningTransactions";
import Bookings from "./pages/Bookings";
import DiningHelp from "./pages/DiningHelp";
import OrderSummary from "./pages/OrderSummary";
import LiveTracking from "./pages/LiveTracking";
function App() {
  const cartItems = [
  {
    restaurantId: "1",
    restaurantName: "Cafe Brew",
    itemId: "101",
    name: "Cold Coffee",
    price: 120,
    quantity: 1
  },
  {
    restaurantId: "2",
    restaurantName: "Sweet Treats",
    itemId: "202",
    name: "Chocolate Cake",
    price: 200,
    quantity: 1
  },
  {
    restaurantId: "1",
    restaurantName: "Cafe Brew",
    itemId: "103",
    name: "Sandwich",
    price: 150,
    quantity: 1
  }
];
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tracking" element={<LiveTracking />} />
        <Route path="/summary" element={<OrderSummary />} />
        {/* MENU */}
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />

        <Route path="/profile" element={<Profile />} />
        <Route path="/delivery" element={<Delivery />} />

        {/* RESTAURANT */}
        <Route
          path="/restaurant/:id"
          element={
            <ProtectedRoute>
              <RestaurantMenu />
            </ProtectedRoute>
          }
        />

        {/* FAVORITES */}
        <Route path="/favorites" element={<Favorites />} />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
           
        {/* PAYMENT */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        {/* SUCCESS */}
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        {/* ORDERS */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        {/* BOOK TABLE */}
        <Route
          path="/book-table"
          element={
            <ProtectedRoute>
              <BookTable />
            </ProtectedRoute>
          }
        />

        {/* 🍽️ DINING FEATURES (FIXED POSITION) */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <DiningTransactions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <DiningHelp />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;