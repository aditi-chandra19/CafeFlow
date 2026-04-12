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
import Explore from "./pages/Explore";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/summary" element={<OrderSummary />} />

        <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
        <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantMenu /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/delivery" element={<ProtectedRoute><Delivery /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/tracking" element={<ProtectedRoute><LiveTracking /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/book-table" element={<ProtectedRoute><BookTable /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><DiningTransactions /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><DiningHelp /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
